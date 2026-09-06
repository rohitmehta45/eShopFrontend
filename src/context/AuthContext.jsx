
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error(
        'Failed to restore user:',
        error
      );

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // REGISTER
  // =========================

  const register = async (
    name,
    email,
    password
  ) => {
    try {
      const response = await authAPI.register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      setUser(user);

      toast.success(
        'Registration successful!'
      );

      return {
        success: true,
        user,
      };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        'Registration failed';

      toast.error(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // =========================
  // LOGIN
  // =========================

  const login = async (
    email,
    password
  ) => {
    try {
      const response = await authAPI.login({
        email: email.trim(),
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      setUser(user);

      toast.success('Login successful!');

      return {
        success: true,
        user,
      };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        'Login failed';

      toast.error(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);

    toast.success('Logged out');
  };

  const updateUser = (updates) => {
    setUser((current) => {
      const nextUser = { ...current, ...updates };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUser,

    // Useful for components that expect this value
    isAuthenticated: Boolean(user),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

