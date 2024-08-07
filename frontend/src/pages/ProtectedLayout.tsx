import React, { useEffect, useState } from "react";
import { Route, Routes, useSearchParams } from "react-router-dom";
import Home from "./index";
import Profile from "./profile";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompleteProfile from "../components/complete-profile";

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
    <div className="w-screen relative h-screen">
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
      <main className="py-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:profileId" element={<Profile />} />
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default ProtectedLayout;
