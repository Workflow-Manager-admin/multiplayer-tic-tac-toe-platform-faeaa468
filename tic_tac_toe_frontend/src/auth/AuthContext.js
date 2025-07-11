import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import api from "../services/apiService";

// Authentication Context for login state, user info, and actions
const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * AuthProvider component for managing authentication state and persisting user info.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // User object (e.g., { username/email, ... })
  const [token, setToken] = useState(null); // JWT or token string
  const [loading, setLoading] = useState(true); // Loading state for auth bootstrap

  // Bootstrap auth state from localStorage/auth cookie
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // PUBLIC_INTERFACE
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { user, token } = await api.login(credentials);
      setUser(user);
      setToken(token);
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("authToken", token);
      api.setAuthToken(token); // Make sure apiService uses token
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err?.message || "Login failed" };
    }
  }, []);

  // PUBLIC_INTERFACE
  const signup = useCallback(async (data) => {
    setLoading(true);
    try {
      const { user, token } = await api.signup(data);
      setUser(user);
      setToken(token);
      localStorage.setItem("authUser", JSON.stringify(user));
      localStorage.setItem("authToken", token);
      api.setAuthToken(token);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err?.message || "Signup failed" };
    }
  }, []);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
    api.clearAuthToken();
  }, []);

  // Automatically set or clear API auth token on token state change
  useEffect(() => {
    if (token) {
      api.setAuthToken(token);
    } else {
      api.clearAuthToken();
    }
  }, [token]);

  // PUBLIC_INTERFACE
  const isAuthenticated = !!user && !!token;

  // PUBLIC_INTERFACE
  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated,
      loading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
