import React, { useState, useMemo } from 'react';
import { Plus, Search, Grid, List, Pencil, Trash2, Eye } from 'lucide-react';
import { useCatalogStore } from '../../lib/store';
import TrainingModal from '../../components/catalog/TrainingModal';
import TrainingDetailsModal from '../../components/catalog/TrainingDetailsModal';
import type { Training } from '../../types';

const LEVELS = {
  beginner: { label: 'Débutant', color: 'bg-green-50 text-green-700' },
  intermediate: { label: 'Intermédiaire', color: 'bg-blue-50 text-blue-700' },
  advanced: { label: 'Avancé', color: 'bg-purple-50 text-purple-700' },
};

export default function CatalogPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<Training | null>(null);
  const [viewingTraining, setViewingTraining] = useState<Training | null>(null);

  const { trainings, addTraining, updateTraining, deleteTraining } = useCatalogStore();

  const categories = useMemo(() => 
    Array.from(new Set(trainings.map(t => t.category))),
    [trainings]
  );

  const filteredTrainings = useMemo(() => {
    return trainings.filter(training => {
      const matchesSearch = training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          training.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = !selectedLevel || training.level === selectedLevel;
      const matchesCategory = !selectedCategory || training.category === selectedCategory;
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [trainings, searchQuery, selectedLevel, selectedCategory]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAddTraining = (training: Omit<Training, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTraining = {
      ...training,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTraining(newTraining);
    setIsModalOpen(false);
  };

  const handleEditTraining = (id: string, training: Partial<Training>) => {
    updateTraining(id, training);
    setIsModalOpen(false);
    setEditingTraining(null);
  };

  const handleEdit = (training: Training) => {
    setEditingTraining(training);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      deleteTraining(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Catalogue des formations</h1>
        <button
          onClick={() => {
            setEditingTraining(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary px-4 py-2 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle formation
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Rechercher une formation..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="input"
          >
            <option value="">Tous les niveaux</option>
            {Object.entries(LEVELS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {filteredTrainings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">Aucune formation ne correspond à vos critères</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainings.map((training) => (
            <div key={training.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              {training.thumbnail ? (
                <img
                  src={training.thumbnail}
                  alt={training.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Aucune image</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{training.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${LEVELS[training.level].color}`}>
                    {LEVELS[training.level].label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{training.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {training.duration}h • {formatPrice(training.price)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewingTraining(training)}
                      className="p-1 text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(training)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(training.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTrainings.map((training) => (
            <div key={training.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <div className="flex gap-4">
                {training.thumbnail ? (
                  <img
                    src={training.thumbnail}
                    alt={training.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Aucune image</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{training.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{training.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${LEVELS[training.level].color}`}>
                        {LEVELS[training.level].label}
                      </span>
                      <button
                        onClick={() => setViewingTraining(training)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(training)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(training.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {training.duration}h • {formatPrice(training.price)} • {training.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TrainingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTraining(null);
        }}
        onSubmit={editingTraining ? 
          (data) => handleEditTraining(editingTraining.id, data) : 
          handleAddTraining
        }
        training={editingTraining}
      />

      {viewingTraining && (
        <TrainingDetailsModal
          isOpen={!!viewingTraining}
          onClose={() => setViewingTraining(null)}
          training={viewingTraining}
        />
      )}
    </div>
  );
}