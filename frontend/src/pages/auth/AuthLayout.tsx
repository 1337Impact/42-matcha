import React from "react";
import { Route, Routes } from "react-router-dom";
import SignIn from "./signin";
import SignUp from "./signup";
import ResetPassword from "./resetPassword";
import UpdatePassword from "./resetPassword/[token]";

const AuthLayout: React.FC = () => {
  return (
    <div className="bg-pink-200 min-h-screen flex items-center justify-center flex-col">
      <div className="min-w-[330px] mx-6 lg:w-[1000px] h-[600px] lg:h-[650px] rounded-2xl bg-white flex shadow-xl">
        <img
          className="hidden lg:block lg:w-[45%] h-full object-cover rounded-l-2xl"
          src={"/signup_background.jpg"}
          alt="background_img"
        />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/resetPassword/:token" element={<UpdatePassword />} />
        </Routes>
      </div>
      <footer className="mt-4 text-center text-gray-500 text-sm">
        &copy; 2024
      </footer>
    </div>
  );
};

export default AuthLayout;
