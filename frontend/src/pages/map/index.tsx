import axios from "axios";
import { useEffect, useState } from "react";
import Map from "../../components/Map";

const getUsers = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/profile/map`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

const getUserLocation = async (): Promise<any> => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return [];
  }
};

interface UserMarker {
  id: string;
  position: number[];
  popup: React.ReactNode;
}

export default function Page() {
  const [users, setUsers] = useState<UserMarker[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    getUserLocation().then((data) => {
      setUserLocation({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });
    getUsers().then((data) => {
      setUsers(
        data.map((user: any) => ({
          id: user.id,
          position: [user.latitude, user.longitude],
          popup: <div>{user.id}</div>,
        }))
      );
    });
  }, []);

  return (
    <div className="max-w-[1000] w-full h-full">
      <Map
        latitude={userLocation?.latitude || 0}
        longitude={userLocation?.longitude || 0}
        markers={users}
      />
    </div>
  );
}
