import { io, Socket } from "socket.io-client";
import { apiConfig } from "./apiConfig";

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const connectSocket = () => {
  const token = apiConfig.getToken();
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { token },
    });
  } else if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
  return socket;
};

export default connectSocket;
