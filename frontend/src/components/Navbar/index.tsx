import React from "react";
import ProfileDropdown from "./profile-dropdown";
import Notifications from "../notifications/notifications";

const Navbar: React.FC = () => {
  return (
    <header className="w-full max-w-[786px] mx-auto z-50 bg-white text-gray-700 border-b border-gray-200 shadow-md">
      <div className="py-4 mx-4 md:mx-6 lg:mx-8 xl:mx-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-500 text-xl font-bold">Logo</div>
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
