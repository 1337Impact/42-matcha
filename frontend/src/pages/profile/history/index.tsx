import axios from "axios";
import { useEffect, useState } from "react";
import LikeDislikeButton from "../../../components/like-button/like-button";

const gethistoryData = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/api/profile/views/history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error getting history: ", error);
    return [];
  }
};

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    gethistoryData().then((data) => {
      console.log("history: ", data);
      setHistory(data);
    });
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-700 p-2">
        Who viewed your profile?
      </h1>
      <ul className="flex flex-col gap-2 mt-4">
        {history.map((profile: any) => (
          <li key={profile.id}>
            <p className="py-2 px-4 w-full rounded-md bg-red-100 flex items-start justify-between">
              <div>
                <h1 className="text-gray-600 font-semibold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <h2 className="text-gray-500">@{profile.username}</h2>
              </div>
              <LikeDislikeButton profileId={profile.id} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
