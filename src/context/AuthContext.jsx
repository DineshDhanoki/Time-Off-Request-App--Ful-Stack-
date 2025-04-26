import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = jwtDecode (token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

    // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    navigate('/login');
  }, [navigate]);

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      if (token && !isTokenExpired(token)) {
        try {
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
        } catch (error) {
          console.error('Error loading user:', error);
          logout();
        }
      } else if (token) {
        // Token exists but is expired
        logout();
      }
      setLoading(false);
    };

    loadUser();
  }, [token, logout]);

  // Login user
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const { token } = response;
    localStorage.setItem('token', token);
    setToken(token);
    return response;
  };

  // Register user
  const register = async (userData) => {
    const response = await authService.register(userData);
    const { token } = response;
    localStorage.setItem('token', token);
    setToken(token);
    return response;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !isTokenExpired(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};