import { User } from '@/components/users/UserTypes';

let currentUser: User | null = null;

// Authentication helpers
export const getCurrentUser = async () => {
  return currentUser;
};

export const getCurrentSession = async () => {
  return currentUser ? { user: currentUser } : null;
};

export const signIn = async (email: string, password: string) => {
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  currentUser = user;
  return { user };
};

export const signOut = async () => {
  currentUser = null;
  return true;
};

export const resetPassword = async (email: string) => {
  // Implementation needed
  throw new Error('Reset password functionality not implemented');
};

export const isAdmin = async (userId: string) => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.id === userId);
  return user?.role === 'admin';
};
