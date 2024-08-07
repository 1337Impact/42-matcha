import React from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BiLogOut } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaUserCircle } from "react-icons/fa";

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
  const user = useSelector((state: RootState) => state.userSlice.user);
  const navigate = useNavigate();
  const onLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/signin");
  };
  return (
    <header className="fixed w-full z-50 bg-gray-200 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">Logo</div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                nav links
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AvatarDemo
                profileImage={user?.profile_picture}
                username={user?.username}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <h3>@{user?.username}</h3>
                <h4 className="text-xs text-gray-600">
                  {user?.first_name} {user?.last_name}
                </h4>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 text-red-500 font-bold"
                >
                  <BiLogOut className="text-[18px] text-red-500" />
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
