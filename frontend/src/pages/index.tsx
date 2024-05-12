import React from "react";
import Navbar from "../components/Navbar";
// import { Route, Routes } from "react-router-dom";
// import SignIn from "../auth/signin";
// import SignUp from "../auth/signup";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="w-screen relative h-screen">
      <Navbar />
      {/* <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes> */}
      <Footer />
    </div>
  );
};

export default Home;
