import { FaUserCircle } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function ProfileAvatar({
  profileImage,
  username,
}: {
  profileImage: string | undefined;
  username: string | undefined;
}) {
  return (
    <Avatar>
      <AvatarImage className="object-cover" src={profileImage} alt={username || "avatar"} />
      <AvatarFallback>
        <FaUserCircle className="h-10 w-10" />
      </AvatarFallback>
    </Avatar>
  );
}
