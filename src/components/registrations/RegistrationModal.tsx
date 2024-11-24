import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus } from 'lucide-react';
import { useSessionsStore, useCatalogStore, useCompaniesStore } from '../../lib/store';
import CompanyModal from '../companies/CompanyModal';
import type { RegistrationFormData } from '../../types';

const registrationSchema = z.object({
  sessionId: z.string().min(1, 'La session est requise'),
  participantName: z.string().min(1, 'Le nom est requis'),
  participantEmail: z.string().email('Email invalide'),
  company: z.string().min(1, 'L\'entreprise est requise'),
  comments: z.string().optional(),
});

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RegistrationFormData) => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  onSubmit,
}: RegistrationModalProps) {
  const sessions = useSessionsStore((state) => state.sessions);
  const trainings = useCatalogStore((state) => state.trainings);
  const companies = useCompaniesStore((state) => state.companies);
  const addCompany = useCompaniesStore((state) => state.addCompany);

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const handleAddCompany = (companyData: any) => {
    const newCompany = {
      ...companyData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addCompany(newCompany);
    setIsCompanyModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Nouvelle inscription</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session de formation
              </label>
              <select
                {...register('sessionId')}
                className="input mt-1"
              >
                <option value="">Sélectionner une session</option>
                {sessions.map((session) => {
                  const training = trainings.find(
                    (t) => t.id === session.trainingId
                  );
                  if (!training) return null;
                  return (
                    <option key={session.id} value={session.id}>
                      {training.title} - {session.location} ({session.startDate})
                    </option>
                  );
                })}
              </select>
              {errors.sessionId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.sessionId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du participant
              </label>
              <input
                type="text"
                {...register('participantName')}
                className="input mt-1"
              />
              {errors.participantName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.participantName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email du participant
              </label>
              <input
                type="email"
                {...register('participantEmail')}
                className="input mt-1"
              />
              {errors.participantEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.participantEmail.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Entreprise
              </label>
              <div className="flex gap-2">
                <select
                  {...register('company')}
                  className="input mt-1 flex-1"
                >
                  <option value="">Sélectionner une entreprise</option>
                  {companies
                    .filter(company => company.status === 'active')
                    .map((company) => (
                      <option key={company.id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCompanyModalOpen(true)}
                  className="mt-1 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commentaires
              </label>
              <textarea
                {...register('comments')}
                rows={3}
                className="input mt-1"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary px-4 py-2"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
              >
                Inscrire
              </button>
            </div>
          </form>
        </div>
      </div>

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onSubmit={handleAddCompany}
      />
    </div>
  );
}