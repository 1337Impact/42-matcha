import axios from "axios";
import { useEffect, useState } from "react";
import LikeDislikeButton from "../../components/like-button/like-button";
import formatDate from "../../utils/formateDate";
import { BsThreeDotsVertical } from "react-icons/bs";

const getConnectionsData = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/profile/connections`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return [];
  }
};

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  useEffect(() => {
    getConnectionsData().then((data) => {
      setConnections(
        data.map((like: any) => ({
          ...like,
          like_time: formatDate(like.like_time),
          pictures: JSON.parse(like.pictures),
        }))
      );
    });
  }, []);

  const openEventhandler = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-700 pt-2 pb-2 text-start">
        Your matches
      </h1>
      <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {connections.map((profile: any) => (
          <li key={profile.id} className="flex justify-start">
            <div className="relative rounded-xl overflow-hidden lg:w-[15rem] lg:h-[20rem] w-[10rem] h-[15rem] shadow-lg transition-transform transform hover:scale-105">
              {openMenu && (
                <div className="absolute top-11 right-0 z-30 bg-white p-4 rounded-md flex-row item-center gap-2">
                  <button
                    onClick={() => {
                      window.location.href = `/connections/schedule_date/?user_id=${profile.id}`;
                    }}
                    className="text-gray-600 text-md p-2 hover:bg-gray-200"
                  >
                    Schedule a date
                  </button>
                </div>
              )}
              <img
                src={profile.pictures[0]}
                key={profile.id}
                alt="Profile"
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-0 w-full z-10 bg-gradient-to-t from-black to-transparent h-2/3"></div>
              <div className="absolute top-2 right-1 z-10 rounded-full bg-white">
                <button
                  onClick={openEventhandler}
                  className="text-gray-600 text-xl p-2"
                >
                  <BsThreeDotsVertical className="text-gray-600 text-2xl" />
                </button>
              </div>
              <div className="absolute bottom-0 z-20 w-full p-2">
                <div className="flex items-start justify-between">
                  <div className="flex-col items-center gap-2">
                    <h1 className="text-white text-sm tracking-wide font-sans mb-1">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    <h2 className="text-white text-sm font-bold">
                      @{profile.username}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <LikeDislikeButton
                      style={{
                        width: "3rem",
                        height: "3rem",
                        fontSize: "1.5rem",
                        alignItems: "center",
                        padding: "0.5rem",
                        justifyContent: "center",
                        backgroundColor: "#faf7ef",
                        display: "flex",
                      }}
                      profileId={profile.id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
