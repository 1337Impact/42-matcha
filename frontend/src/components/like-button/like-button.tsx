import { FaHeart } from "react-icons/fa";

export default function LikeButton({profileId}: {profileId: string}) {
  const handleLike = () => {
    console.log("liked: ", profileId);
  };
  return (
    <button onClick={handleLike} className="text-red-400">
      <FaHeart className="w-6 h-6" />
    </button>
  );
}
