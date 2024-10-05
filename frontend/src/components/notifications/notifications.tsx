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
import axios from "axios";

interface Notification {
  id: number;
  content: string;
  type: string;
  url: string;
}

const getUrl = (type: string, data: any) => {
  if (type === "message") {
    return "/chat";
  } else if (type === "like" || type === "unlike") {
    return "/profile/likes";
  } else if (type === "view") {
    return "/profile/views";
  } else if (type === "date") {
    return `/connections/schedule_date/${data}`;
  } else {
    return "/";
  }
};

const getNotificationIcon = async (token: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/profile/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

const Notifications: React.FC = () => {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getNotificationIcon(token).then((data) => {
        setNotifications(
          data.map((notification: any) => ({
            id: notification.id,
            content:
              notification.content.lenght > 30
                ? notification.content.slice(0, 50)
                : notification.content,
            type: notification.type,
            url: getUrl(notification.type, notification.data),
          }))
        );
      });
    }
  }, []);

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
            url: getUrl(data.type, data.data),
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
      <DropdownMenuContent className="min-w-[180px] max-w-[300px] max-h-[500px] overflow-y-auto md:max-w-[500px]">
        <DropdownMenuLabel>
          <h3>Notifications: </h3>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length ? (
          notifications.map((notification) => (
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
          ))
        ) : (
          <DropdownMenuItem>
            <p>No notifications</p>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
