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

const inotifications = [
  { id: 1, message: "New message from user", read: false, time: "1 min ago" },
  { id: 2, message: "New message from user", read: false, time: "1 min ago" },
  { id: 3, message: "New message from user", read: false, time: "1 min ago" },
  { id: 4, message: "New message from user", read: false, time: "1 min ago" },
  { id: 5, message: "New message from user", read: false, time: "1 min ago" },
];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(inotifications);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", (data) => {
      console.log("notification", data);
      setNotifications(inotifications);
    });
    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="text-red-400 text-4xl">
          <IoIosNotifications />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <h3>Notifications: </h3>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem key={notification.id}>
            <div className="flex px-4 py-2 rounded-md items-center bg-red-200">
              <FaRegHeart className="mr-2" />
              {notification.message}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
