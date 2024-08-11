import { useContext, useEffect, useState } from "react";
import { GrSend } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function ChatRoom() {
  const params = useParams();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<string[]>([]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const message = e.target[0].value;
    e.target[0].value = "";
    console.log("submitting message: ", e.target[0].value);
    socket?.emit("message", {
      sender_id: user?.id,
      receiver_id: params.profileId,
      content: message,
    });
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (data: any) => {
        console.log("message: ", data);
        setMessages((prev) => [...prev, data]);
      });
    }
    return () => {
      socket?.off("message");
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 h-full">
        {messages.map((message) => (
          <div key={message}>
            <p>{message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex items-center w-full h-[52px] mb-2 px-2 rounded-full border-2 border-gray-800 bg-gray-200">
          <input
            placeholder="Enter message"
            className="px-2 w-full h-full bg-transparent focus:outline-none"
          />
          <button className="border-2 bg-gray-300 border-gray-800 rounded-full p-2">
            <GrSend className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
}
