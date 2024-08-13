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
import { SocketContext } from "../../contexts/SocketContext";
import Badge from "../badge/badge";

const inotifications = [
  {
    id: 1,
    message:
      "New message from userNew message from userNew message from userNew message from user",
    read: false,
    time: "1 min ago",
  },
  { id: 2, message: "New message from user", read: false, time: "1 min ago" },
  { id: 3, message: "New message from user", read: false, time: "1 min ago" },
  { id: 4, message: "New message from user", read: false, time: "1 min ago" },
  { id: 5, message: "New message from user", read: false, time: "1 min ago" },
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
        console.log("notification", data);
        setNotifications((prev) => [
          {
            id: prev.length + 1,
            message: data.message,
            read: false,
            time: "1 min ago",
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
      <DropdownMenuContent className="max-w-[300px] md:max-w-[500px]">
        <DropdownMenuLabel>
          <h3>Notifications: </h3>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id}>
            <div className="flex px-4 py-2 w-full rounded-md items-center bg-red-200">
              <FaRegHeart className="mr-2" />
              <p className="text-wrap">{notification.message}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
