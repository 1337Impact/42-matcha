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

const ProtectedLayout: React.FC = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  let [searchParams, setSearchParams] = useSearchParams();
  const [isOpenProfileCompleted, setIsOpenProfileCompleted] = useState(false);

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
    <div className="">
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
      <main className="py-16 xl:w-[1200px] mx-2 md:mx-6 lg:mx-8 xl:mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/profile/:profileId" element={<Profile />} />
          <Route path="/profile/likes" element={<Likes />} />
          <Route path="/profile/views" element={<Views />} />
          <Route path="/profile/history" element={<History />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
