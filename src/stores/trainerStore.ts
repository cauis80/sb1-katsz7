import { create } from 'zustand';
import type { Trainer } from '../types';

interface TrainersState {
  trainers: Trainer[];
  addTrainer: (trainer: Omit<Trainer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTrainer: (id: string, trainer: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;
}

export const useTrainersStore = create<TrainersState>((set) => ({
  trainers: [
    {
      id: '1',
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@example.com',
      phone: '+33 6 12 34 56 78',
      specialties: ['1', '2'],
      bio: 'Formatrice expérimentée en développement web avec plus de 8 ans d\'expérience.',
      status: 'active',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
    {
      id: '2',
      firstName: 'Thomas',
      lastName: 'Martin',
      email: 'thomas.martin@example.com',
      phone: '+33 6 98 76 54 32',
      specialties: ['3'],
      bio: 'Expert en science des données et intelligence artificielle.',
      status: 'active',
      createdAt: '2024-03-09',
      updatedAt: '2024-03-09',
    },
  ],
  addTrainer: (trainer) =>
    set((state) => ({
      trainers: [
        ...state.trainers,
        {
          ...trainer,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateTrainer: (id, trainer) =>
    set((state) => ({
      trainers: state.trainers.map((t) =>
        t.id === id ? { ...t, ...trainer, updatedAt: new Date().toISOString() } : t
      ),
    })),
  deleteTrainer: (id) =>
    set((state) => ({
      trainers: state.trainers.filter((t) => t.id !== id),
    })),
}));