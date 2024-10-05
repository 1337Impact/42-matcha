import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { BiLogOut } from "react-icons/bi";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Link } from "react-router-dom";

import { FaMapMarkedAlt, FaRegHeart } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { MdEventAvailable, MdHistory } from "react-icons/md";
import { ProfileAvatar } from "../profile-avatar/profile-avatar";

const ProfileDropdown: React.FC = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const onLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/signin");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <ProfileAvatar
          profileImage={user?.profile_picture}
          username={user?.username}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[180px]">
        <DropdownMenuLabel>
          <h3>@{user?.username}</h3>
          <h4 className="text-xs text-gray-600">
            {user?.first_name} {user?.last_name}
          </h4>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleClose}>
          <FaRegUserCircle className="mr-2" />
          <Link to={`/profile/${user?.id}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClose}>
          <FaRegHeart className="mr-2" />
          <Link to="/profile/likes">Likes</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClose}>
          <FaRegEye className="mr-2" />
          <Link to="/profile/views">Views</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClose}>
          <MdHistory className="mr-2" />
          <Link to="/profile/history">History</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleClose}>
          <FaMapMarkedAlt className="mr-2" />
          <Link to="/map">Map</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MdEventAvailable className="mr-2" />
          <Link to="/connections/dates">Dates</Link>
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
  );
};

export default ProfileDropdown;
