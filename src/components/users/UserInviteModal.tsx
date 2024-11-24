import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useUserStore, useAuthStore } from '../../lib/store';
import { sendEmail, emailTemplates } from '../../lib/email';
import type { UserRole } from '../../types';

const inviteSchema = z.object({
  email: z.string().email('Email invalide'),
  role: z.enum(['manager', 'trainer', 'user'] as const, {
    required_error: 'Le rôle est requis',
  }),
});

type InviteForm = z.infer<typeof inviteSchema>;

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrateur',
  manager: 'Manager',
  trainer: 'Formateur',
  user: 'Utilisateur',
};

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserInviteModal({ isOpen, onClose }: UserInviteModalProps) {
  const inviteUser = useUserStore((state) => state.inviteUser);
  const currentUser = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteForm) => {
    if (!currentUser) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Invitation expires in 7 days

    inviteUser({
      email: data.email,
      role: data.role,
      invitedBy: currentUser.id,
      expiresAt: expiresAt.toISOString(),
    });

    // Send invitation email
    await sendEmail({
      to: data.email,
      subject: 'Invitation à rejoindre FormationPro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Invitation à rejoindre FormationPro</h2>
          <p>Bonjour,</p>
          <p>Vous avez été invité(e) à rejoindre FormationPro en tant que ${ROLE_LABELS[data.role].toLowerCase()}.</p>
          <p>Cette invitation a été envoyée par ${currentUser.name} et expire le ${expiresAt.toLocaleDateString()}.</p>
          <p>Pour accepter l'invitation, veuillez cliquer sur le lien ci-dessous :</p>
          <p><a href="#" style="background-color: #FF4400; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accepter l'invitation</a></p>
          <p>Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet email.</p>
          <p>Cordialement,<br>L'équipe FormationPro</p>
        </div>
      `,
    });

    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Inviter un utilisateur</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className="input mt-1"
                placeholder="email@exemple.com"
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
                <option value="">Sélectionner un rôle</option>
                <option value="manager">Manager</option>
                <option value="trainer">Formateur</option>
                <option value="user">Utilisateur</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
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
                disabled={isSubmitting}
                className="btn btn-primary px-4 py-2"
              >
                {isSubmitting ? 'Envoi...' : 'Envoyer l\'invitation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}