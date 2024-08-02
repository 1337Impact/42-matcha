import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
// import { Route, Routes } from "react-router-dom";
// import SignIn from "../auth/signin";
// import SignUp from "../auth/signup";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);

  useEffect(() => {
    console.log("User: ", user);
  }, [user]);
  return (
    <div className="w-screen relative h-screen">
      {user && !user.is_verified && (
        <div className="w-full p-1 bg-yellow-400">
          <div className="text-sm text-center">
            Verfiy your email address to access all features.
          </div>
        </div>
      )}
      <Navbar />
      {/* Rest of the code */}
      <Footer />
    </div>
  );
};

export default Home;
