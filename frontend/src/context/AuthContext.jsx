/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, tokenStorage } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    if (!tokenStorage.get()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      if (response.data.user) {
        setUser(response.data.user);
      } else {
        tokenStorage.clear();
        setUser(null);
      }
    } catch {
      tokenStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const login = async (username, password) => {
    tokenStorage.clear();
    setUser(null);
    const response = await authAPI.login({ username, password });
    if (!response.data?.token || !response.data?.user) {
      throw new Error("Invalid login response");
    }
    tokenStorage.set(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    tokenStorage.clear();
    setUser(null);
  };

  const register = async (userData) => {
    tokenStorage.clear();
    setUser(null);
    const response = await authAPI.register(userData);
    if (!response.data?.token || !response.data?.user) {
      throw new Error("Invalid registration response");
    }
    tokenStorage.set(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
