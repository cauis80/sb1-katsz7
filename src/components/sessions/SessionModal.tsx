import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useCatalogStore, useTrainersStore } from '../../lib/store';
import { toISODateString } from '../../utils/date';
import DatePicker from '../ui/DatePicker';
import type { Session } from '../../types';

const STATUS_LABELS = {
  scheduled: 'Planifiée',
  confirmed: 'Confirmée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

const sessionSchema = z.object({
  trainingId: z.string().min(1, 'La formation est requise'),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().min(1, 'La date de fin est requise'),
  location: z.string().min(1, 'Le lieu est requis'),
  trainerId: z.string().min(1, 'Le formateur est requis'),
  maxParticipants: z.number().min(1, 'Le nombre maximum de participants doit être supérieur à 0'),
  status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  statusComment: z.string().optional(),
}).refine((data) => {
  const start = new Date(toISODateString(data.startDate));
  const end = new Date(toISODateString(data.endDate));
  return start <= end;
}, {
  message: "La date de fin doit être postérieure ou égale à la date de début",
  path: ["endDate"],
});

type SessionForm = z.infer<typeof sessionSchema>;

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SessionForm) => void;
  session?: Session | null;
}

export default function SessionModal({
  isOpen,
  onClose,
  onSubmit,
  session,
}: SessionModalProps) {
  const trainings = useCatalogStore((state) => state.trainings);
  const trainers = useTrainersStore((state) => state.trainers);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      status: 'scheduled',
      maxParticipants: 12,
    },
  });

  const selectedTrainingId = watch('trainingId');

  // Filter trainers based on selected training's required specialties
  const availableTrainers = useMemo(() => {
    if (!selectedTrainingId) return [];

    const selectedTraining = trainings.find(t => t.id === selectedTrainingId);
    if (!selectedTraining) return [];

    return trainers.filter(trainer => 
      trainer.status === 'active' && 
      selectedTraining.requiredSpecialties.some(specialty => 
        trainer.specialties.includes(specialty)
      )
    );
  }, [selectedTrainingId, trainings, trainers]);

  useEffect(() => {
    if (session) {
      const startDate = new Date(session.startDate);
      const endDate = new Date(session.endDate);
      
      reset({
        trainingId: session.trainingId,
        startDate: `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`,
        endDate: `${endDate.getDate().toString().padStart(2, '0')}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`,
        location: session.location,
        trainerId: session.trainerId,
        maxParticipants: session.maxParticipants,
        status: session.status,
      });
    } else {
      reset({
        status: 'scheduled',
        maxParticipants: 12,
      });
    }
  }, [session, reset]);

  const handleFormSubmit = (data: SessionForm) => {
    const formattedData = {
      ...data,
      startDate: toISODateString(data.startDate),
      endDate: toISODateString(data.endDate),
    };
    onSubmit(formattedData);
  };

  const currentStatus = watch('status');
  const showStatusComment = session && currentStatus !== session.status;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {session ? 'Modifier la session' : 'Nouvelle session'}
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Formation
              </label>
              <select
                {...register('trainingId')}
                className="input mt-1"
              >
                <option value="">Sélectionner une formation</option>
                {trainings.map((training) => (
                  <option key={training.id} value={training.id}>
                    {training.title}
                  </option>
                ))}
              </select>
              {errors.trainingId && (
                <p className="mt-1 text-sm text-red-600">{errors.trainingId.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de début
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      placeholderText="JJ/MM/AAAA"
                      error={errors.startDate?.message}
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date de fin
                </label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      placeholderText="JJ/MM/AAAA"
                      error={errors.endDate?.message}
                      minDate={watch('startDate') ? new Date(toISODateString(watch('startDate'))) : undefined}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lieu
              </label>
              <input
                type="text"
                {...register('location')}
                className="input mt-1"
                placeholder="Ex: Paris"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Formateur
                </label>
                <select
                  {...register('trainerId')}
                  className="input mt-1"
                  disabled={!selectedTrainingId}
                >
                  <option value="">
                    {selectedTrainingId 
                      ? "Sélectionner un formateur"
                      : "Sélectionnez d'abord une formation"}
                  </option>
                  {availableTrainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.firstName} {trainer.lastName}
                    </option>
                  ))}
                </select>
                {errors.trainerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.trainerId.message}</p>
                )}
                {selectedTrainingId && availableTrainers.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    Aucun formateur qualifié disponible pour cette formation
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre max. de participants
                </label>
                <input
                  type="number"
                  {...register('maxParticipants', { valueAsNumber: true })}
                  className="input mt-1"
                />
                {errors.maxParticipants && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxParticipants.message}</p>
                )}
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
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            {showStatusComment && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Commentaire sur le changement de statut
                </label>
                <textarea
                  {...register('statusComment')}
                  rows={3}
                  className="input mt-1"
                  placeholder="Raison du changement de statut..."
                />
              </div>
            )}

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
                {session ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}