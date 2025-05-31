import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const configureAxios = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      if (token) {
        configureAxios(token);
        
        try {
          // Fixed: Use correct endpoint and check response structure
          const response = await axios.get('http://localhost:3000/auth/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Your backend returns { status: true, user: {...} }
          if (response.data.status) {
            console.log('Token verified successfully');
            setIsAuthenticated(true);
            setUser(response.data.user);
          } else {
            console.log('Token is invalid');
            localStorage.removeItem('token');
            configureAxios(null);
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          configureAxios(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        console.log('No token found');
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Fixed: Include rememberMe parameter
  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post('http://localhost:3306/auth/login', { 
        email, 
        password, 
        rememberMe 
      });
      
      // Your backend returns { status: true, token: '...', user: {...} }
      if (response.data.status && response.data.token) {
        localStorage.setItem('token', response.data.token);
        configureAxios(response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'An unexpected error occurred' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    configureAxios(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;