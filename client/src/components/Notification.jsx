import React, { useState, useContext } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemText,
  ListItemIcon,
  Box,
  Button,
  Divider
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Check as CheckIcon,
  EventAvailable as ApprovedIcon,
  EventBusy as RejectedIcon,
  AccessTime as PendingIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import useNotification from '../hooks/useNotification';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.type === 'NEW_REQUEST' || notification.type === 'REQUEST_DECISION') {
      navigate(`/requests/${notification.data.requestId}`);
    }

    handleClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    handleClose();
  };

  const getNotificationIcon = (type, status) => {
    switch (type) {
      case 'NEW_REQUEST':
        return <PersonIcon color="primary" />;
      case 'REQUEST_DECISION':
        return status === 'APPROVED'
          ? <ApprovedIcon color="success" />
          : status === 'REJECTED'
            ? <RejectedIcon color="error" />
            : <PendingIcon color="warning" />;
      default:
        return <NotificationsIcon color="action" />;
    }
  };

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'NEW_REQUEST':
        return `New time-off request from ${notification.data.employeeName}`;
      case 'REQUEST_DECISION':
        return `Your request has been ${notification.data.status.toLowerCase()}`;
      default:
        return notification.message || 'New notification';
    }
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: 320,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Notifications</Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<CheckIcon />}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                py: 1.5,
                backgroundColor: notification.read ? 'inherit' : 'action.hover'
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type, notification.data?.status)}
              </ListItemIcon>
              <ListItemText
                primary={getNotificationText(notification)}
                secondary={format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                primaryTypographyProps={{
                  variant: 'body2',
                  fontWeight: notification.read ? 'normal' : 'bold'
                }}
                secondaryTypographyProps={{
                  variant: 'caption'
                }}
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default Notification;