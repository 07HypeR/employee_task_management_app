import React, { useState, useEffect } from "react";
import socketService from "@services/socket";

/**
 * WebSocket Connection Status Indicator
 * Add this component to your layout to show real-time connection status
 */
const SocketStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(socketService.isConnected);
    };

    // Check connection status every second
    const interval = setInterval(checkConnection, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#1c1c1c]/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-lg"
      title={isConnected ? "WebSocket Connected" : "WebSocket Disconnected"}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected
            ? "bg-emerald-500 animate-pulse"
            : "bg-gray-500 opacity-50"
        }`}
      />
      <span className="text-xs font-bold text-gray-400">
        {isConnected ? "Live" : "Offline"}
      </span>
    </div>
  );
};

export default SocketStatus;
