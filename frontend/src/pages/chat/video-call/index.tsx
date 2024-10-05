import { useRef, useEffect, useContext } from "react";
import { FiVideoOff } from "react-icons/fi";
import { SocketContext } from "../../../contexts/SocketContext";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function App() {
  const params = useParams();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    socket?.on("rtc-message", async (e) => {
      if (!localStream.current) {
        console.log("not ready yet");
        return;
      }
      switch (e.type) {
        case "offer":
          await handleOffer(e);
          break;
        case "answer":
          await handleAnswer(e);
          break;
        case "candidate":
          await handleCandidate(e);
          break;
        case "ready":
          if (pc.current) {
            console.log("already in call, ignoring");
            return;
          }
          await makeCall();
          break;
        case "bye":
          hangup();
          break;
        default:
          console.log("unhandled", e);
          break;
      }
    });

    return () => {
      socket?.off("rtc-message");
    };
  }, [socket, params, navigate]);

  useEffect(() => {
    const init = async () => {
      try {
        localStream.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: { echoCancellation: true },
        });
        if (localVideo.current)
          localVideo.current.srcObject = localStream.current;
      } catch (err) {
        console.log(err);
      }

      socket?.emit("rtc-message", {
        receiver_id: params.profileId,
        type: "ready",
      });
    };
    init();
  }, [socket, params]);

  function closeCamera() {
    if (!localStream.current) return;
    console.log("closing camera");
    const tracks = localStream.current.getTracks();
    tracks.forEach((track) => track.stop());
  }

  async function makeCall() {
    try {
      pc.current = new RTCPeerConnection(configuration);

      pc.current.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate?.sdpMid,
          sdpMLineIndex: e.candidate?.sdpMLineIndex,
        };
        socket?.emit("rtc-message", {
          receiver_id: params.profileId,
          ...message,
        });
      };

      pc.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteStream.current = e.streams[0];
          remoteVideo.current.srcObject = remoteStream.current;
        }
      };

      localStream.current
        ?.getTracks()
        .forEach((track) =>
          pc.current?.addTrack(track, localStream.current as MediaStream)
        );

      const offer = await pc.current.createOffer();
      await pc.current.setLocalDescription(offer);

      socket?.emit("rtc-message", {
        receiver_id: params.profileId,
        type: "offer",
        sdp: offer.sdp,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleOffer(offer: any) {
    if (pc.current) {
      console.error("existing peerconnection");
      return;
    }

    try {
      pc.current = new RTCPeerConnection(configuration);

      pc.current.onicecandidate = (e) => {
        const message = {
          type: "candidate",
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate?.sdpMid,
          sdpMLineIndex: e.candidate?.sdpMLineIndex,
        };
        socket?.emit("rtc-message", {
          receiver_id: params.profileId,
          ...message,
        });
      };

      pc.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteStream.current = e.streams[0];
          remoteVideo.current.srcObject = remoteStream.current;
        }
      };

      await pc.current.setRemoteDescription(new RTCSessionDescription(offer));

      localStream.current
        ?.getTracks()
        .forEach((track) =>
          pc.current?.addTrack(track, localStream.current as MediaStream)
        );

      const answer = await pc.current.createAnswer();
      await pc.current.setLocalDescription(answer);

      socket?.emit("rtc-message", {
        receiver_id: params.profileId,
        type: "answer",
        sdp: answer.sdp,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function handleAnswer(answer: any) {
    if (!pc.current) {
      console.error("no peerconnection");
      return;
    }
    try {
      await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCandidate(candidate: any) {
    try {
      if (!pc.current) {
        console.error("no peerconnection");
        return;
      }
      if (candidate) {
        await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (e) {
      console.log(e);
    }
  }

  function hangup() {
    closeCamera();
    navigate(`/chat/${params.profileId}`);
    toast.success("Call ended");
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
  }

  const hangB = async () => {
    hangup();
    socket?.emit("rtc-message", { receiver_id: params.profileId, type: "bye" });
  };

  return (
    <main className="w-screen max-w-[1000px]">
      <div className="w-full">
        <video
          ref={localVideo}
          className="video-item"
          autoPlay
          playsInline
        ></video>
        <video
          ref={remoteVideo}
          className="video-item"
          autoPlay
          playsInline
        ></video>
      </div>

      <div className="flex gap-2 items-center">
        <button
          className="flex p-2 border border-red-300 gap-2 rounded-md"
          onClick={hangB}
        >
          Hangup <FiVideoOff />
        </button>
      </div>
    </main>
  );
}

export default App;
