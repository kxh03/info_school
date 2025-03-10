
// Just update the authentication logic to prevent redundant API calls
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/services/api';
import { User } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Add a check to prevent redundant API calls
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      setAuthCheckCompleted(true);
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      const userData = response.data;
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
      setAuthCheckCompleted(true);
    }
  };

  // Only run this effect once at startup to check for existing token
  useEffect(() => {
    if (!authCheckCompleted) {
      fetchCurrentUser();
    }
  }, [authCheckCompleted]);

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('authToken', response.data.token);
      
      // Get user data immediately after successful login
      const userResponse = await authAPI.getCurrentUser();
      setCurrentUser(userResponse.data);
      setIsAuthenticated(true);
      
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
      });
      
      // Navigate after user data is loaded
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(userData);
      localStorage.setItem('authToken', response.data.token);
      
      // Get user data immediately after successful registration
      const userResponse = await authAPI.getCurrentUser();
      setCurrentUser(userResponse.data);
      setIsAuthenticated(true);
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created',
      });
      
      // Navigate after user data is loaded
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Could not create account',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate('/login');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
