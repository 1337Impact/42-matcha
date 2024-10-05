import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import CompleteProfile from "../components/complete-profile";
import { SocketProvider } from "../contexts/SocketContext";
import { RootState } from "../store";
import Chat from "./chat";
import ChatRoom from "./chat/chat-room";
import Connections from "./connections";
import Home from "./index";
import Profile from "./profile";
import History from "./profile/history";
import Likes from "./profile/likes";
import Views from "./profile/views";
import Settings from "./settings";
import Map from "./map";
import ScheduleDate from "./connections/schedule_date";
import VideoCall from "./chat/video-call";
import RespondToScheduleRequest from "./connections/schedule_date/eventId";
import Dates from "./connections/dates";
import { CallDialog } from "../components/call-dialog/call-dialog";

const ProtectedLayout: React.FC = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  let [searchParams, setSearchParams] = useSearchParams();
  const [isOpenProfileCompleted, setIsOpenProfileCompleted] = useState(false);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        if (!user) return;
        const profileCompleted = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/profile/iscompleted`,
          { user: user.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (profileCompleted.data.isCompleted == false) {
          setIsOpenProfileCompleted(true);
        }
      } catch (err) {
        toast.error("Failed to check profile completion");
      }
    };
    checkProfileCompletion();
  } , [user]);

  useEffect(() => {
    if (searchParams.get("profilecompleted") == "false") {
      setIsOpenProfileCompleted(true);
    }
  }, [searchParams]);

  const handleCloseProfileCompletion = () => {
    setIsOpenProfileCompleted(false);
    setSearchParams();
  };

  return (
    <SocketProvider>
      <CallDialog />
      <div className="h-screen bg-gray-100 flex flex-col">
        {isOpenProfileCompleted && (
          <CompleteProfile handleClose={handleCloseProfileCompletion} />
        )}
        {user && !user.is_verified && (
          <div className="w-full mx-auto max-w-[786px] p-1 bg-yellow-400">
            <div className="text-sm text-center">
              Verfiy your email address to access all features.
            </div>
          </div>
        )}
        <Navbar />
        <main className="flex-1 overflow-auto w-full max-w-[1000px] mx-auto h-auto bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/connections/schedule_date/" element={<ScheduleDate />} />
            <Route path="/connections/schedule_date/:eventId" element={<RespondToScheduleRequest />} />
            <Route path="/connections/dates" element={<Dates />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:profileId" element={<ChatRoom />} />
            <Route path="/chat/:profileId/video-call" element={<VideoCall />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route path="/profile/likes" element={<Likes />} />
            <Route path="/profile/views" element={<Views />} />
            <Route path="/profile/history" element={<History />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/map" element={<Map />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SocketProvider>
  );
};

export default ProtectedLayout;
