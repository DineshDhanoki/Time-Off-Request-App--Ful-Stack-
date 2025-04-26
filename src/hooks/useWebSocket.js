// client/src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import useAuth from "./useAuth";

export default function useWebSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.id) return;

    // Initialize socket
    socketRef.current = io({
      path: "/socket.io",
      // No need to specify URL in development due to proxy
    });

    // Socket event listeners
    socketRef.current.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // Authenticate socket with user ID
      socketRef.current.emit("authenticate", user.id);
    });

    socketRef.current.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    // Handle new request notifications for managers
    socketRef.current.on("new_request", (data) => {
      console.log("New request notification:", data);

      // Add to notifications state
      setNotifications((prev) => [
        {
          id: `req-${data.id}`,
          type: "new_request",
          message: `New time-off request from ${data.employee_name}`,
          data,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    });

    // Handle request status updates for employees
    socketRef.current.on("request_updated", (data) => {
      console.log("Request updated notification:", data);

      // Add to notifications state
      setNotifications((prev) => [
        {
          id: `upd-${data.id}`,
          type: "status_update",
          message: `Your time-off request was ${data.status}`,
          data,
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...prev,
      ]);
    });

    // Clean up on unmount
    return () => {
      console.log("Cleaning up WebSocket connection");
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Function to mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  return {
    socket: socketRef.current,
    isConnected,
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
}
