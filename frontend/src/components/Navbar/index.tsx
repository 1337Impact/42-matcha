import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUserCircle } from "react-icons/fa";
import ProfileDropdown from "./profile-dropdown";
import Notifications from "../notifications/notifications";

export function AvatarDemo({
  profileImage,
  username,
}: {
  profileImage: string | undefined;
  username: string | undefined;
}) {
  return (
    <Avatar>
      <AvatarImage src={profileImage} alt={username || "avatar"} />
      <AvatarFallback>
        <FaUserCircle className="h-10 w-10" />
      </AvatarFallback>
    </Avatar>
  );
}

const Navbar: React.FC = () => {
  return (
    <header className="w-full z-50 text-gray-700">
      <div className="xl:w-[1200px] py-4 mx-4 md:mx-6 lg:mx-8 xl:mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-500 text-xl font-bold">Logo</div>
          </div>
          <div className="flex gap-1 items-center">
            <Notifications />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
