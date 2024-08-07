import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Home: React.FC = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);

  return (
    <div className="w-screen h-screen">
      <h1>No posts found</h1>
    </div>
  );
};

export default Home;
