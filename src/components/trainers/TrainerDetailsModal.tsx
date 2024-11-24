import React from 'react';
import { X, User, Phone, Mail, BookOpen, FileText } from 'lucide-react';
import type { Trainer } from '../../types';

const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
  active: 'Actif',
  inactive: 'Inactif',
};

interface TrainerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainer: Trainer;
}

export default function TrainerDetailsModal({
  isOpen,
  onClose,
  trainer,
}: TrainerDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {trainer.firstName} {trainer.lastName}
              </h2>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_COLORS[trainer.status]
                }`}
              >
                {STATUS_LABELS[trainer.status]}
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
                    {trainer.firstName} {trainer.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Téléphone</p>
                  <p className="text-sm text-gray-600">{trainer.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{trainer.email}</p>
                </div>
              </div>

              {trainer.resumeUrl && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">CV</p>
                    <a
                      href={trainer.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Voir le CV
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700">Spécialités</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {trainer.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Biographie</p>
                <p className="text-sm text-gray-600">{trainer.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}