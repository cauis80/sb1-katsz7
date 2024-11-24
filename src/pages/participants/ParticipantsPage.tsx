import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, Eye, Mail, Upload } from 'lucide-react';
import { useParticipantsStore, useCompaniesStore } from '../../lib/store';
import ParticipantModal from '../../components/participants/ParticipantModal';
import ParticipantDetailsModal from '../../components/participants/ParticipantDetailsModal';
import EmailComposer from '../../components/email/EmailComposer';
import BulkEmailImporter from '../../components/email/BulkEmailImporter';
import type { Participant } from '../../types';

const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
  active: 'Actif',
  inactive: 'Inactif',
};

export default function ParticipantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [companyFilter, setCompanyFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [viewingParticipant, setViewingParticipant] = useState<Participant | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const { participants, addParticipant, updateParticipant, deleteParticipant } = useParticipantsStore();
  const companies = useCompaniesStore((state) => state.companies);

  const filteredParticipants = useMemo(() => {
    return participants.filter(participant => {
      const matchesSearch = 
        `${participant.firstName} ${participant.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || participant.status === statusFilter;
      const matchesCompany = !companyFilter || participant.companyId === companyFilter;
      return matchesSearch && matchesStatus && matchesCompany;
    });
  }, [participants, searchQuery, statusFilter, companyFilter]);

  const handleEmailSelected = () => {
    if (selectedParticipants.length === 0) return;
    setIsEmailModalOpen(true);
  };

  const handleAddParticipant = (participantData: Omit<Participant, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newParticipant = {
      ...participantData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addParticipant(newParticipant);
    setIsModalOpen(false);
  };

  const handleEditParticipant = (id: string, participantData: Partial<Participant>) => {
    updateParticipant(id, participantData);
    setIsModalOpen(false);
    setEditingParticipant(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce participant ?')) {
      deleteParticipant(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Participants</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="btn btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importer
          </button>
          <button
            onClick={handleEmailSelected}
            className="btn btn-secondary px-4 py-2 flex items-center gap-2"
            disabled={selectedParticipants.length === 0}
          >
            <Mail className="w-4 h-4" />
            Envoyer un email ({selectedParticipants.length})
          </button>
          <button
            onClick={() => {
              setEditingParticipant(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau participant
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Rechercher un participant..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">Tous les statuts</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="input"
          >
            <option value="">Toutes les entreprises</option>
            {companies
              .filter(company => company.status === 'active')
              .map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedParticipants(filteredParticipants.map(p => p.id));
                      } else {
                        setSelectedParticipants([]);
                      }
                    }}
                    checked={selectedParticipants.length === filteredParticipants.length}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entreprise
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
              {filteredParticipants.map((participant) => {
                const company = companies.find(c => c.id === participant.companyId);

                return (
                  <tr key={participant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        value={participant.id}
                        checked={selectedParticipants.includes(participant.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParticipants([...selectedParticipants, participant.id]);
                          } else {
                            setSelectedParticipants(selectedParticipants.filter(id => id !== participant.id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {participant.firstName} {participant.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {participant.jobTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {participant.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {participant.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          STATUS_COLORS[participant.status]
                        }`}
                      >
                        {STATUS_LABELS[participant.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setViewingParticipant(participant)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingParticipant(participant);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(participant.id)}
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

      <ParticipantModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingParticipant(null);
        }}
        onSubmit={editingParticipant ? 
          (data) => handleEditParticipant(editingParticipant.id, data) : 
          handleAddParticipant
        }
        participant={editingParticipant}
      />

      {viewingParticipant && (
        <ParticipantDetailsModal
          isOpen={!!viewingParticipant}
          onClose={() => setViewingParticipant(null)}
          participant={viewingParticipant}
        />
      )}

      <EmailComposer
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipients={participants
          .filter(p => selectedParticipants.includes(p.id))
          .map(p => ({
            email: p.email,
            name: `${p.firstName} ${p.lastName}`
          }))}
        defaultSubject="Information importante - FormationPro"
      />

      <BulkEmailImporter
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(importedEmails) => {
          console.log('Imported emails:', importedEmails);
          setIsImportModalOpen(false);
        }}
      />
    </div>
  );
}