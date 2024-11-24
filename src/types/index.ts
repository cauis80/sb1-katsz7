export * from './auth';
export * from './training';
export * from './specialty';
export * from './session';

export interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  contactName?: string;
  contactRole?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId?: string;
  jobTitle?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Registration {
  id: string;
  sessionId: string;
  participantName: string;
  participantEmail: string;
  company: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'waitlist';
  registrationDate: string;
  prerequisites: boolean;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  comments?: string;
}

export interface Trainer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  bio: string;
  status: 'active' | 'inactive';
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}