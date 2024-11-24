import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Training, Session, Registration, Company, Participant, Trainer, StatusHistoryEntry, SpecialtyGroup, Specialty } from '../types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

// User Store
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

// Specialties Store
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

// Catalog Store
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

// Sessions Store
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
      const newHistory: StatusHistoryEntry[] = [...(session.statusHistory || [])];

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

// Registrations Store
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

// Companies Store
interface CompaniesState {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
}

export const useCompaniesStore = create<CompaniesState>((set) => ({
  companies: [],
  addCompany: (company) =>
    set((state) => ({
      companies: [
        ...state.companies,
        {
          ...company,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateCompany: (id, company) =>
    set((state) => ({
      companies: state.companies.map((c) =>
        c.id === id ? { ...c, ...company, updatedAt: new Date().toISOString() } : c
      ),
    })),
  deleteCompany: (id) =>
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
    })),
}));

// Participants Store
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

// Trainers Store
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