import { io } from "socket.io-client";

const SOCKET_URL = "https://task-management-backend-woep.onrender.com";
// const SOCKET_URL = "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventQueue = []; // Queue for events registered before connection
  }

  connect(token) {
    if (this.socket?.connected) {
      console.log("✅ Socket already connected:", this.socket.id);
      return this.socket;
    }

    console.log("🔄 Connecting to WebSocket...", SOCKET_URL);

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
      console.log("✅ WebSocket connected:", this.socket.id);
      this.isConnected = true;

      // Attach queued event listeners
      this.eventQueue.forEach(({ eventName, callback }) => {
        console.log(`📎 Attaching queued listener for: ${eventName}`);
        this.socket.on(eventName, callback);
      });
      this.eventQueue = [];
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ WebSocket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔥 WebSocket connection error:", error);
    });

    // Debug: Log all incoming events
    this.socket.onAny((eventName, ...args) => {
      console.log(`📨 Received event: ${eventName}`, args);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventQueue = [];
      console.log("🔌 WebSocket disconnected manually");
    }
  }

  // Listen for task created events
  onTaskCreated(callback) {
    console.log("👂 Registering listener for: taskCreated");
    if (this.socket?.connected) {
      this.socket.on("taskCreated", callback);
      console.log("✅ Listener attached for: taskCreated");
    } else {
      console.log(
        "⏸️ Queuing listener for: taskCreated (socket not connected yet)",
      );
      this.eventQueue.push({ eventName: "taskCreated", callback });
    }
  }

  // Listen for task updated events
  onTaskUpdated(callback) {
    console.log("👂 Registering listener for: taskUpdated");
    if (this.socket?.connected) {
      this.socket.on("taskUpdated", callback);
      console.log("✅ Listener attached for: taskUpdated");
    } else {
      console.log(
        "⏸️ Queuing listener for: taskUpdated (socket not connected yet)",
      );
      this.eventQueue.push({ eventName: "taskUpdated", callback });
    }
  }

  // Remove event listeners
  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
      console.log(`🔇 Removed listener for: ${eventName}`);
    }
  }

  getSocket() {
    return this.socket;
  }

  // Debug method to check connection status
  getStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      queuedListeners: this.eventQueue.length,
    };
  }
}

// Export a singleton instance
export default new SocketService();
