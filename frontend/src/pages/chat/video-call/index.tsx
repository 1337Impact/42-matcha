import { useRef, useEffect, useState, useContext } from "react";
import { FiVideoOff, FiMic, FiMicOff, FiVideo } from "react-icons/fi";
import { SocketContext } from "../../../contexts/SocketContext";
import { useParams, useSearchParams } from "react-router-dom";

const configuration = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function App() {
  let [searchParams] = useSearchParams();
  const params = useParams();
  const socket = useContext(SocketContext);

  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream | null>(null);

  const startButton = useRef<HTMLButtonElement>(null);
  const hangupButton = useRef<HTMLButtonElement>(null);
  const muteAudButton = useRef<HTMLButtonElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);

  const [audiostate, setAudio] = useState(false);

  useEffect(() => {
    socket?.on("rtc-message", async (e) => {
      if (!localStream.current) {
        console.log("not ready yet");
        return;
      }
      console.log("rtc-message....", e.type);
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
          if (pc.current) {
            hangup();
          }
          break;
        default:
          console.log("unhandled", e);
          break;
      }
    });

    return () => {
      socket?.off("rtc-message");
    };
  }, [socket]);

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
    };
    init();
    startB();
  }, []);

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
    if (pc.current) {
      pc.current.close();
      pc.current = null;
    }
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;
    remoteStream.current = null;

    if (startButton.current) startButton.current.disabled = false;
    if (hangupButton.current) hangupButton.current.disabled = true;
    if (muteAudButton.current) muteAudButton.current.disabled = true;
  }

  const startB = async () => {
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

    if (startButton.current) startButton.current.disabled = true;
    if (hangupButton.current) hangupButton.current.disabled = false;
    if (muteAudButton.current) muteAudButton.current.disabled = false;

    socket?.emit("rtc-message", {
      receiver_id: params.profileId,
      type: "ready",
    });
  };

  const hangB = async () => {
    hangup();
    socket?.emit("rtc-message", { receiver_id: params.profileId, type: "bye" });
  };

  function muteAudio() {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !track.enabled));
      setAudio(!audiostate);
    }
  }

  return (
    <main className="w-screen max-w-[1000px]">
      <div className="w-full text-center-center p-4 bg-red-300">
        Call has been rejected by the user. Please try again later.
      </div>
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
          ref={hangupButton}
          onClick={hangB}
        >
          Hangup <FiVideoOff />
        </button>
        <button
          className="flex p-2 border border-red-300 gap-2 rounded-md"
          ref={muteAudButton}
          onClick={muteAudio}
        >
          Mute {audiostate ? <FiMic /> : <FiMicOff />}
        </button>
      </div>
    </main>
  );
}

export default App;
