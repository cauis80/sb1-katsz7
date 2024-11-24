import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload } from 'lucide-react';
import Select from 'react-select';
import { useSpecialtiesStore } from '../../lib/store';
import type { Trainer } from '../../types';

const trainerSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  specialties: z.array(z.string()).min(1, 'Au moins une spécialité est requise'),
  bio: z.string().min(1, 'La biographie est requise'),
  status: z.enum(['active', 'inactive']),
});

type TrainerForm = z.infer<typeof trainerSchema>;

interface TrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Trainer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  trainer?: Trainer | null;
}

export default function TrainerModal({
  isOpen,
  onClose,
  onSubmit,
  trainer,
}: TrainerModalProps) {
  const { groups, specialties } = useSpecialtiesStore();
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TrainerForm>({
    resolver: zodResolver(trainerSchema),
    defaultValues: {
      status: 'active',
      specialties: [],
    },
  });

  useEffect(() => {
    if (trainer) {
      reset({
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        email: trainer.email,
        phone: trainer.phone,
        specialties: trainer.specialties,
        bio: trainer.bio,
        status: trainer.status,
      });
    } else {
      reset({
        status: 'active',
        specialties: [],
      });
    }
  }, [trainer, reset]);

  const handleFormSubmit = async (data: TrainerForm) => {
    const trainerData = {
      ...data,
      resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : undefined,
    };
    onSubmit(trainerData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    }
  };

  // Group specialties by their groups for the select options
  const specialtyOptions = groups.map(group => ({
    label: group.name,
    options: specialties
      .filter(specialty => specialty.groupId === group.id)
      .map(specialty => ({
        value: specialty.id,
        label: specialty.name,
      })),
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {trainer ? 'Modifier le formateur' : 'Nouveau formateur'}
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spécialités
              </label>
              <Controller
                name="specialties"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={specialtyOptions}
                    className="react-select"
                    classNamePrefix="react-select"
                    placeholder="Sélectionner des spécialités..."
                    noOptionsMessage={() => "Aucune spécialité trouvée"}
                    value={specialtyOptions
                      .flatMap(group => group.options)
                      .filter(option => field.value.includes(option.value))}
                    onChange={(newValue) => {
                      field.onChange(newValue ? newValue.map(v => v.value) : []);
                    }}
                  />
                )}
              />
              {errors.specialties && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.specialties.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Biographie
              </label>
              <textarea
                {...register('bio')}
                rows={4}
                className="input mt-1"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CV (PDF)
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="btn btn-secondary px-4 py-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger le CV
                </label>
                {resumeFile && (
                  <span className="text-sm text-gray-600">
                    {resumeFile.name}
                  </span>
                )}
                {trainer?.resumeUrl && !resumeFile && (
                  <a
                    href={trainer.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Voir le CV actuel
                  </a>
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
                {trainer ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}