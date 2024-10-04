import { useState } from "react";
import { Link } from "react-router-dom";

import {
  BsChatDots,
  BsChatDotsFill,
  BsPerson,
  BsPersonFill,
} from "react-icons/bs";
import { HiHome, HiOutlineHome } from "react-icons/hi";
import {
  RiHeartsFill,
  RiHeartsLine,
  RiSettings3Fill,
  RiSettings3Line,
} from "react-icons/ri";

export default function Footer() {
  const [active, setActive] = useState(2);
  const items = [
    {
      icon: BsPerson,
      activeIcon: BsPersonFill,
      label: "Profile",
      link: "/profile/me",
    },
    {
      icon: RiHeartsLine,
      activeIcon: RiHeartsFill,
      label: "Connections",
      link: "/connections",
    },
    { icon: HiOutlineHome, activeIcon: HiHome, label: "Home", link: "/" },
    {
      icon: BsChatDots,
      activeIcon: BsChatDotsFill,
      label: "Messages",
      link: "/chat",
    },
    {
      icon: RiSettings3Line,
      activeIcon: RiSettings3Fill,
      label: "Settings",
      link: "/settings",
    },
  ];

  return (
    <footer className="w-full z-50 bottom-0 flex justify-center lg:bottom-3">
      <div className="w-full flex justify-between bg-gray-100 py-1 pt-2 px-7 lg:max-w-[1000px] lg:border-gray-200 lg:border-t-[0.1rem] lg:bg-white ">
        {items.map((item, index) => (
          <Link
            className="flex flex-col justify-center items-center transition-all duration-300 h-10 p-2 mb-1 "
            to={item.link}
            key={index}
            onClick={() => setActive(index)}
          >
            <div className="w-8 h-8transition-transform text-red-400 duration-300 transform hover:scale-110 ">
              {active === index ? (
                <item.activeIcon className="w-full h-full transform scale-125" />
              ) : (
                <item.icon className="w-full h-full" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </footer>
  );
}
