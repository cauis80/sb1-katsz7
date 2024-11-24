export interface StatusHistoryEntry {
  id: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  date: string;
  userId: string;
  userName: string;
  comment?: string;
}

export interface Session {
  id: string;
  trainingId: string;
  startDate: string;
  endDate: string;
  location: string;
  trainerId: string;
  participants: number;
  maxParticipants: number;
  status: StatusHistoryEntry['status'];
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}