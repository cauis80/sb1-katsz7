import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useSpecialtiesStore } from '../../lib/store';

const groupSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
});

type GroupForm = z.infer<typeof groupSchema>;

interface SpecialtyGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
}

export default function SpecialtyGroupModal({
  isOpen,
  onClose,
  groupId,
}: SpecialtyGroupModalProps) {
  const { groups, addGroup, updateGroup } = useSpecialtiesStore();
  const editingGroup = groupId ? groups.find((g) => g.id === groupId) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
  });

  useEffect(() => {
    if (editingGroup) {
      reset({
        name: editingGroup.name,
        description: editingGroup.description,
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [editingGroup, reset]);

  const onSubmit = (data: GroupForm) => {
    if (editingGroup) {
      updateGroup(editingGroup.id, data);
    } else {
      addGroup(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingGroup ? 'Modifier le groupe' : 'Nouveau groupe'}
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom du groupe
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
                {editingGroup ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}