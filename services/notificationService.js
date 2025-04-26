// server/services/notificationService.js
const socketIO = require("socket.io");

class NotificationService {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // Maps user IDs to socket IDs
    this.managerRoles = new Set(["manager", "admin", "supervisor"]);
  }

  /**
   * Initialize the socket.io server
   */
  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin:
          process.env.NODE_ENV === "production"
            ? false
            : ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupEventHandlers();
    console.log("WebSocket server initialized");
    return this.io;
  }

  /**
   * Set up WebSocket event handlers
   */
  setupEventHandlers() {
    this.io.on("connection", (socket) => {
      console.log(`New socket connection: ${socket.id}`);

      // Handle authentication - map user to socket
      socket.on("authenticate", (userId) => {
        if (userId) {
          this.userSockets.set(userId, socket.id);
          socket.userId = userId;
          console.log(`User ${userId} authenticated with socket ${socket.id}`);
        }
      });

      // Handle disconnect - clean up user mapping
      socket.on("disconnect", () => {
        if (socket.userId) {
          this.userSockets.delete(socket.userId);
          console.log(`User ${socket.userId} disconnected`);
        }
      });
    });
  }

  /**
   * Send a notification to a specific user
   */
  sendToUser(userId, eventName, data) {
    const socketId = this.userSockets.get(userId);

    if (socketId) {
      this.io.to(socketId).emit(eventName, data);
      console.log(`Notification sent to user ${userId}: ${eventName}`);
      return true;
    } else {
      console.log(`User ${userId} is not connected, notification not sent`);
      return false;
    }
  }

  /**
   * Send request notification to all managers
   */
  sendToManagers(data) {
    let sent = false;

    // In a real app, you'd query for manager IDs from the database
    // For this example, we'll broadcast to all authenticated managers
    this.userSockets.forEach((socketId, userId) => {
      // You would verify if the user is a manager here
      const socket = this.io.sockets.sockets.get(socketId);

      if (socket && socket.user && this.managerRoles.has(socket.user.role)) {
        this.io.to(socketId).emit("new_request", data);
        sent = true;
      }
    });

    return sent;
  }

  /**
   * Notify an employee about request status change
   */
  notifyRequestStatusChange(employeeId, requestData) {
    return this.sendToUser(employeeId, "request_updated", requestData);
  }

  /**
   * Notify managers about a new time-off request
   */
  notifyNewRequest(requestData) {
    return this.sendToManagers(requestData);
  }
}

module.exports = new NotificationService();
