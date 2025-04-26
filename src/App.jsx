import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { ThemeContextProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import EmployeeView from './components/EmployeeView';
import ManagerView from './components/ManagerView';
import RequestDetails from './components/RequestDetails';
import UserProfile from './components/UserProfile';
import NotFound from './components/NotFound';

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        {({ theme }) => (
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationProvider>
              <Navigation />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/employee"
                  element={
                    <PrivateRoute>
                      <EmployeeView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/manager"
                  element={
                    <PrivateRoute roles={['manager', 'admin']}>
                      <ManagerView />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/requests/:id"
                  element={
                    <PrivateRoute>
                      <RequestDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer position="bottom-right" />
            </NotificationProvider>
          </ThemeProvider>
        )}
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;