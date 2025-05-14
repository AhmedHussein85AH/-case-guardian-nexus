import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { AuthUser, AuthContextType } from './types';
import { UserPermissions } from '@/components/users/UserTypes';

interface UseAuthMethodsProps {
  user: AuthUser | null;
  setIsLoading: (loading: boolean) => void;
}

export const useAuthMethods = ({ user, setIsLoading }: UseAuthMethodsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('Attempting login with:', { email, password });
      console.log('Available users:', users);

      const foundUser = users.find((u: any) => 
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        console.log('No matching user found');
        throw new Error('Invalid credentials');
      }

      console.log('User found:', foundUser);

      // Store current user
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      localStorage.removeItem('currentUser');
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return user?.permissions?.[permission] || false;
  };

  return {
    login,
    logout,
    hasPermission,
  };
};
