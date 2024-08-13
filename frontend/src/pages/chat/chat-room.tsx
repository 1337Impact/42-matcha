import { useContext, useEffect, useState } from "react";
import { GrSend } from "react-icons/gr";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store";

interface Message {
  id: string;
  is_me: boolean;
  content: string;
}

interface IncomingMessage {
  id: string;
  content: string;
  sender_id: string;
}

export default function ChatRoom() {
  const params = useParams();
  // const user = useSelector((state: RootState) => state.userSlice.user);
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState<Message[]>([]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const message = e.target[0].value;
    setMessages((prev) => [...prev, { id: "", content: message, is_me: true }]);
    console.log("submitting message: ", message);
    socket?.emit("message", {
      receiver_id: params.profileId,
      content: message,
    });
    e.target[0].value = "";
  };

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: IncomingMessage) => {
        if (message.sender_id !== params.profileId) return;
        setMessages((prev) => [
          ...prev,
          { id: message.id, content: message.content, is_me: false },
        ]);
      });
    }
    return () => {
      socket?.off("message");
    };
  }, [socket]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 h-full">
        <div className="h-full flex flex-col gap-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-full flex ${message.is_me && "justify-end"}`}
            >
              <p>{message.content}</p>
            </div>
          ))}
        </div>
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
