'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api.js';

// Create the context
const AuthContext = createContext(null);

/**
 * The AuthProvider component manages the authentication state.
 * It provides the user, token, login, and logout functions to its children.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // On initial load, check for a token in local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // o fetch the user profile here to verify the token is still valid
      // apiFetch('/users/me')
      //   .then(data => setUser(data))
      //   .catch(() => {
      //     // If token is invalid, log out
      //     logout();
      //   })
      //   .finally(() => setLoading(false));
      setLoading(false);
    }
    setLoading(false);
  }, []);

  /**
   * login function
   * @param {string} newToken - The JWT token received from the backend.
   * @param {object} userData - The user data received from the backend.
   */
  const login = (newToken, userData) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  /**
   * logout function
   */
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use the authentication context.
 * @returns The authentication context value.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
