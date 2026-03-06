import React, { useState, useEffect } from "react";
import {
  getCurrentUser,
  loginRequest,
  storeToken,
  getStoredToken,
  removeToken,
} from "./authUtils";
import { AuthContext } from "./context";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const token = getStoredToken();
      if (token) {
        const currentUser = await getCurrentUser(token);
        if (currentUser) {
          setIsAuthenticated(true);
          setUser({ username: currentUser.username });
        } else {
          removeToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await loginRequest(username, password);
      storeToken(response.token);
      setIsAuthenticated(true);
      setUser(response.user);

      return { success: true, message: "Login successful" };
    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    }
  };

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
