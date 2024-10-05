import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function Chat() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    getConnectionsData().then((data) => {
      setConnections(
        data.map((connection: any) => {
          return {
            ...connection,
            pictures: JSON.parse(connection.pictures),
          };
        })
      );
    });
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="w-full xl:px-10">
      <div className="flex items-center justify-between p-6">
        <ArrowLeft size={24} onClick={handleBack} />
        <h1 className="text-xl font-semibold text-gray-700">Chat</h1>
      </div>

      <ul className="flex flex-col gap-6">
        {connections.map((profile: any) => (
          <li key={profile.id}>
            <Link to={`/chat/${profile.id}`}>
              <div className="flex items-center gap-2 rounded-sm hover:bg-gray-100 px-4 py-2">
                <img
                  src={profile.pictures[0]}
                  key={profile.id}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-red-200 border-2"
                />
                <div className="flex justify-between items-start w-11/12">
                  <div>
                    <h1 className="text-lg font-semibold text-gray-700">
                      {profile.first_name} {profile.last_name}
                    </h1>
                    <p className="text-sm text-gray-500">Last message</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm text-gray-700">11:59</p>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
