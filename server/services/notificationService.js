const { Server } = require("socket.io");
const logger = require("../middleware/logger");

class NotificationService {
  constructor() {
    this.io = null;
    this.connections = new Map(); // Map userId to socket.id
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: "*", // In production, restrict this to your frontend domain
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      logger.info(`New client connected: ${socket.id}`);

      // Handle user authentication and store connection
      socket.on("authenticate", (userId) => {
        logger.info(`User ${userId} authenticated on socket ${socket.id}`);
        this.connections.set(userId, socket.id);
        socket.userId = userId;
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        logger.info(`Client disconnected: ${socket.id}`);
        if (socket.userId) {
          this.connections.delete(socket.userId);
        }
      });
    });

    logger.info("WebSocket notification service initialized");
  }

  // Send notification to a specific user
  sendToUser(userId, notificationType, data) {
    try {
      const socketId = this.connections.get(userId);

      if (socketId) {
        this.io.to(socketId).emit("notification", {
          type: notificationType,
          data,
          timestamp: new Date().toISOString(),
        });
        logger.info(`Notification sent to user ${userId}`);
        return true;
      } else {
        logger.warn(`User ${userId} not connected, notification queued`);
        // Here you could queue the notification for later delivery
        return false;
      }
    } catch (error) {
      logger.error(`Error sending notification to user ${userId}:`, error);
      return false;
    }
  }

  // Send notification to all connected users
  broadcast(notificationType, data) {
    try {
      this.io.emit("notification", {
        type: notificationType,
        data,
        timestamp: new Date().toISOString(),
      });
      logger.info("Broadcast notification sent to all users");
      return true;
    } catch (error) {
      logger.error("Error broadcasting notification:", error);
      return false;
    }
  }

  // Send notification to all managers
  sendToManagers(notificationType, data) {
    try {
      // In a real application, you would have a way to identify manager sockets
      // For now, we'll use the role in the user data
      this.io.sockets.sockets.forEach((socket) => {
        if (socket.role === "manager") {
          socket.emit("notification", {
            type: notificationType,
            data,
            timestamp: new Date().toISOString(),
          });
        }
      });
      logger.info("Notification sent to all managers");
      return true;
    } catch (error) {
      logger.error("Error sending notification to managers:", error);
      return false;
    }
  }
}

module.exports = new NotificationService();
