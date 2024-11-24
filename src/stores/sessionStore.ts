import { create } from 'zustand';
import type { Session } from '../types';
import { useAuthStore } from './authStore';

interface SessionsState {
  sessions: Session[];
  addSession: (session: Omit<Session, 'id' | 'participants' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
  updateSession: (id: string, sessionData: Partial<Session>, comment?: string) => void;
  deleteSession: (id: string) => void;
}

export const useSessionsStore = create<SessionsState>((set) => ({
  sessions: [
    {
      id: '1',
      trainingId: '1',
      startDate: '2024-03-20',
      endDate: '2024-03-23',
      location: 'Paris',
      trainerId: '2',
      participants: 8,
      maxParticipants: 12,
      status: 'confirmed',
      statusHistory: [
        {
          id: '1',
          status: 'scheduled',
          date: '2024-03-10T10:00:00Z',
          userId: '1',
          userName: 'Super Admin',
          comment: 'Session créée',
        },
        {
          id: '2',
          status: 'confirmed',
          date: '2024-03-12T14:30:00Z',
          userId: '1',
          userName: 'Super Admin',
          comment: 'Session confirmée après atteinte du nombre minimum de participants',
        },
      ],
      createdAt: '2024-03-10',
      updatedAt: '2024-03-10',
    },
  ],
  addSession: (session) =>
    set((state) => ({
      sessions: [
        ...state.sessions,
        {
          ...session,
          id: crypto.randomUUID(),
          participants: 0,
          statusHistory: [
            {
              id: crypto.randomUUID(),
              status: session.status,
              date: new Date().toISOString(),
              userId: '1',
              userName: 'Super Admin',
              comment: 'Session créée',
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateSession: (id, sessionData, comment) =>
    set((state) => {
      const currentUser = useAuthStore.getState().user;
      if (!currentUser) return state;

      const session = state.sessions.find((s) => s.id === id);
      if (!session) return state;

      const newStatus = sessionData.status;
      const newHistory: Session['statusHistory'] = [...(session.statusHistory || [])];

      if (newStatus && newStatus !== session.status) {
        newHistory.push({
          id: crypto.randomUUID(),
          status: newStatus,
          date: new Date().toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          comment,
        });
      }

      return {
        sessions: state.sessions.map((s) =>
          s.id === id
            ? {
                ...s,
                ...sessionData,
                statusHistory: newHistory,
                updatedAt: new Date().toISOString(),
              }
            : s
        ),
      };
    }),
  deleteSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
    })),
}));