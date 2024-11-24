import { create } from 'zustand';
import type { Training } from '../types';

interface CatalogState {
  trainings: Training[];
  addTraining: (training: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTraining: (id: string, training: Partial<Training>) => void;
  deleteTraining: (id: string) => void;
}

export const useCatalogStore = create<CatalogState>((set) => ({
  trainings: [
    {
      id: '1',
      title: 'React.js Avancé',
      description: 'Maîtrisez les concepts avancés de React.js',
      duration: 21,
      price: 1200,
      category: 'Développement Web',
      level: 'advanced',
      objectives: ['Hooks avancés', 'Performance', 'Architecture'],
      requiredSpecialties: ['1'],
      status: 'active',
      files: [],
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=300&h=200',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
  ],
  addTraining: (training) =>
    set((state) => ({
      trainings: [
        ...state.trainings,
        {
          ...training,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateTraining: (id, training) =>
    set((state) => ({
      trainings: state.trainings.map((t) =>
        t.id === id ? { ...t, ...training, updatedAt: new Date().toISOString() } : t
      ),
    })),
  deleteTraining: (id) =>
    set((state) => ({
      trainings: state.trainings.filter((t) => t.id !== id),
    })),
}));