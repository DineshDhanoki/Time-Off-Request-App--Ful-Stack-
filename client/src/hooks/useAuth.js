import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
  return useContext(AuthContext);
}

// client/src/hooks/useNotification.js
import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export default function useNotification() {
  return useContext(NotificationContext);
}

// client/src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function useWebSocket(userId, onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket
    socketRef.current = io({
      path: '/socket.io',
    });

    // Authenticate socket connection
    socketRef.current.emit('authenticate', userId);

    // Set up event listeners
    socketRef.current.on('notification', (data) => {
      if (onMessage) onMessage(data);
    });

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, onMessage]);

  return socketRef.current;
}
