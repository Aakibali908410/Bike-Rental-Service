import { createContext, useEffect, useState, useCallback } from 'react';
import { authAPI, getToken, saveToken, removeToken } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to fetch user list if current authenticated user is an admin
  const fetchAdminUsers = useCallback(async () => {
    try {
      const res = await authAPI.getUsers();
      if (res?.success && Array.isArray(res.users)) {
        setUsers(res.users);
      }
    } catch {
      // Non-critical background fetch failure
    }
  }, []);

  // Fetch current user from /api/auth/me on initial app load if token exists
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const token = getToken();
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const res = await authAPI.getMe();
        if (isMounted && res?.success && res.user) {
          setUser(res.user);
          if (res.user.role === 'ADMIN') {
            fetchAdminUsers();
          }
        } else {
          removeToken();
          if (isMounted) setUser(null);
        }
      } catch {
        // Token is invalid, expired, or server returned 401/403
        removeToken();
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [fetchAdminUsers]);

  // Authenticate user via POST /api/auth/login
  const login = async (email, password) => {
    try {
      const res = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res?.success || !res.token || !res.user) {
        return {
          success: false,
          message: res?.message || 'Login failed. Please check your credentials.',
        };
      }

      saveToken(res.token);
      setUser(res.user);

      if (res.user.role === 'ADMIN') {
        fetchAdminUsers();
      }

      return { success: true, user: res.user };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Invalid email or password.',
      };
    }
  };

  // Register new customer via POST /api/auth/register
  const register = async (name, email, phone, password) => {
    try {
      const res = await authAPI.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || '',
        password,
      });

      if (!res?.success || !res.token || !res.user) {
        return {
          success: false,
          message: res?.message || 'Registration failed. Please try again.',
        };
      }

      saveToken(res.token);
      setUser(res.user);

      return {
        success: true,
        message: res.message || 'Registration successful.',
        user: res.user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.',
      };
    }
  };

  // Sign out and clear stored JWT token
  const logout = () => {
    removeToken();
    setUser(null);
    setUsers([]);
  };

  // Update profile via PUT /api/auth/me
  const updateProfile = async (updatedData) => {
    try {
      const res = await authAPI.updateMe({
        name: updatedData.name?.trim(),
        phone: updatedData.phone?.trim() || '',
      });

      if (!res?.success || !res.user) {
        return {
          success: false,
          message: res?.message || 'Failed to update profile.',
        };
      }

      setUser(res.user);
      return { success: true, user: res.user };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update profile.',
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
