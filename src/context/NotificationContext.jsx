import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const { currentUser, isAuthenticated } = useContext(AuthContext);

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Connect to the server's WebSocket
      socketRef.current = io({
        path: '/socket.io',
      });

      // Authenticate the socket connection
      socketRef.current.emit('authenticate', currentUser.id);

      // Listen for notifications
      socketRef.current.on('notification', (notification) => {
        handleNotification(notification);
      });

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [isAuthenticated, currentUser]);

  // Handle incoming notifications
  const handleNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Show toast notification
    let message = 'New notification';

    if (notification.type === 'NEW_REQUEST') {
      message = `New time-off request from ${notification.data.employeeName}`;
    } else if (notification.type === 'REQUEST_DECISION') {
      message = `Your request has been ${notification.data.status.toLowerCase()}`;
    }

    toast.info(message, {
      onClick: () => markAsRead(notification.id),
    });
  };

  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};