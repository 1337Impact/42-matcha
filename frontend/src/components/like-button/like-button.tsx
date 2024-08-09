import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { IoHeartDislikeOutline } from "react-icons/io5";
import { toast } from "react-toastify";

export default function LikeButton({ profileId }: { profileId: string }) {
  const token = window.localStorage.getItem("token");
  const handleLike = async () => {
    try {
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
      toast.success("Profile liked successfully");
    } catch (error: any) {
      console.error("Error liking profile:", error);
      toast.error("Failed to like profile");
    }
  };
  return (
    <button onClick={handleLike} className="text-red-400">
      <FaRegHeart className="w-8 h-8" />
    </button>
  );
}
