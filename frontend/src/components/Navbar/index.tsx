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
import { Link } from "react-router-dom";

import { FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";


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
    <header className="fixed w-full z-50 text-gray-700">
      <div className="xl:w-[1200px] py-4 mx-4 md:mx-6 lg:mx-8 xl:mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-500 text-xl font-bold">Logo</div>
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
              <DropdownMenuItem>
                <FaRegUserCircle className="mr-2" />
                <Link to={`/profile/${user?.id}`}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FaRegHeart className="mr-2" />
                <Link to="/profile/likes">Likes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FaRegEye className="mr-2" />
                <Link to="/profile/views">Views</Link>
              </DropdownMenuItem>

              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
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
