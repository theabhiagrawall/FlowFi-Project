'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {toast} from "@/hooks/use-toast";
import {router} from "next/client";

// Create the context
const AuthContext = createContext(null);

/**
 * The AuthProvider component manages the authentication state.
 * It provides the user, token, login, and logout functions to its children.
 */
export function AuthProvider({ children }) {
  const [user, setUser] =  useState(null);
  const [token, setToken] = useState(null);
  // Start with loading true, as we need to validate the token
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {

      setLoading(false);
    }
  }, []); // This empty dependency array ensures this runs only once on mount.

  useEffect(() => {
    // If there's no token, we have nothing to validate.
    if (!token) {
      return;
    }

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

    fetch(`http://localhost:8080/wallet-service/wallets`, {
      method: 'GET', // Explicitly setting the method
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
        .then(response => {
          if (!response.ok) {
            toast({
              title: 'Authentication failed',
              description: `Authentication failed with status: ${response.status}`,
              variant: 'destructive',
            });
            router.push('/login');
          }
        })
        .then(() => {
          console.log("Token validated successfully.");
        })
        .catch((error) => {
            toast({
                title: 'Authentication failed',
                description: `Authentication failed!`,
                variant: 'destructive',
            });
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
  }, [token]); //

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
    setUser,
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
