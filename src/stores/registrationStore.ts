import { create } from 'zustand';
import type { Registration } from '../types';

interface RegistrationsState {
  registrations: Registration[];
  addRegistration: (registration: Registration) => void;
  updateRegistration: (id: string, registrationData: Partial<Registration>) => void;
  deleteRegistration: (id: string) => void;
}

export const useRegistrationsStore = create<RegistrationsState>((set) => ({
  registrations: [],
  addRegistration: (registration) =>
    set((state) => ({
      registrations: [...state.registrations, registration],
    })),
  updateRegistration: (id, registrationData) =>
    set((state) => ({
      registrations: state.registrations.map((r) =>
        r.id === id ? { ...r, ...registrationData } : r
      ),
    })),
  deleteRegistration: (id) =>
    set((state) => ({
      registrations: state.registrations.filter((r) => r.id !== id),
    })),
}));