import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { RiDislikeLine } from "react-icons/ri";
import { toast } from "react-toastify";

export default function LikeDislikeButton({
  profileId,
}: {
  profileId: string;
}) {
  const token = window.localStorage.getItem("token");
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeDislike = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/profile/likes/like-profile`,
        {
          profileId: profileId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLiked(!isLiked);
      toast.success(res.data);
    } catch (error: any) {
      console.error("Error liking profile:", error);
      toast.error("Failed to like profile");
    }
  };

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_APP_API_URL}/profile/likes/is-profile-liked`,
        {
          params: {
            profileId,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setIsLiked(response.data);
      })
      .catch((error) => {
        console.log("Error getting likes:", error);
      });
  }, []);

  return (
    <button
      onClick={handleLikeDislike}
      className="text-red-400 hover:scale-105"
    >
      {isLiked ? (
        <RiDislikeLine className="w-8 h-8" />
      ) : (
        <FaRegHeart className="w-8 h-8" />
      )}
    </button>
  );
}
