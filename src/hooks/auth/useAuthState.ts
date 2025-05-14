import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { AuthUser } from './types';

export const useAuthState = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any | null>(null);
  const { toast } = useToast();

  // Initialize auth state and set up listener
  useEffect(() => {
    console.log('useAuthState: Starting initialization');
    
    const checkAuth = () => {
      try {
        console.log('useAuthState: Checking auth state');
        // Get user from localStorage
        const storedUser = localStorage.getItem('currentUser');
        console.log('useAuthState: Stored user:', storedUser);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setSession({ user: userData });
          console.log('useAuthState: User found and set');
        } else {
          setUser(null);
          setSession(null);
          console.log('useAuthState: No user found');
        }
      } catch (error) {
        console.error("Auth state error:", error);
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
        console.log('useAuthState: Loading complete');
      }
    };

    // Initial check
    checkAuth();

    // Listen for storage changes
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch user profile from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userProfile = users.find((u: any) => u.id === userId);

      if (!userProfile) {
        throw new Error('User profile not found');
      }

      // Create default permissions
      const defaultPermissions = {
        viewCases: true,
        manageCases: false,
        viewReports: false,
        generateReports: false,
        viewUsers: false,
        manageUsers: false,
        viewMessages: true,
        manageSettings: false,
      };

      // Handle permissions
      const userPermissions = {
        ...defaultPermissions,
        ...(userProfile.permissions || {})
      };

      // Create the auth user object
      const authUser: AuthUser = {
        id: userId,
        email: userProfile.email,
        name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || userProfile.email,
        role: userProfile.role || 'user',
        permissions: userPermissions
      };

      setUser(authUser);
      localStorage.setItem('currentUser', JSON.stringify(authUser));
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast({
        title: "Error loading profile",
        description: "Please try logging in again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    setIsLoading,
    session,
    fetchUserProfile
  };
};
