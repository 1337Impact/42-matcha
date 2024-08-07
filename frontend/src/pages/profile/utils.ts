import axios from "axios";

export interface UserProfile {
  age: number | null;
  bio: string;
  created_at: string;
  email: string;
  fame_rating: number | null;
  first_name: string;
  gender: string;
  id: string;
  interests: string[];
  is_verified: boolean;
  last_name: string;
  location: string | null;
  password: string;
  pictures: string[];
  sexual_preferences: string;
  updated_at: string;
  username: string;
}

const getProfileData = async (profileId: string): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/api/profile", {
    params: {
      profileId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    ...response.data,
    pictures: JSON.parse(response.data.pictures),
    interests: JSON.parse(response.data.interests),
  };
};

export { getProfileData };
