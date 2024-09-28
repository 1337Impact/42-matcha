import React, { useContext, useEffect } from "react";
import ProfileSwiper from "../components/profiles-card-swiper/profiles-card-swiper";
import { SocketContext } from "../contexts/SocketContext";

// interface Profile {
//   id: string;
//   first_name: string;
//   last_name: string;
//   username: string;
//   gender: string;
//   bio: string;
//   tags: string[];
//   pictures: string[];
// }

// const getProfiles = async (token: string): Promise<Profile[]> => {
//   const result = await axios.get("http://10.13.6.5:3000/api/profile/all", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   const data = result.data;
//   return data.map((profile: any) => {
//     const pictures = JSON.parse(profile.pictures);
//     return {
//       id: profile.id,
//       first_name: profile.first_name,
//       last_name: profile.last_name,
//       username: profile.username,
//       bio: profile.bio,
//       tags: profile.interests,
//       gender: profile.gender,
//       pictures,
//     };
//   });
// };

const Home: React.FC = () => {
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

  return (
    <div className="w-full h-full p-1 pt-2">
      <ProfileSwiper />
    </div>
  );
};

export default Home;
