import { create } from 'zustand';
import type { Company } from '../types';

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