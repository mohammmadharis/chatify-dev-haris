import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthProvider";

const socketContext = createContext();
export const useSocketContext = () => useContext(socketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [authUser] = useAuth();

  useEffect(() => {
    if (!authUser) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      query: { userId: authUser.user._id, token: authUser.token },
      withCredentials: true,
    });

    setSocket(socket);

    socket.on("getOnlineUsers", (users) => setOnlineUsers(users));

    socket.on("receiveMessage", (message) => {
      // handle incoming messages
      console.log("New message:", message);
    });

    return () => socket.disconnect();
  }, [authUser]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
