import { createContext, useState, useEffect, useCallback } from "react";
import authService from "../api/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.mockGetCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const userData = await authService.mockLogin(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.mockLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  }, []);

  const isAdmin = useCallback(() => {
    return user?.role === "admin";
  }, [user]);

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
