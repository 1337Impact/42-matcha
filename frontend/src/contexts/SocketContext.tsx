import React, { createContext, useEffect } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketInstance = io(import.meta.env.VITE_APP_SOCKET_URL as string);

  useEffect(() => {
    socketInstance.on("connect", () => {
      console.log("Connected to server");
    });
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
