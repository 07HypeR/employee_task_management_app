import React, { useState, useEffect } from "react";
import socketService from "@services/socket";

/**
 * WebSocket Debug Panel
 * Add this temporarily to test WebSocket functionality
 */
const SocketDebugPanel = () => {
  const [status, setStatus] = useState({});
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newStatus = socketService.getStatus();
      setStatus(newStatus);
    }, 1000);

    // Listen for all events
    const handleTaskCreated = (task) => {
      addLog(`✅ taskCreated received: ${task.title}`);
    };

    const handleTaskUpdated = (task) => {
      addLog(`✅ taskUpdated received: ${task.title}`);
    };

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);

    return () => {
      clearInterval(interval);
      socketService.off("taskCreated", handleTaskCreated);
      socketService.off("taskUpdated", handleTaskUpdated);
    };
  }, []);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 10));
  };

  const testConnection = () => {
    const socket = socketService.getSocket();
    if (socket) {
      addLog(`Socket ID: ${socket.id}, Connected: ${socket.connected}`);
    } else {
      addLog("Socket not initialized");
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-80 bg-gray-900 border border-emerald-500/20 rounded-2xl p-4 shadow-2xl">
      <h3 className="text-emerald-500 font-bold mb-3 text-sm">
        🔌 WebSocket Debug Panel
      </h3>

      {/* Status */}
      <div className="bg-black/30 rounded-xl p-3 mb-3 text-xs font-mono">
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Connected:</span>
          <span
            className={status.connected ? "text-emerald-500" : "text-red-500"}
          >
            {status.connected ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Socket ID:</span>
          <span className="text-white">
            {status.socketId ? status.socketId.slice(0, 8) + "..." : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Queued Listeners:</span>
          <span className="text-white">{status.queuedListeners || 0}</span>
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={testConnection}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl mb-3 transition-colors"
      >
        Test Connection
      </button>

      {/* Event Logs */}
      <div className="bg-black/30 rounded-xl p-3 max-h-60 overflow-y-auto">
        <div className="text-gray-400 text-xs font-bold mb-2">
          Recent Events:
        </div>
        {logs.length === 0 ? (
          <div className="text-gray-600 text-xs italic">
            No events received yet...
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className="text-gray-300 text-xs font-mono">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-3 text-xs text-gray-500 italic">
        Open browser console for detailed logs
      </div>
    </div>
  );
};

export default SocketDebugPanel;
