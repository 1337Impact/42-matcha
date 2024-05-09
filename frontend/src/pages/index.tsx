import React from "react";
import Navbar from "../components/Navbar";
import { Route, Routes } from "react-router-dom";
import SignIn from "../auth/signin";
import SignUp from "../auth/signup";

const Home: React.FC = () => {
  return (
    <div className="w-full">
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default Home;
