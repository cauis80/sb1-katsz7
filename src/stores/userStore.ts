import { create } from 'zustand';
import type { User } from '../types';

interface UserState {
  users: User[];
  invitations: Array<{
    id: string;
    email: string;
    role: User['role'];
    invitedBy: string;
    expiresAt: string;
  }>;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  inviteUser: (invitation: Omit<UserState['invitations'][0], 'id'>) => void;
  cancelInvitation: (id: string) => void;
  resendInvitation: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [
    {
      id: '1',
      email: 'admin@formationpro.com',
      name: 'Super Admin',
      role: 'admin',
      status: 'active',
      lastLogin: new Date().toISOString(),
    },
  ],
  invitations: [],
  addUser: (userData) =>
    set((state) => ({
      users: [...state.users, { id: crypto.randomUUID(), ...userData }],
    })),
  updateUser: (id, userData) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      ),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
  inviteUser: (invitation) =>
    set((state) => ({
      invitations: [
        ...state.invitations,
        { id: crypto.randomUUID(), ...invitation },
      ],
    })),
  cancelInvitation: (id) =>
    set((state) => ({
      invitations: state.invitations.filter((inv) => inv.id !== id),
    })),
  resendInvitation: (id) =>
    set((state) => ({
      invitations: state.invitations.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toISOString(),
            }
          : inv
      ),
    })),
}));