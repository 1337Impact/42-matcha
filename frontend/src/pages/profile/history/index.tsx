import axios from "axios";
import { useEffect, useState } from "react";
import LikeDislikeButton from "../../../components/like-button/like-button";
import formatDate from "../../../utils/formateDate";

const gethistoryData = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/profile/views/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    //"Error getting history: ", error);
    return [];
  }
};

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    gethistoryData().then((data) => {
      setHistory(
        data.map((profile: any) => ({
          ...profile,
          view_time: formatDate(profile.view_time),
          pictures: JSON.parse(profile.pictures),
        }))
      );
    });
  }, []);
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">History</h1>
      <p className="text-gray-600 text-base mb-4">
        Here are the people whose profiles you viewed.
      </p>
      <ul className="flex flex-col gap-4">
        {history.map((profile: any) => (
          <li
            key={profile.id}
            className="transition-transform transform hover:scale-105"
          >
            <div className="py-3 px-4 w-full rounded-lg bg-red-50 border border-red-200 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="border-2 border-red-300 rounded-full overflow-hidden">
                  <img
                    src={profile.pictures[0]}
                    alt="Profile"
                    className="w-12 h-12 object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-gray-800 font-semibold text-lg">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <h2 className="text-gray-600 text-md">@{profile.username}</h2>
                  <h3 className="text-sm text-gray-500">
                    Viewed on: {profile.view_time}
                  </h3>
                </div>
              </div>
              <LikeDislikeButton profileId={profile.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
