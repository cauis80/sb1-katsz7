import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, File, FileText, FileImage, FilePlus } from 'lucide-react';
import { useSpecialtiesStore } from '../../lib/store';
import type { Training, TrainingFile } from '../../types';

const trainingSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  duration: z.number().min(1, 'La durée doit être supérieure à 0'),
  price: z.number().min(0, 'Le prix ne peut pas être négatif'),
  category: z.string().min(1, 'La catégorie est requise'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  objectives: z.array(z.string()).min(1, 'Au moins un objectif est requis'),
  requiredSpecialties: z.array(z.string()).min(1, 'Au moins une spécialité est requise'),
  status: z.enum(['active', 'draft', 'archived']),
  thumbnail: z.string().optional(),
  files: z.array(z.object({
    id: z.string(),
    trainingId: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string(),
    category: z.enum(['presentation', 'exercise', 'documentation', 'other']),
    uploadedBy: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })).optional(),
});

type TrainingForm = z.infer<typeof trainingSchema>;

interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingForm) => void;
  training?: Training | null;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export default function TrainingModal({
  isOpen,
  onClose,
  onSubmit,
  training,
}: TrainingModalProps) {
  const { groups, specialties } = useSpecialtiesStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TrainingForm>({
    resolver: zodResolver(trainingSchema),
    defaultValues: {
      status: 'draft',
      objectives: [''],
      requiredSpecialties: [],
      files: [],
    },
  });

  useEffect(() => {
    if (training) {
      reset({
        ...training,
        files: training.files || [],
      });
    } else {
      reset({
        status: 'draft',
        objectives: [''],
        requiredSpecialties: [],
        files: [],
      });
    }
  }, [training, reset]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue('thumbnail', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: TrainingFile['category']) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: TrainingFile[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      trainingId: training?.id || '',
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      category,
      uploadedBy: '1', // Current user ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const currentFiles = watch('files') || [];
    setValue('files', [...currentFiles, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    const currentFiles = watch('files') || [];
    setValue('files', currentFiles.filter(f => f.id !== fileId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {training ? 'Modifier la formation' : 'Nouvelle formation'}
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                {...register('title')}
                className="input mt-1"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="input mt-1"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Durée (heures)
                </label>
                <input
                  type="number"
                  {...register('duration', { valueAsNumber: true })}
                  className="input mt-1"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Prix
                </label>
                <input
                  type="number"
                  {...register('price', { valueAsNumber: true })}
                  className="input mt-1"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Catégorie
                </label>
                <input
                  type="text"
                  {...register('category')}
                  className="input mt-1"
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Niveau
              </label>
              <select {...register('level')} className="input mt-1">
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="advanced">Avancé</option>
              </select>
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Objectifs
              </label>
              <div className="space-y-2">
                {watch('objectives')?.map((_, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      {...register(`objectives.${index}`)}
                      className="input flex-1"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const objectives = watch('objectives');
                          setValue(
                            'objectives',
                            objectives.filter((_, i) => i !== index)
                          );
                        }}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  const objectives = watch('objectives');
                  setValue('objectives', [...objectives, '']);
                }}
                className="mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                + Ajouter un objectif
              </button>
              {errors.objectives && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.objectives.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Spécialités requises
              </label>
              <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                {groups.map((group) => {
                  const groupSpecialties = specialties.filter(
                    (s) => s.groupId === group.id
                  );
                  return (
                    <div key={group.id} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {group.name}
                      </h4>
                      {groupSpecialties.map((specialty) => (
                        <label
                          key={specialty.id}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            value={specialty.id}
                            {...register('requiredSpecialties')}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-600">
                            {specialty.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  );
                })}
              </div>
              {errors.requiredSpecialties && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.requiredSpecialties.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image de couverture
              </label>
              <div className="mt-1 flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="btn btn-secondary px-4 py-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Télécharger une image
                </label>
                {watch('thumbnail') && (
                  <img
                    src={watch('thumbnail')}
                    alt="Aperçu"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Fichiers de formation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Présentation
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.ppt,.pptx"
                    onChange={(e) => handleFileUpload(e, 'presentation')}
                    className="hidden"
                    id="presentation-upload"
                    multiple
                  />
                  <label
                    htmlFor="presentation-upload"
                    className="btn btn-secondary px-4 py-2 cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Ajouter des présentations
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercices
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip,.rar"
                    onChange={(e) => handleFileUpload(e, 'exercise')}
                    className="hidden"
                    id="exercise-upload"
                    multiple
                  />
                  <label
                    htmlFor="exercise-upload"
                    className="btn btn-secondary px-4 py-2 cursor-pointer flex items-center gap-2"
                  >
                    <File className="w-4 h-4" />
                    Ajouter des exercices
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documentation
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'documentation')}
                    className="hidden"
                    id="documentation-upload"
                    multiple
                  />
                  <label
                    htmlFor="documentation-upload"
                    className="btn btn-secondary px-4 py-2 cursor-pointer flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Ajouter de la documentation
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autres fichiers
                  </label>
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, 'other')}
                    className="hidden"
                    id="other-upload"
                    multiple
                  />
                  <label
                    htmlFor="other-upload"
                    className="btn btn-secondary px-4 py-2 cursor-pointer flex items-center gap-2"
                  >
                    <FilePlus className="w-4 h-4" />
                    Ajouter d'autres fichiers
                  </label>
                </div>
              </div>

              {/* File List */}
              {watch('files')?.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Fichiers ajoutés</h4>
                  <div className="space-y-2">
                    {watch('files').map((file) => (
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
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)} • {file.category}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select {...register('status')} className="input mt-1">
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
                <option value="archived">Archivé</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary px-4 py-2"
              >
                Annuler
              </button>
              <button type="submit" className="btn btn-primary px-4 py-2">
                {training ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}