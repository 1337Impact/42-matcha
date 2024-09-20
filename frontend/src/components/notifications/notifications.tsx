import React, { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { FaRegHeart } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { RiMessage2Line } from "react-icons/ri";
import { MdOutlineHeartBroken } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";

import { SocketContext } from "../../contexts/SocketContext";
import Badge from "../badge/badge";
import { Link } from "react-router-dom";

const inotifications = [
  {
    id: 1,
    content:
      "New content from userNew content from userNew content from userNew content from user",
    type: "view",
    url: "/",
  },
  { id: 2, content: "New content from user", type: "message", url: "/" },
  { id: 3, content: "New content from user", type: "like", url: "/" },
  { id: 4, content: "New content from user", type: "unlike", url: "/" },
  { id: 5, content: "New content from user", type: "message", url: "/" },
  { id: 3, content: "New content from user", type: "like", url: "/" },
  { id: 4, content: "New content from user", type: "unlike", url: "/" },
  { id: 5, content: "New content from user", type: "message", url: "/" },
  { id: 3, content: "New content from user", type: "like", url: "/" },
  { id: 4, content: "New content from user", type: "unlike", url: "/" },
  { id: 5, content: "New content from user", type: "message", url: "/" },
];

const Notifications: React.FC = () => {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState(inotifications);
  const socket = useContext(SocketContext);

  const resetCounter = () => {
    setUnread(0);
  };

  useEffect(() => {
    if (socket) {
      socket.on("notification", (data) => {
        //"notification", data);
        setNotifications((prev) => [
          {
            id: prev.length + 1,
            content:
              data.content.lenght > 30
                ? data.content.slice(0, 50)
                : data.content,
            type: data.type,
            url:
              data.type == "message"
                ? "/chat"
                : data.type == "like" || data.type === "unlike"
                ? "/profile/likes"
                : data.type === "view"
                ? "/profile/views"
                : "/",
          },
          ...prev,
        ]);
        setUnread((prev) => prev + 1);
      });
    }
    return () => {
      socket?.off("notification");
    };
  }, [socket]);

  return (
    <DropdownMenu onOpenChange={resetCounter}>
      <DropdownMenuTrigger>
        <Badge badgeContent={unread} max={9} color="bg-green-500">
          <div className="text-red-400 text-4xl">
            <IoIosNotifications />
          </div>
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-[300px] max-h-[500px] overflow-y-auto md:max-w-[500px]">
        <DropdownMenuLabel>
          <h3>Notifications: </h3>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id}>
            <Link to={notification.url} className="w-full">
              <div className="flex gap-2 px-2 py-2 w-full rounded-md items-center bg-red-200">
                <div className="">
                  {notification.type === "message" ? (
                    <RiMessage2Line className="text-lg" />
                  ) : notification.type === "like" ? (
                    <FaRegHeart className="text-lg" />
                  ) : notification.type === "unlike" ? (
                    <MdOutlineHeartBroken className="text-lg" />
                  ) : notification.type === "view" ? (
                    <FaRegEye className="text-lg" />
                  ) : (
                    <IoIosNotifications className="text-lg" />
                  )}
                </div>
                <p className="text-wrap">
                  {notification.content.length > 50
                    ? notification.content.slice(0, 50) + "..."
                    : notification.content}
                </p>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
