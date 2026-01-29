import { io } from "socket.io-client";

const SOCKET_URL = "https://task-management-backend-woep.onrender.com";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventQueue = [];
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
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
      this.isConnected = true;

      this.eventQueue.forEach(({ eventName, callback }) => {
        this.socket.on(eventName, callback);
      });
      this.eventQueue = [];
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventQueue = [];
    }
  }

  onTaskCreated(callback) {
    if (this.socket?.connected) {
      this.socket.on("taskCreated", callback);
    } else {
      this.eventQueue.push({ eventName: "taskCreated", callback });
    }
  }

  onTaskUpdated(callback) {
    if (this.socket?.connected) {
      this.socket.on("taskUpdated", callback);
    } else {
      this.eventQueue.push({ eventName: "taskUpdated", callback });
    }
  }

  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
    }
  }

  getSocket() {
    return this.socket;
  }

  getStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      queuedListeners: this.eventQueue.length,
    };
  }
}

export default new SocketService();
