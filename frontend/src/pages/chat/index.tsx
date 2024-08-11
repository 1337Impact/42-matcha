import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LikeDislikeButton from "../../components/like-button/like-button";
import formatDate from "../../utils/formateDate";
import { Link } from "react-router-dom";
import { SocketContext } from "../../contexts/SocketContext";

const getConnectionsData = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      "http://localhost:3000/api/profile/connections",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error getting connections: ", error);
    return [];
  }
};

export default function Chat() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    getConnectionsData().then((data) => {
      console.log("connections: ", data);
      setConnections(data);
    });
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-700 p-2">Messages</h1>
      <ul className="flex flex-col gap-2 mt-4">
        {connections.map((profile: any) => (
          <li key={profile.id}>
            <Link to={`/chat/${profile.id}`}>
            <p className="py-2 px-4 w-full rounded-md bg-red-100 flex items-start justify-between">
              <div>
                <h1 className="text-gray-600 font-semibold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <h2 className="text-gray-500">@{profile.username}</h2>
                <h3 className="text-sm text-gray-500">
                  {formatDate(profile.like_time)}
                </h3>
              </div>
              <LikeDislikeButton profileId={profile.id} />
            </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
