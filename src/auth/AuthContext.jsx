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
    console.log("🔐 checkAuth starting...");
    setIsLoading(true);
    try {
      const token = getStoredToken();
      if (token) {
        console.log("🔐 Token found, verifying with server...");
        try {
          const currentUser = await getCurrentUser(token);
          if (currentUser) {
            console.log("✅ Auth valid, user:", currentUser.username);
            setIsAuthenticated(true);
            setUser({ username: currentUser.username });
          } else {
            console.log("❌ getCurrentUser returned null - removing token");
            removeToken();
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error("❌ getCurrentUser failed:", error);
          // Only remove token if it's actually invalid (401), not for network errors
          if (
            error.message.includes("Unauthorized") ||
            error.message.includes("Invalid token")
          ) {
            console.log("🗑️ Removing invalid token");
            removeToken();
            setIsAuthenticated(false);
            setUser(null);
          } else {
            // Network error or server error - keep token, just not authenticated for now
            console.log(
              "⚠️ Keeping token, but marking as not authenticated due to error",
            );
            setIsAuthenticated(false);
          }
        }
      } else {
        console.log("❌ No token in localStorage");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Auth check error:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log("🔐 checkAuth finished");
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
