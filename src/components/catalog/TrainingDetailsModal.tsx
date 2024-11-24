import React from 'react';
import { X, Clock, Tag, BarChart3, Target, File, FileText, FileImage, Download } from 'lucide-react';
import { useSpecialtiesStore } from '../../lib/store';
import type { Training } from '../../types';

const LEVELS = {
  beginner: { label: 'Débutant', color: 'bg-green-50 text-green-700' },
  intermediate: { label: 'Intermédiaire', color: 'bg-blue-50 text-blue-700' },
  advanced: { label: 'Avancé', color: 'bg-purple-50 text-purple-700' },
};

interface TrainingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: Training;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function TrainingDetailsModal({
  isOpen,
  onClose,
  training,
}: TrainingDetailsModalProps) {
  const { specialties } = useSpecialtiesStore();
  
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {training.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{training.category}</p>
            </div>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {training.thumbnail && (
            <div className="mt-6">
              <img
                src={training.thumbnail}
                alt={training.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Durée</p>
                  <p className="text-sm text-gray-600">{training.duration}h</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Prix</p>
                  <p className="text-sm text-gray-600">{formatPrice(training.price)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Niveau</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      LEVELS[training.level].color
                    }`}
                  >
                    {LEVELS[training.level].label}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-gray-400" />
                Objectifs
              </h3>
              <ul className="space-y-2">
                {training.objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {objective}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
            <p className="text-sm text-gray-600">{training.description}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Spécialités requises</h3>
            <div className="flex flex-wrap gap-2">
              {training.requiredSpecialties.map((specialtyId) => {
                const specialty = specialties.find((s) => s.id === specialtyId);
                if (!specialty) return null;
                return (
                  <span
                    key={specialtyId}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                  >
                    {specialty.name}
                  </span>
                );
              })}
            </div>
          </div>

          {training.files?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Fichiers disponibles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['presentation', 'exercise', 'documentation', 'other'].map((category) => {
                  const categoryFiles = training.files.filter(
                    (f) => f.category === category
                  );
                  if (categoryFiles.length === 0) return null;

                  return (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 capitalize">
                        {category === 'presentation'
                          ? 'Présentations'
                          : category === 'exercise'
                          ? 'Exercices'
                          : category === 'documentation'
                          ? 'Documentation'
                          : 'Autres fichiers'}
                      </h4>
                      <div className="space-y-2">
                        {categoryFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {file.type.includes('image') ? (
                                <FileImage className="w-5 h-5 text-blue-500" />
                              ) : file.type.includes('pdf') ? (
                                <FileText className="w-5 h-5 text-red-500" />
                              ) : (
                                <File className="w-5 h-5 text-gray-500" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {file.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <a
                              href={file.url}
                              download={file.name}
                              className="p-1 text-gray-400 hover:text-primary-500"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}