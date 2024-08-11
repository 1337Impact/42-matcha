import React, { useContext, useEffect, useState } from "react";
import ProfileCard from "../components/profile-card/profile-card";
import { SocketContext } from "../contexts/SocketContext";
import axios from "axios";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  pictures: string[];
}

const getProfiles = async (token: string): Promise<Profile[]> => {
  const result = await axios.get("http://localhost:3000/api/profile/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = result.data;
  return data.map((profile: any) => {
    const pictures = JSON.parse(profile.pictures);
    return {
      id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      username: profile.username,
      pictures,
    };
  });
};

const Home: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      socket.on("message", (message: string) => {
        console.log("Message received: ", message);
      });
      return () => {
        socket.off("message");
      };
    }
  }, [socket]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    token &&
      getProfiles(token).then((data) => {
        setProfiles(data);
      });
  }, []);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {profiles.map((profile, index) => (
          <ProfileCard profile={profile} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Home;
