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

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const onLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/signin");
  };
  return (
    <nav className="bg-pink-400 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">Lobo</div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                nav links
              </div>
            </div>
          </div>
          {/* <button
            onClick={onLogout}
            className="border-2 border-white hover:bg-pink-300 text-white font-bold py-[2px] px-4 rounded"
          >
            Log out
          </button> */}
          <DropdownMenu>
            <DropdownMenuTrigger>Open</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
