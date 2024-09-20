import React, { createContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  const socketInstance = io(import.meta.env.VITE_APP_SOCKET_URL as string, {
    extraHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  useEffect(() => {
    socketInstance.on("connect", () => {
      //"Connected to server");
    });
    return () => {
      //"Disconnecting from server");  
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
