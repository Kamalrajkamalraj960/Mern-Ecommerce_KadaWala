import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check localStorage for user session on startup
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await API.post('/auth/login', { email, password });
      
      setUser(data.data);
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      setLoading(false);
      return data.data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await API.post('/auth/register', { name, email, password });

      setUser(data.data);
      localStorage.setItem('userInfo', JSON.stringify(data.data));
      setLoading(false);
      return data.data;
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAdmin,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
