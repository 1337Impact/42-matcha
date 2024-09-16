import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import Home from "./index";
import Profile from "./profile";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompleteProfile from "../components/complete-profile";
import Likes from "./profile/likes";
import Views from "./profile/views";
import History from "./profile/history";
import Connections from "./connections";
import Chat from "./chat";
import ChatRoom from "./chat/chat-room";
import { SocketProvider } from "../contexts/SocketContext";
import axios from "axios";
import Settings from "./settings";
import { toast } from "react-toastify";

const ProtectedLayout: React.FC = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  let [searchParams, setSearchParams] = useSearchParams();
  const [isOpenProfileCompleted, setIsOpenProfileCompleted] = useState(false);
  const token = window.localStorage.getItem("token");

  useEffect(() => {
    /// check if the user already completed the profile setup
    console.log("Checking if profile is completed", user);
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
        console.log("Profile completed: ", profileCompleted.data.isCompleted);
        if (profileCompleted.data.isCompleted == false) {
          setIsOpenProfileCompleted(true);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to check profile completion");
      }
    };
    const userGeoLocation = async () => {
      try {
        if (!user) return;
        const geoLocation = await axios.post(
          `${import.meta.env.VITE_APP_BACKEND_URL}/api/profile/geolocation`,
          { user: user.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User GeoLocation: ", geoLocation.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to get user location");
      }
    };

    userGeoLocation();
    checkProfileCompletion();
  }, [user]);

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
      <div className="h-screen bg-gray-100 flex flex-col">
        {isOpenProfileCompleted && (
          <CompleteProfile handleClose={handleCloseProfileCompletion} />
        )}
        {user && !user.is_verified && (
          <div className="w-full p-1 bg-yellow-400">
            <div className="text-sm text-center">
              Verfiy your email address to access all features.
            </div>
          </div>
        )}
        <Navbar />
        <main className="flex-1 overflow-auto xl:w-[1200px] mx-2 md:mx-6 lg:mx-8 xl:mx-auto h-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connections" element={<Connections />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:profileId" element={<ChatRoom />} />
            <Route path="/profile/:profileId" element={<Profile />} />
            <Route path="/profile/likes" element={<Likes />} />
            <Route path="/profile/views" element={<Views />} />
            <Route path="/profile/history" element={<History />} />
            <Route path="/Settings" element={<Settings />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </SocketProvider>
  );
};

export default ProtectedLayout;
