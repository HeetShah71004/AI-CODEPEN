import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem("ai-codepen-user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        // Optionally verify user still exists in database
        authService.getCurrentUser(userData._id).then((result) => {
          if (result.success) {
            setUser(result.user);
            localStorage.setItem(
              "ai-codepen-user",
              JSON.stringify(result.user)
            );
          } else {
            // User no longer exists, clear local storage
            setUser(null);
            localStorage.removeItem("ai-codepen-user");
          }
        });
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("ai-codepen-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem("ai-codepen-user", JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData) => {
    setIsLoading(true);
    try {
      const result = await authService.signup(userData);
      if (result.success) {
        setUser(result.user);
        localStorage.setItem("ai-codepen-user", JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai-codepen-user");
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
