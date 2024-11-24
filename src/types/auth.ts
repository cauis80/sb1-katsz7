export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'trainer' | 'user';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  avatar?: string;
}

export type UserRole = User['role'];