// client/src/components/Navigation.jsx
import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Avatar,
  Button,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Drawer,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Notifications as NotificationIcon,
  Computer as SystemModeIcon,
  AccountCircle,
  CalendarMonth,
  Dashboard,
  ExitToApp,
} from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import useNotification from '../hooks/useNotification';
import { formatDateTime } from '../utils/dateUtils';

function Navigation() {
  const { themeMode, toggleTheme } = useContext(ThemeContext);
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [notificationDrawer, setNotificationDrawer] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNotificationClick = () => {
    setNotificationDrawer(true);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  const getThemeIcon = () => {
    if (themeMode === 'light') return <DarkModeIcon />;
    if (themeMode === 'dark') return <LightModeIcon />;
    return <SystemModeIcon />;
  };

  const getThemeLabel = () => {
    if (themeMode === 'light') return 'Dark Mode';
    if (themeMode === 'dark') return 'System Mode';
    return 'Light Mode';
  };

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo and Title - Desktop */}
            <CalendarMonth sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Time-Off App
            </Typography>

            {/* Mobile Navigation Menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              {isAuthenticated && (
                <>
                  <IconButton
                    size="large"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/'); }}>
                      <Typography textAlign="center">Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/employee'); }}>
                      <Typography textAlign="center">My Requests</Typography>
                    </MenuItem>
                    {currentUser?.role === 'manager' && (
                      <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/manager'); }}>
                        <Typography textAlign="center">Manage Requests</Typography>
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}
            </Box>

            {/* Logo and Title - Mobile */}
            <CalendarMonth sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Time-Off
            </Typography>

            {/* Desktop Navigation Links */}
            {isAuthenticated && (
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                  onClick={() => navigate('/')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  startIcon={<Dashboard />}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/employee')}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  startIcon={<CalendarMonth />}
                >
                  My Requests
                </Button>
                {currentUser?.role === 'manager' && (
                  <Button
                    onClick={() => navigate('/manager')}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    Manage Requests
                  </Button>
                )}
              </Box>
            )}

            {/* Right side actions */}
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {/* Theme Toggle */}
              <Tooltip title={getThemeLabel()}>
                <IconButton onClick={toggleTheme} color="inherit">
                  {getThemeIcon()}
                </IconButton>
              </Tooltip>

              {isAuthenticated && (
                <>
                  {/* Notification Bell */}
                  <Tooltip title="Notifications">
                    <IconButton onClick={handleNotificationClick} color="inherit">
                      <Badge badgeContent={unreadCount} color="error">
                        <NotificationIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  {/* User Menu */}
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
                      <Avatar alt={currentUser?.firstName || 'User'}>
                        {currentUser?.firstName?.[0] || <AccountCircle />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}>
                      <Typography textAlign="center">Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ExitToApp fontSize="small" />
                        <Typography textAlign="center">Logout</Typography>
                      </Stack>
                    </MenuItem>
                  </Menu>
                </>
              )}

              {!isAuthenticated && (
                <>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    color="inherit"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Notification Drawer */}
      <Drawer
        anchor="right"
        open={notificationDrawer}
        onClose={() => setNotificationDrawer(false)}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button size="small" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </Box>
          <Divider />
          {notifications.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    alignItems="flex-start"
                    button
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.data?.requestId) {
                        navigate(`/requests/${notification.data.requestId}`);
                        setNotificationDrawer(false);
                      }
                    }}
                    sx={{
                      bgcolor: notification.read ? 'inherit' : 'action.hover',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {notification.type === 'NEW_REQUEST' ? 'N' : 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        notification.type === 'NEW_REQUEST'
                          ? `New request from ${notification.data?.employeeName}`
                          : `Request ${notification.data?.status?.toLowerCase()}`
                      }
                      secondary={
                        <>
                          {notification.message}
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: 'block', mt: 1 }}
                          >
                            {formatDateTime(notification.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default Navigation;