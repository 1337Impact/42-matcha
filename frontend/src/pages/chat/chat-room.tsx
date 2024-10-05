import { useContext, useEffect, useState } from "react";
import { GrSend } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";
import Message from "../../components/message/message";
import axios from "axios";
import { ProfileAvatar } from "../../components/profile-avatar/profile-avatar";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FaVideo } from "react-icons/fa";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

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

const getMessages = async (token: string, profileId: string) => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/message`, {
      params: {
        profileId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.map((msg: any) => ({
      id: msg.id,
      content: msg.content,
      is_me: msg.receiver_id === profileId,
    }));
  } catch (error) {
    //"Error getting messages: ", error);
    return null;
  }
};
const getProfileData = async (token: string, profileId: string) => {
  const res = await axios.get(`${import.meta.env.VITE_APP_API_URL}/profile`, {
    params: {
      profileId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //"profile data: ", res.data);
  return {
    username: res.data.username,
    first_name: res.data.first_name,
    last_name: res.data.last_name,
    profile_picture: JSON.parse(res.data.pictures)[0],
  };
};

export default function ChatRoom() {
  const params = useParams();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const socket = useContext(SocketContext);
  const [profile, setProfile] = useState<any>({});
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const container = document.getElementById("message-container");
    if (container) {
      container.scrollBy({
        top: container.scrollHeight,
        behavior: "instant",
      });
    }
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && params.profileId) {
      getMessages(token, params.profileId).then((msgs) => setMessages(msgs));
      getProfileData(token, params.profileId).then((data) => {
        setProfile(data);
      });
    }
  }, [params]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const message = e.target[0].value;
    if (!message) return;
    setMessages((prev) => [...prev, { id: "", content: message, is_me: true }]);
    socket?.emit("message", {
      receiver_id: params.profileId,
      content: message,
    });
    e.target[0].value = "";
  };

  const handleCall = () => {
    socket?.emit("request-call", {
      receiver_id: params.profileId,
      sender_id: user?.id,
    });
    navigate(`/chat/${params.profileId}/video-call`);
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
    <div className="flex flex-col gap-1 p-1 pt-4 h-full lg:px-5">
      <div className="w-full flex items-center justify-between py-2 bg-white border-gray-300">
        <Link
          to={`/profile/${params.profileId}`}
          className="flex items-center gap-4"
        >
          <ArrowLeft
            onClick={() => {
              window.history.back();
            }}
            className="cursor-pointer text-black"
            size={24}
          />
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 rounded-full border-2 border-red-400">
              <ProfileAvatar
                profileImage={profile.profile_picture}
                username={profile.username}
              />
            </div>
            <div>
              <h1 className="text-gray-700 font-bold">
                {profile.first_name} {profile.last_name}
              </h1>
            </div>
          </div>
        </Link>
        <button
          onClick={handleCall}
          className="text-green-400 hover:text-green-600 mr-4"
        >
          <FaVideo size={26} />
        </button>
      </div>
      <div id={"message-container"} className="flex-1 p-2 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`w-full flex ${message.is_me && "justify-end"}`}
            >
              <Message message={message} />
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={onSubmit} className="w-full mb-1 p-1">
        <div className="flex items-center w-full h-[52px] px-2 rounded-full border-1 border-gray-700 bg-gray-200">
          <input
            placeholder="Enter message"
            className="px-2 w-full h-full bg-transparent focus:outline-none"
          />
          <button className="p-2">
            <GrSend className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </form>
    </div>
  );
}
