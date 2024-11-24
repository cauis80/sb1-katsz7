import { create } from 'zustand';
import type { SpecialtyGroup, Specialty } from '../types';

interface SpecialtiesState {
  groups: SpecialtyGroup[];
  specialties: Specialty[];
  addGroup: (group: Omit<SpecialtyGroup, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGroup: (id: string, group: Partial<SpecialtyGroup>) => void;
  deleteGroup: (id: string) => void;
  addSpecialty: (specialty: Omit<Specialty, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpecialty: (id: string, specialty: Partial<Specialty>) => void;
  deleteSpecialty: (id: string) => void;
}

export const useSpecialtiesStore = create<SpecialtiesState>((set) => ({
  groups: [
    {
      id: '1',
      name: 'Développement Web',
      description: 'Technologies et frameworks web',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
    {
      id: '2',
      name: 'Data Science',
      description: 'Analyse de données et machine learning',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
  ],
  specialties: [
    {
      id: '1',
      name: 'React.js',
      groupId: '1',
      description: 'Développement d\'applications avec React',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
    {
      id: '2',
      name: 'Node.js',
      groupId: '1',
      description: 'Développement backend avec Node.js',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
    {
      id: '3',
      name: 'Python',
      groupId: '2',
      description: 'Programmation Python pour la data science',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
  ],
  addGroup: (group) =>
    set((state) => ({
      groups: [
        ...state.groups,
        {
          ...group,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateGroup: (id, group) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === id ? { ...g, ...group, updatedAt: new Date().toISOString() } : g
      ),
    })),
  deleteGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((g) => g.id !== id),
      specialties: state.specialties.filter((s) => s.groupId !== id),
    })),
  addSpecialty: (specialty) =>
    set((state) => ({
      specialties: [
        ...state.specialties,
        {
          ...specialty,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateSpecialty: (id, specialty) =>
    set((state) => ({
      specialties: state.specialties.map((s) =>
        s.id === id ? { ...s, ...specialty, updatedAt: new Date().toISOString() } : s
      ),
    })),
  deleteSpecialty: (id) =>
    set((state) => ({
      specialties: state.specialties.filter((s) => s.id !== id),
    })),
}));