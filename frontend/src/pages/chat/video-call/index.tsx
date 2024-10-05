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

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);

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
        console.error(err);
      }

      socket?.emit("rtc-message", {
        receiver_id: params.profileId,
        type: "ready",
      });
    };
    init();
  }, [socket, params]);

  useEffect(() => {
    socket?.on("rtc-message", async (e) => {
      if (!localStream.current) {
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
          if (peerConnection.current) {
            console.log("ignoring...");
            return;
          }
          await makeCall();
          break;
        case "bye":
          hangup();
          break;
        default:
          break;
      }
    });

    return () => {
      socket?.off("rtc-message");
    };
  }, [socket, params, navigate]);

  function closeCamera() {
    if (!localStream.current) return;
    const tracks = localStream.current.getTracks();
    tracks.forEach((track) => track.stop());
  }

  async function makeCall() {
    try {
      peerConnection.current = new RTCPeerConnection(configuration);

      peerConnection.current.onicecandidate = (e) => {
        socket?.emit("rtc-message", {
          receiver_id: params.profileId,
          type: "candidate",
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate?.sdpMid,
          sdpMLineIndex: e.candidate?.sdpMLineIndex,
        });
      };

      peerConnection.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteStream.current = e.streams[0];
          remoteVideo.current.srcObject = remoteStream.current;
        }
      };

      localStream.current
        ?.getTracks()
        .forEach((track) =>
          peerConnection.current?.addTrack(track, localStream.current as MediaStream)
        );

      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      socket?.emit("rtc-message", {
        receiver_id: params.profileId,
        type: "offer",
        sdp: offer.sdp,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleOffer(offer: any) {
    if (peerConnection.current) {
      console.error("existing peerconnection");
      return;
    }

    try {
      peerConnection.current = new RTCPeerConnection(configuration);

      peerConnection.current.onicecandidate = (e) => {
        socket?.emit("rtc-message", {
          receiver_id: params.profileId,
          type: "candidate",
          candidate: e.candidate ? e.candidate.candidate : null,
          sdpMid: e.candidate?.sdpMid,
          sdpMLineIndex: e.candidate?.sdpMLineIndex,
        });
      };

      peerConnection.current.ontrack = (e) => {
        if (remoteVideo.current) {
          remoteStream.current = e.streams[0];
          remoteVideo.current.srcObject = remoteStream.current;
        }
      };

      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));

      localStream.current
        ?.getTracks()
        .forEach((track) =>
          peerConnection.current?.addTrack(track, localStream.current as MediaStream)
        );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket?.emit("rtc-message", {
        receiver_id: params.profileId,
        type: "answer",
        sdp: answer.sdp,
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleAnswer(answer: any) {
    if (!peerConnection.current) {
      console.error("no peerconnection");
      return;
    }
    try {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCandidate(candidate: any) {
    try {
      if (!peerConnection.current) {
        console.error("no peerconnection");
        return;
      }
      if (candidate) {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (e) {
      console.error(e);
    }
  }

  function hangup() {
    closeCamera();
    navigate(`/chat/${params.profileId}`);
    toast.success("Call ended");
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  }

  const handleHangup = async () => {
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
          onClick={handleHangup}
        >
          Hangup <FiVideoOff />
        </button>
      </div>
    </main>
  );
}

export default App;
