import React, { useState, useMemo } from 'react';
import { Plus, Search, Eye, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useRegistrationsStore, useSessionsStore, useCatalogStore } from '../../lib/store';
import { formatDate } from '../../utils/date';
import RegistrationModal from '../../components/registrations/RegistrationModal';
import RegistrationDetailsModal from '../../components/registrations/RegistrationDetailsModal';
import type { Registration, RegistrationFormData } from '../../types';

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

export default function RegistrationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRegistration, setViewingRegistration] = useState<Registration | null>(null);

  const registrations = useRegistrationsStore((state) => state.registrations);
  const addRegistration = useRegistrationsStore((state) => state.addRegistration);
  const deleteRegistration = useRegistrationsStore((state) => state.deleteRegistration);
  const sessions = useSessionsStore((state) => state.sessions);
  const trainings = useCatalogStore((state) => state.trainings);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      const session = sessions.find((s) => s.id === registration.sessionId);
      const training = session ? trainings.find((t) => t.id === session.trainingId) : null;
      
      const matchesSearch = 
        registration.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        registration.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        training?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;
      
      const matchesStatus = !statusFilter || registration.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrations, sessions, trainings, searchQuery, statusFilter]);

  const handleSubmit = (data: RegistrationFormData) => {
    const newRegistration: Registration = {
      id: crypto.randomUUID(),
      ...data,
      status: 'pending',
      registrationDate: new Date().toISOString(),
      prerequisites: false,
      paymentStatus: 'pending',
    };
    addRegistration(newRegistration);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) {
      deleteRegistration(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inscriptions</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle inscription
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Rechercher une inscription..."
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
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prérequis
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
              {filteredRegistrations.map((registration) => {
                const session = sessions.find((s) => s.id === registration.sessionId);
                const training = session ? trainings.find((t) => t.id === session.trainingId) : null;

                return (
                  <tr key={registration.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {training?.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session && formatDate(session.startDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {registration.participantName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {registration.participantEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {registration.company}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(registration.registrationDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {registration.prerequisites ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[registration.status]
                        }`}
                      >
                        {STATUS_LABELS[registration.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setViewingRegistration(registration)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(registration.id)}
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

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {viewingRegistration && (
        <RegistrationDetailsModal
          isOpen={!!viewingRegistration}
          onClose={() => setViewingRegistration(null)}
          registration={viewingRegistration}
        />
      )}
    </div>
  );
}