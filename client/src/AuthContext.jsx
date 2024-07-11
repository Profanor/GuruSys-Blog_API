import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ username: '', profilePicture: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      fetchUserProfile(decodedToken.id);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    console.log('Updated User:', user);
  }, [user]);

  const fetchUserProfile = async (userId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const response = await axios.get(`${apiUrl}/auth/users/${userId}`);
      setUser({
        username: response.data.username,
        profilePicture: response.data.profilePhoto
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedToken = jwtDecode(token);
    fetchUserProfile(decodedToken.id);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser({ username: '', profilePicture: '' });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
