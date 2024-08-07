import axios from "axios";

const getProfileData = async (profileId: string) => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3000/api/profile", {
    params: {
      profileId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export { getProfileData };
