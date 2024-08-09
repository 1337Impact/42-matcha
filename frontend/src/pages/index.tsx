import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ProfileCard from "../components/profile-card/profile-card";

interface Profile {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  pictures: string[];
}

const getProfiles = async (token: string) : Promise<Profile[]> => {
  const result = await fetch("http://localhost:3000/api/profile/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await result.json();
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
  const user = useSelector((state: RootState) => state.userSlice.user);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    token &&
      getProfiles(token).then((data) => {
        console.log("profiles: ", data);
        setProfiles(data);
      });
  }, []);

  return (
    <div className="mt-4">
      <h1></h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 px-2">
        {profiles.map((profile, index) => (
          <ProfileCard profile={profile} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Home;
