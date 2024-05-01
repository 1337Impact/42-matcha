import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./login";
import SingUp from "./singup";

const AuthLayout: React.FC = () => {
  return (
    <div className="bg-pink-300 min-h-screen flex items-center justify-center flex-col">
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="singup" element={<SingUp />} />
        </Routes>
        <footer className="mt-4 text-center text-gray-500 text-sm">
          &copy; 2024
        </footer>
    </div>
  );
};

export default AuthLayout;
