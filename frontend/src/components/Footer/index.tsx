import { useState } from "react";
import { Link } from "react-router-dom";

import { FaRegUserCircle, FaUserCircle } from "react-icons/fa";
import { RiHeartsLine, RiHeartsFill } from "react-icons/ri";
import { RiHome4Line, RiHome4Fill } from "react-icons/ri";
import { IoSettingsOutline, IoSettings } from "react-icons/io5";
import { PiChatCenteredTextFill, PiChatCenteredTextBold } from "react-icons/pi";

export default function Footer() {
  const [active, setActive] = useState(2);
  const items = [
    {
      icon: FaRegUserCircle,
      activeIcon: FaUserCircle,
      label: "Profile",
      link: "/profile/me",
    },
    {
      icon: RiHeartsLine,
      activeIcon: RiHeartsFill,
      label: "Connections",
      link: "/connections",
    },
    { icon: RiHome4Line, activeIcon: RiHome4Fill, label: "Home", link: "/" },
    {
      icon: PiChatCenteredTextBold,
      activeIcon: PiChatCenteredTextFill,
      label: "Messages",
      link: "/chat",
    },
    {
      icon: IoSettingsOutline,
      activeIcon: IoSettings,
      label: "Settings",
      link: "/settings",
    },
  ];

  return (
    <footer className="w-full fixed z-50 bottom-0 flex justify-center lg:bottom-3">
      <div className="w-full flex justify-between bg-red-400 py-1 pt-2 px-7 lg:w-[450px] lg:rounded-full lg:px-10">
        {items.map((item, index) => (
          <Link
            className="flex flex-col justify-center items-center transition-all duration-300"
            to={item.link}
            key={index}
            onClick={() => setActive(index)}
          >
            <div className="w-8 h-8 text-gray-600 transition-transform duration-300 transform hover:scale-110">
              {active === index ? (
                <item.activeIcon className="w-full h-full transform scale-125" />
              ) : (
                <item.icon className="w-full h-full" />
              )}
            </div>
            <h1 className="text-[13px] font-medium text-gray-600">
              {item.label}
            </h1>
          </Link>
        ))}
      </div>
    </footer>
  );
}
