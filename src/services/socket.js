import { io } from "socket.io-client";

const SOCKET_URL = "https://task-management-backend-woep.onrender.com";
// const SOCKET_URL = "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on("connect", () => {
      console.log("🔌 WebSocket connected:", this.socket.id);
      this.isConnected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔥 WebSocket connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log("🔌 WebSocket disconnected manually");
    }
  }

  // Listen for task created events
  onTaskCreated(callback) {
    if (this.socket) {
      this.socket.on("taskCreated", callback);
    }
  }

  // Listen for task updated events
  onTaskUpdated(callback) {
    if (this.socket) {
      this.socket.on("taskUpdated", callback);
    }
  }

  // Remove event listeners
  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  getSocket() {
    return this.socket;
  }
}

// Export a singleton instance
export default new SocketService();
