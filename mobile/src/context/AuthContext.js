import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('mobile_token');
        const savedUser = await AsyncStorage.getItem('mobile_user');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
          // Verify with backend
          try {
            const res = await api.get('/auth/me');
            setUser(res.data);
            await AsyncStorage.setItem('mobile_user', JSON.stringify(res.data));
          } catch (err) {
            // Token expired or invalid
            await AsyncStorage.removeItem('mobile_token');
            await AsyncStorage.removeItem('mobile_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Session load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password: password.trim()
    });
    const { access_token, user: userData } = res.data;
    await AsyncStorage.setItem('mobile_token', access_token);
    await AsyncStorage.setItem('mobile_user', JSON.stringify(userData));
    setToken(access_token);
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { access_token, user: newUser } = res.data;
    await AsyncStorage.setItem('mobile_token', access_token);
    await AsyncStorage.setItem('mobile_user', JSON.stringify(newUser));
    setToken(access_token);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('mobile_token');
    await AsyncStorage.removeItem('mobile_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
