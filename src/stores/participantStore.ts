import { create } from 'zustand';
import type { Participant } from '../types';

interface ParticipantsState {
  participants: Participant[];
  addParticipant: (participant: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateParticipant: (id: string, participant: Partial<Participant>) => void;
  deleteParticipant: (id: string) => void;
}

export const useParticipantsStore = create<ParticipantsState>((set) => ({
  participants: [],
  addParticipant: (participant) =>
    set((state) => ({
      participants: [
        ...state.participants,
        {
          ...participant,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateParticipant: (id, participant) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === id ? { ...p, ...participant, updatedAt: new Date().toISOString() } : p
      ),
    })),
  deleteParticipant: (id) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== id),
    })),
}));