import { User, UserPermissions } from '@/components/users/UserTypes';

// Helper function to get initials from a name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Convert Supabase user profile to app User format
export const mapSupabaseProfileToUser = (profile: any): User => {
  // Generate a numeric ID from the UUID for compatibility
  const numericId = parseInt(profile.id.replace(/-/g, '').substring(0, 8), 16);
  
  const firstName = profile.first_name || '';
  const lastName = profile.last_name || '';
  const fullName = `${firstName} ${lastName}`.trim() || profile.email;
  
  // Get initials from name
  const initials = getInitials(fullName);
  
  // Default permissions if none exist
  const defaultPermissions: UserPermissions = {
    viewCases: true,
    manageCases: false,
    viewReports: false,
    generateReports: false,
    viewUsers: false,
    manageUsers: false,
    viewMessages: true,
    manageSettings: false,
  };
  
  // Ensure permissions is properly typed
  let userPermissions: UserPermissions;
  
  if (profile.permissions && typeof profile.permissions === 'object') {
    userPermissions = {
      ...defaultPermissions,
      ...(profile.permissions as UserPermissions)
    };
  } else {
    userPermissions = defaultPermissions;
  }
  
  return {
    id: numericId,
    name: fullName,
    email: profile.email,
    role: profile.role || 'User',
    department: profile.department || 'General',
    status: profile.status || 'Active',
    initials: initials,
    permissions: userPermissions,
    originalId: profile.id, // Keep the original UUID for API operations
  };
};

// User functions
export const getAllUserProfiles = async (): Promise<User[]> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users;
};

export const getUserProfile = async (userId: string): Promise<User> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUserProfile = async (userId: string, updates: any): Promise<User> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const index = users.findIndex((u: any) => u.id === userId);
  if (index === -1) {
    throw new Error('User not found');
  }
  users[index] = { ...users[index], ...updates };
  localStorage.setItem('users', JSON.stringify(users));
  return users[index];
};

export const createUserProfile = async (profile: any): Promise<User> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const newUser = {
    ...profile,
    id: Date.now().toString(),
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const updateUserPermissions = async (userId: string, permissions: UserPermissions): Promise<User> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const index = users.findIndex((u: any) => u.id === userId);
  if (index === -1) {
    throw new Error('User not found');
  }
  users[index] = { ...users[index], permissions };
  localStorage.setItem('users', JSON.stringify(users));
  return users[index];
};

export const deleteUserProfile = async (userId: string): Promise<boolean> => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const filtered = users.filter((u: any) => u.id !== userId);
  localStorage.setItem('users', JSON.stringify(filtered));
  return true;
};
