import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useSpecialtiesStore } from '../../lib/store';

const specialtySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  groupId: z.string().min(1, 'Le groupe est requis'),
  description: z.string().optional(),
});

type SpecialtyForm = z.infer<typeof specialtySchema>;

interface SpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialtyId: string | null;
}

export default function SpecialtyModal({
  isOpen,
  onClose,
  specialtyId,
}: SpecialtyModalProps) {
  const { groups, specialties, addSpecialty, updateSpecialty } = useSpecialtiesStore();
  const editingSpecialty = specialtyId
    ? specialties.find((s) => s.id === specialtyId)
    : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SpecialtyForm>({
    resolver: zodResolver(specialtySchema),
    defaultValues: {
      name: '',
      groupId: '',
      description: '',
    },
  });

  useEffect(() => {
    if (editingSpecialty) {
      reset({
        name: editingSpecialty.name,
        groupId: editingSpecialty.groupId,
        description: editingSpecialty.description,
      });
    } else {
      reset({
        name: '',
        groupId: '',
        description: '',
      });
    }
  }, [editingSpecialty, reset, isOpen]); // Added isOpen dependency to reset form when modal opens

  const onSubmit = (data: SpecialtyForm) => {
    if (editingSpecialty) {
      updateSpecialty(editingSpecialty.id, data);
    } else {
      addSpecialty(data);
    }
    onClose();
    reset(); // Reset form after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingSpecialty ? 'Modifier la spécialité' : 'Nouvelle spécialité'}
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom de la spécialité
              </label>
              <input
                type="text"
                {...register('name')}
                className="input mt-1"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Groupe
              </label>
              <select {...register('groupId')} className="input mt-1">
                <option value="">Sélectionner un groupe</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.groupId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description (optionnelle)
              </label>
              <textarea
                {...register('description')}
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
              <button type="submit" className="btn btn-primary px-4 py-2">
                {editingSpecialty ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}