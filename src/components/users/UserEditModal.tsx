import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useUserStore } from '../../lib/store';

const userSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  role: z.enum(['admin', 'manager', 'trainer', 'user'], {
    required_error: 'Le rôle est requis',
  }),
  status: z.enum(['active', 'inactive'], {
    required_error: 'Le statut est requis',
  }),
});

type UserForm = z.infer<typeof userSchema>;

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function UserEditModal({
  isOpen,
  onClose,
  userId,
}: UserEditModalProps) {
  const { users, updateUser } = useUserStore();
  const user = users.find((u) => u.id === userId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status === 'pending' ? 'inactive' : user.status,
        }
      : undefined,
  });

  const onSubmit = (data: UserForm) => {
    updateUser(userId, data);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Modifier l'utilisateur</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nom
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
                Rôle
              </label>
              <select {...register('role')} className="input mt-1">
                <option value="admin">Administrateur</option>
                <option value="manager">Manager</option>
                <option value="trainer">Formateur</option>
                <option value="user">Utilisateur</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select {...register('status')} className="input mt-1">
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.status.message}
                </p>
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
              <button type="submit" className="btn btn-primary px-4 py-2">
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}