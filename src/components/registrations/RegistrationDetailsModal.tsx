import React from 'react';
import { X, Calendar, User, Building2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { useSessionsStore, useCatalogStore } from '../../lib/store';
import { formatDate } from '../../utils/date';
import type { Registration } from '../../types';

const STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  waitlist: 'bg-blue-50 text-blue-700',
};

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  cancelled: 'Annulée',
  waitlist: 'Liste d\'attente',
};

const PAYMENT_STATUS_COLORS = {
  pending: 'bg-yellow-50 text-yellow-700',
  paid: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
};

const PAYMENT_STATUS_LABELS = {
  pending: 'En attente',
  paid: 'Payé',
  cancelled: 'Annulé',
};

interface RegistrationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: Registration;
}

export default function RegistrationDetailsModal({
  isOpen,
  onClose,
  registration,
}: RegistrationDetailsModalProps) {
  const sessions = useSessionsStore((state) => state.sessions);
  const trainings = useCatalogStore((state) => state.trainings);

  const session = sessions.find((s) => s.id === registration.sessionId);
  const training = session ? trainings.find((t) => t.id === session.trainingId) : null;

  if (!isOpen || !session || !training) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Détails de l'inscription
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {training.title}
              </p>
            </div>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Session</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(session.startDate)} - {formatDate(session.endDate)}
                  </p>
                  <p className="text-sm text-gray-600">{session.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Participant</p>
                  <p className="text-sm text-gray-600">{registration.participantName}</p>
                  <p className="text-sm text-gray-600">{registration.participantEmail}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Entreprise</p>
                  <p className="text-sm text-gray-600">{registration.company}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Statut</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    STATUS_COLORS[registration.status]
                  }`}
                >
                  {STATUS_LABELS[registration.status]}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Paiement</p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    PAYMENT_STATUS_COLORS[registration.paymentStatus]
                  }`}
                >
                  {PAYMENT_STATUS_LABELS[registration.paymentStatus]}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Prérequis</p>
                <div className="flex items-center space-x-1">
                  {registration.prerequisites ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-700">Validés</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700">Non validés</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {registration.comments && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Commentaires</h3>
              <p className="text-sm text-gray-600">{registration.comments}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}