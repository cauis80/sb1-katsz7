import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useCompaniesStore } from '../../lib/store';
import type { Participant } from '../../types';

const participantSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  companyId: z.string().optional(),
  jobTitle: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type ParticipantForm = z.infer<typeof participantSchema>;

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParticipantForm) => void;
  participant?: Participant | null;
}

export default function ParticipantModal({
  isOpen,
  onClose,
  onSubmit,
  participant,
}: ParticipantModalProps) {
  const companies = useCompaniesStore((state) => state.companies);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      status: 'active',
    },
  });

  useEffect(() => {
    if (participant) {
      reset({
        firstName: participant.firstName,
        lastName: participant.lastName,
        email: participant.email,
        phone: participant.phone,
        companyId: participant.companyId,
        jobTitle: participant.jobTitle,
        status: participant.status,
      });
    } else {
      reset({
        status: 'active',
      });
    }
  }, [participant, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {participant ? 'Modifier le participant' : 'Nouveau participant'}
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prénom
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="input mt-1"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="input mt-1"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="input mt-1"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input mt-1"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Entreprise (optionnel)
                </label>
                <select
                  {...register('companyId')}
                  className="input mt-1"
                >
                  <option value="">Aucune entreprise</option>
                  {companies
                    .filter(company => company.status === 'active')
                    .map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Poste (optionnel)
                </label>
                <input
                  type="text"
                  {...register('jobTitle')}
                  className="input mt-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select
                {...register('status')}
                className="input mt-1"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
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
                {participant ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}