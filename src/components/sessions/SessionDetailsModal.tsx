import React, { useState } from 'react';
import { X, Clock, MapPin, Users, Activity } from 'lucide-react';
import { useCatalogStore, useTrainersStore } from '../../lib/store';
import { formatDate, formatDateTime } from '../../utils/date';
import type { Session } from '../../types';

const STATUS_COLORS = {
  scheduled: 'bg-blue-50 text-blue-700',
  confirmed: 'bg-green-50 text-green-700',
  in_progress: 'bg-yellow-50 text-yellow-700',
  completed: 'bg-gray-50 text-gray-700',
  cancelled: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
  scheduled: 'Planifiée',
  confirmed: 'Confirmée',
  in_progress: 'En cours',
  completed: 'Terminée',
  cancelled: 'Annulée',
};

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

export default function SessionDetailsModal({
  isOpen,
  onClose,
  session,
}: SessionDetailsModalProps) {
  const trainings = useCatalogStore((state) => state.trainings);
  const trainers = useTrainersStore((state) => state.trainers);

  const training = trainings.find((t) => t.id === session.trainingId);
  const trainer = trainers.find((t) => t.id === session.trainerId);

  if (!isOpen || !training || !trainer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {training.title}
              </h2>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_COLORS[session.status]
                }`}
              >
                {STATUS_LABELS[session.status]}
              </span>
            </div>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Dates</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(session.startDate)} - {formatDate(session.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Lieu</p>
                  <p className="text-sm text-gray-600">{session.location}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Participants</p>
                  <p className="text-sm text-gray-600">
                    {session.participants} / {session.maxParticipants}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Formateur</p>
                  <p className="text-sm text-gray-600">
                    {trainer.firstName} {trainer.lastName}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Historique des statuts
              </h3>
              <div className="space-y-4">
                {session.statusHistory.map((history) => (
                  <div
                    key={history.id}
                    className="border-l-2 border-gray-200 pl-4 pb-4 relative"
                  >
                    <span
                      className={`absolute -left-2 top-0 w-4 h-4 rounded-full ${
                        STATUS_COLORS[history.status]
                      }`}
                    />
                    <p className="text-sm font-medium text-gray-900">
                      {STATUS_LABELS[history.status]}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(history.date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      par {history.userName}
                    </p>
                    {history.comment && (
                      <p className="mt-1 text-sm text-gray-600">
                        {history.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}