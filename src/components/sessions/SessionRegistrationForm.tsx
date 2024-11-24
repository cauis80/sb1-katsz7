import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Plus } from 'lucide-react';
import { useParticipantsStore, useRegistrationsStore, useCompaniesStore } from '../../lib/store';
import type { Session, Participant } from '../../types';
import ParticipantModal from '../participants/ParticipantModal';

const registrationSchema = z.object({
  participantId: z.string().min(1, 'Le participant est requis'),
  comments: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

interface SessionRegistrationFormProps {
  session: Session;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function SessionRegistrationForm({
  session,
  onCancel,
  onSuccess,
}: SessionRegistrationFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);

  const { participants } = useParticipantsStore();
  const { companies } = useCompaniesStore();
  const { addRegistration } = useRegistrationsStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  });

  const selectedParticipantId = watch('participantId');
  const selectedParticipant = participants.find(p => p.id === selectedParticipantId);

  const filteredParticipants = participants.filter(participant => {
    const fullName = `${participant.firstName} ${participant.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           participant.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleParticipantSelect = (participant: Participant) => {
    setValue('participantId', participant.id);
  };

  const handleAddParticipant = (participantData: any) => {
    handleParticipantSelect(participantData);
    setIsParticipantModalOpen(false);
  };

  const onSubmit = (data: RegistrationForm) => {
    if (!selectedParticipant) return;

    // Get participant's company
    const company = selectedParticipant.companyId ? 
      companies.find(c => c.id === selectedParticipant.companyId) : 
      undefined;

    const registration = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      participantName: `${selectedParticipant.firstName} ${selectedParticipant.lastName}`,
      participantEmail: selectedParticipant.email,
      company: company?.name || 'Indépendant',
      status: session.participants >= session.maxParticipants ? 'waitlist' : 'pending',
      registrationDate: new Date().toISOString(),
      prerequisites: false,
      paymentStatus: 'pending',
      comments: data.comments,
    };

    addRegistration(registration);
    onSuccess();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Inscription à la session
        </h3>
      </div>
      <p className="text-sm text-gray-500">
        Sélectionnez un participant existant ou créez un nouveau profil
      </p>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Rechercher un participant..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-60 overflow-y-auto">
          {filteredParticipants.map((participant) => {
            const company = participant.companyId ? 
              companies.find(c => c.id === participant.companyId) : 
              undefined;
            
            return (
              <button
                key={participant.id}
                type="button"
                onClick={() => handleParticipantSelect(participant)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between ${
                  selectedParticipantId === participant.id ? 'bg-primary-50' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {participant.firstName} {participant.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{participant.email}</p>
                </div>
                {company && (
                  <p className="text-sm text-gray-500">
                    {company.name}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIsParticipantModalOpen(true)}
          className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary-500 hover:text-primary-600 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Créer un nouveau participant
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('participantId')} />
        {errors.participantId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.participantId.message}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Commentaires (optionnel)
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
            onClick={onCancel}
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

      <ParticipantModal
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        onSubmit={handleAddParticipant}
      />
    </div>
  );
}