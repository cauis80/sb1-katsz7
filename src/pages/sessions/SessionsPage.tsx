import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar, Users, Pencil, Trash2, Eye, Mail } from 'lucide-react';
import { useSessionsStore, useCatalogStore, useRegistrationsStore } from '../../lib/store';
import { formatDate } from '../../utils/date';
import SessionModal from '../../components/sessions/SessionModal';
import SessionDetailsModal from '../../components/sessions/SessionDetailsModal';
import EmailComposer from '../../components/email/EmailComposer';
import SessionRegistrationForm from '../../components/sessions/SessionRegistrationForm';
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

export default function SessionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [viewingSession, setViewingSession] = useState<Session | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedSessionForEmail, setSelectedSessionForEmail] = useState<Session | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedSessionForRegistration, setSelectedSessionForRegistration] = useState<Session | null>(null);

  const { sessions, addSession, updateSession, deleteSession } = useSessionsStore();
  const trainings = useCatalogStore((state) => state.trainings);
  const registrations = useRegistrationsStore((state) => state.registrations);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const training = trainings.find((t) => t.id === session.trainingId);
      if (!training) return false;

      const matchesSearch =
        training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || session.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, trainings, searchQuery, statusFilter]);

  const handleEmailParticipants = (session: Session) => {
    setSelectedSessionForEmail(session);
    setIsEmailModalOpen(true);
  };

  const handleAddSession = (sessionData: Omit<Session, 'id' | 'participants' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
    const newSession = {
      ...sessionData,
      id: crypto.randomUUID(),
      participants: 0,
      statusHistory: [
        {
          id: crypto.randomUUID(),
          status: sessionData.status,
          date: new Date().toISOString(),
          userId: '1',
          userName: 'Super Admin',
          comment: 'Session créée',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addSession(newSession);
    setIsModalOpen(false);
  };

  const handleEditSession = (id: string, sessionData: Partial<Session> & { statusComment?: string }) => {
    const { statusComment, ...data } = sessionData;
    updateSession(id, data, statusComment);
    setIsModalOpen(false);
    setEditingSession(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      deleteSession(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Sessions de formation</h1>
        <button
          onClick={() => {
            setEditingSession(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle session
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Rechercher une session..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input"
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lieu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participants
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => {
                const training = trainings.find((t) => t.id === session.trainingId);
                if (!training) return null;

                const sessionRegistrations = registrations.filter(r => r.sessionId === session.id);

                return (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {training.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {training.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(session.startDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(session.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{session.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {session.participants} / {session.maxParticipants}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedSessionForRegistration(session);
                          setIsRegistrationModalOpen(true);
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Ajouter
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[session.status]
                        }`}
                      >
                        {STATUS_LABELS[session.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setViewingSession(session)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEmailParticipants(session)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingSession(session);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        onSubmit={editingSession ? 
          (data) => handleEditSession(editingSession.id, data) : 
          handleAddSession
        }
        session={editingSession}
      />

      {viewingSession && (
        <SessionDetailsModal
          isOpen={!!viewingSession}
          onClose={() => setViewingSession(null)}
          session={viewingSession}
        />
      )}

      {selectedSessionForEmail && (
        <EmailComposer
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setSelectedSessionForEmail(null);
          }}
          recipients={registrations
            .filter(r => r.sessionId === selectedSessionForEmail.id)
            .map(r => ({
              email: r.participantEmail,
              name: r.participantName
            }))}
          defaultSubject={`Information importante - Formation ${
            trainings.find(t => t.id === selectedSessionForEmail.trainingId)?.title
          }`}
        />
      )}

      {selectedSessionForRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <SessionRegistrationForm
                session={selectedSessionForRegistration}
                onCancel={() => {
                  setIsRegistrationModalOpen(false);
                  setSelectedSessionForRegistration(null);
                }}
                onSuccess={() => {
                  setIsRegistrationModalOpen(false);
                  setSelectedSessionForRegistration(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}