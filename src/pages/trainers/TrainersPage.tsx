import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Pencil, Trash2, Eye, Mail } from 'lucide-react';
import { useTrainersStore } from '../../lib/store';
import TrainerModal from '../../components/trainers/TrainerModal';
import TrainerDetailsModal from '../../components/trainers/TrainerDetailsModal';
import EmailComposer from '../../components/email/EmailComposer';
import type { Trainer } from '../../types';

const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
  active: 'Actif',
  inactive: 'Inactif',
};

export default function TrainersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [viewingTrainer, setViewingTrainer] = useState<Trainer | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedTrainers, setSelectedTrainers] = useState<string[]>([]);

  const { trainers, addTrainer, updateTrainer, deleteTrainer } = useTrainersStore();

  const specialties = useMemo(() => 
    Array.from(new Set(trainers.flatMap(t => t.specialties))).sort(),
    [trainers]
  );

  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer => {
      const matchesSearch = 
        `${trainer.firstName} ${trainer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || trainer.status === statusFilter;
      const matchesSpecialty = !specialtyFilter || trainer.specialties.includes(specialtyFilter);
      return matchesSearch && matchesStatus && matchesSpecialty;
    });
  }, [trainers, searchQuery, statusFilter, specialtyFilter]);

  const handleEmailSelected = () => {
    if (selectedTrainers.length === 0) return;
    setIsEmailModalOpen(true);
  };

  const handleAddTrainer = async (trainerData: Omit<Trainer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTrainer = {
      ...trainerData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTrainer(newTrainer);
    setIsModalOpen(false);
  };

  const handleEditTrainer = async (id: string, trainerData: Partial<Trainer>) => {
    updateTrainer(id, trainerData);
    setIsModalOpen(false);
    setEditingTrainer(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce formateur ?')) {
      deleteTrainer(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Formateurs</h1>
        <div className="flex gap-2">
          <button
            onClick={handleEmailSelected}
            className="btn btn-secondary px-4 py-2 flex items-center gap-2"
            disabled={selectedTrainers.length === 0}
          >
            <Mail className="w-4 h-4" />
            Envoyer un email ({selectedTrainers.length})
          </button>
          <button
            onClick={() => {
              setEditingTrainer(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouveau formateur
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Rechercher un formateur..."
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
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="input"
          >
            <option value="">Toutes les spécialités</option>
            {specialties.map(specialty => (
              <option key={specialty} value={specialty}>{specialty}</option>
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
                        setSelectedTrainers(filteredTrainers.map(t => t.id));
                      } else {
                        setSelectedTrainers([]);
                      }
                    }}
                    checked={selectedTrainers.length === filteredTrainers.length}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécialités
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
              {filteredTrainers.map((trainer) => (
                <tr key={trainer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      value={trainer.id}
                      checked={selectedTrainers.includes(trainer.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTrainers([...selectedTrainers, trainer.id]);
                        } else {
                          setSelectedTrainers(selectedTrainers.filter(id => id !== trainer.id));
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {trainer.firstName} {trainer.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {trainer.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {trainer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {trainer.specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[trainer.status]
                      }`}
                    >
                      {STATUS_LABELS[trainer.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setViewingTrainer(trainer)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingTrainer(trainer);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(trainer.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TrainerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrainer(null);
        }}
        onSubmit={editingTrainer ? 
          (data) => handleEditTrainer(editingTrainer.id, data) : 
          handleAddTrainer
        }
        trainer={editingTrainer}
      />

      {viewingTrainer && (
        <TrainerDetailsModal
          isOpen={!!viewingTrainer}
          onClose={() => setViewingTrainer(null)}
          trainer={viewingTrainer}
        />
      )}

      <EmailComposer
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipients={trainers
          .filter(t => selectedTrainers.includes(t.id))
          .map(t => ({
            email: t.email,
            name: `${t.firstName} ${t.lastName}`
          }))}
        defaultSubject="Information importante - FormationPro"
      />
    </div>
  );
}