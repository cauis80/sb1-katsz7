import React, { useState } from 'react';
import { Plus, Search, Pencil, Trash2, FolderPlus } from 'lucide-react';
import { useSpecialtiesStore } from '../../lib/store';
import SpecialtyGroupModal from '../../components/settings/SpecialtyGroupModal';
import SpecialtyModal from '../../components/settings/SpecialtyModal';

export default function SpecialtiesPage() {
  const { groups, specialties, deleteGroup, deleteSpecialty } = useSpecialtiesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingSpecialty, setEditingSpecialty] = useState<string | null>(null);

  const filteredSpecialties = specialties.filter((specialty) => {
    const matchesSearch = specialty.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesGroup = !selectedGroup || specialty.groupId === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleDeleteGroup = (groupId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce groupe ? Toutes les spécialités associées seront également supprimées.')) {
      deleteGroup(groupId);
    }
  };

  const handleDeleteSpecialty = (specialtyId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette spécialité ?')) {
      deleteSpecialty(specialtyId);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          Gestion des spécialités
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setEditingGroup(null);
              setIsGroupModalOpen(true);
            }}
            className="btn btn-secondary px-4 py-2 flex items-center gap-2"
          >
            <FolderPlus className="w-4 h-4" />
            Nouveau groupe
          </button>
          <button
            onClick={() => {
              setEditingSpecialty(null);
              setIsSpecialtyModalOpen(true);
            }}
            className="btn btn-primary px-4 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nouvelle spécialité
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Rechercher une spécialité..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="input"
        >
          <option value="">Tous les groupes</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {groups.map((group) => {
          const groupSpecialties = filteredSpecialties.filter(
            (s) => s.groupId === group.id
          );

          if (selectedGroup && selectedGroup !== group.id) return null;

          return (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-sm text-gray-500 mt-1">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingGroup(group.id);
                        setIsGroupModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {groupSpecialties.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Aucune spécialité dans ce groupe
                  </p>
                ) : (
                  <div className="space-y-2">
                    {groupSpecialties.map((specialty) => (
                      <div
                        key={specialty.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {specialty.name}
                          </h4>
                          {specialty.description && (
                            <p className="text-xs text-gray-500">
                              {specialty.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingSpecialty(specialty.id);
                              setIsSpecialtyModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteSpecialty(specialty.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <SpecialtyGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroup(null);
        }}
        groupId={editingGroup}
      />

      <SpecialtyModal
        isOpen={isSpecialtyModalOpen}
        onClose={() => {
          setIsSpecialtyModalOpen(false);
          setEditingSpecialty(null);
        }}
        specialtyId={editingSpecialty}
      />
    </div>
  );
}