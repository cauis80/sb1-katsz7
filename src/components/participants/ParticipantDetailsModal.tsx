import React from 'react';
import { X, User, Phone, Mail, Building2, Briefcase } from 'lucide-react';
import { useCompaniesStore } from '../../lib/store';
import type { Participant } from '../../types';

const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
  active: 'Actif',
  inactive: 'Inactif',
};

interface ParticipantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant;
}

export default function ParticipantDetailsModal({
  isOpen,
  onClose,
  participant,
}: ParticipantDetailsModalProps) {
  const companies = useCompaniesStore((state) => state.companies);
  const company = companies.find(c => c.id === participant.companyId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {participant.firstName} {participant.lastName}
              </h2>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_COLORS[participant.status]
                }`}
              >
                {STATUS_LABELS[participant.status]}
              </span>
            </div>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Nom complet</p>
                  <p className="text-sm text-gray-600">
                    {participant.firstName} {participant.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Téléphone</p>
                  <p className="text-sm text-gray-600">{participant.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{participant.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {company && (
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Entreprise</p>
                    <p className="text-sm text-gray-600">{company.name}</p>
                  </div>
                </div>
              )}

              {participant.jobTitle && (
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Poste</p>
                    <p className="text-sm text-gray-600">{participant.jobTitle}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}