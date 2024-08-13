import "socket.io";

declare module "socket.io" {
  interface Socket {
    request: {
      user?: any; // Extend with your custom properties
      [key: string]: any; // Allow other properties as well
    };
  }
}
