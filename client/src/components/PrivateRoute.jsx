// client/src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, roles = [] }) => {
  const { currentUser, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if the route requires specific roles
  if (roles.length > 0 && !roles.includes(currentUser?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;