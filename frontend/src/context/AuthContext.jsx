import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      getUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Get user profile
  const getUserProfile = async () => {
    try {
      const res = await api.get('/api/auth/me');
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Register user
  const register = async (name, email, password, role) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await api.put('/api/users/profile', userData);
      setUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  const value = {
    user,
    loading,
    setUser,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};