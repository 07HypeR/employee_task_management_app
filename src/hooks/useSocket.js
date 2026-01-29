import { useEffect, useRef } from "react";
import socketService from "@services/socket";

export const useSocket = (user) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (user && !isInitialized.current) {
      const token = localStorage.getItem("token");
      if (token) {
        socketService.connect(token);
        isInitialized.current = true;
      }
    }

    return () => {
      // Only disconnect when component unmounts for the last time
      if (isInitialized.current) {
        socketService.disconnect();
        isInitialized.current = false;
      }
    };
  }, [user]);

  return socketService;
};

export default useSocket;
