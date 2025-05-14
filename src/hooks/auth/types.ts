import { UserPermissions } from '@/components/users/UserTypes';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name: string;
  organization?: string;
  permissions?: UserPermissions;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: keyof UserPermissions) => boolean;
}
