import React from "react";
import Notifications from "../notifications/notifications";
import ProfileDropdown from "./profile-dropdown";

const Navbar: React.FC = () => {
  return (
    <header className="w-full max-w-[1000px] mx-auto z-50 bg-white text-gray-700 border-b border-gray-200 shadow-md">
      <div className="py-4 mx-4 md:mx-6 lg:mx-8 xl:mx-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/">
              <div className="text-red-500 text-2xl font-bold flex text-center gap-1 items-center">
                <img src="/Vector.svg" alt="logo" className="h-10" />
                <span className="text-red-500 md:inline hidden ">Matcha</span>
              </div>
            </a>
          </div>
          <div className="flex gap-4 items-center">
            <Notifications />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
