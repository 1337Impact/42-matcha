import axios from "axios";
import { FaHeart } from "react-icons/fa";

export default function LikeButton({ profileId }: { profileId: string }) {
  const token = window.localStorage.getItem("token");
  const handleLike = async () => {
    await axios.post(
      `${import.meta.env.VITE_APP_API_URL}/profile/like`,
      {
        profileId: profileId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("liked: ", profileId);
  };
  return (
    <button onClick={handleLike} className="text-red-400">
      <FaHeart className="w-8 h-8" />
    </button>
  );
}
