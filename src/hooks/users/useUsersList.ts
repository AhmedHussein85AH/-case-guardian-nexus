import { useState, useEffect } from 'react';
import { User } from '@/components/users/UserTypes';
import { useToast } from "@/hooks/use-toast";
import { getAllUserProfiles } from '@/services/user/userService';

export const useUsersList = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [displayUsers, setDisplayUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const users = await getAllUserProfiles();
        setAllUsers(users);
        setDisplayUsers(users);
      } catch (error: any) {
        toast({
          title: "Failed to load users",
          description: error.message || "An error occurred while loading users",
          variant: "destructive",
        });
        console.error("Error loading users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();

    // Listen for storage changes
    window.addEventListener('storage', loadUsers);
    return () => window.removeEventListener('storage', loadUsers);
  }, [toast]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setDisplayUsers(allUsers);
    } else {
      const filteredUsers = allUsers.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDisplayUsers(filteredUsers);
    }
  }, [searchQuery, allUsers]);

  return {
    allUsers,
    displayUsers,
    searchQuery,
    setSearchQuery,
    isLoading,
  };
};
