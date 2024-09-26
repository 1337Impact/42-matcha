import React, { useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../../contexts/SocketContext";
import { useParams } from "react-router-dom";

const VideoCall: React.FC = () => {
  const params = useParams();
  const socket = useContext(SocketContext);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [permissionError, setPermissionError] = useState(false);

  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const peerConnection = new RTCPeerConnection(configuration);

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localVideoRef.current) {
        console.log("localVideoRef:", localVideoRef.current);
        localVideoRef.current.srcObject = stream as MediaProvider;
      }
    } catch (error) {
      setPermissionError(true);
      console.error("Error accessing media devices.", error);
    }
  };

  async function makeCall() {
    socket?.on("video-answer", async (answer) => {
      console.log("video-answer", answer);
      if (answer) {
        const remoteDesc = new RTCSessionDescription(answer);
        await peerConnection.setRemoteDescription(remoteDesc);
      }
    });
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket?.emit("video-offer", {
      receiver_id: params.profileId,
      offer: offer,
    });
  }

  useEffect(() => {
    socket?.on("video-offer", async (offer) => {
      console.log("video-offer", offer);
      peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket?.emit("video-answer", {
        receiver_id: params.profileId,
        answer: answer,
      });
    });
  }, [socket]);

  return (
    <div>
      test 123
      {permissionError && <div className="text-red-400">Permission Error</div>}
      <button onClick={initCamera}>access camera</button>
      {/* <video ref={localVideoRef} autoPlay playsInline controls={false} /> */}
      <h1 className="text-red-500">1. Make call</h1>
      <button onClick={makeCall}>Make Call</button>
      {/* <h1>2. Recieve call</h1>
      <form onSubmit={recieveCall}>
        <input type="text" id="recieve-offer" placeholder="Enter Offre value" />
        <button type="submit">Recieve Call</button>
      </form> */}
    </div>
  );
};

export default VideoCall;
