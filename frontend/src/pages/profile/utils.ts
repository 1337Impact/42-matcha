import axios from "axios";

export interface UserProfile {
  age: number;
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

const handleViewProfile = async (profileId: string, token: string | null) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/profile/views/view-profile`,
      {
        profileId: profileId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    console.error("Error viewing profile:", error.message);
    throw error;
  }
};

const getProfileData = async (profileId: string): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/profile`, {
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
  };
};

export { getProfileData, handleViewProfile };
