import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, X } from 'lucide-react';

const evaluationSchema = z.object({
  overallSatisfaction: z.number().min(1).max(5),
  contentQuality: z.number().min(1).max(5),
  trainerExpertise: z.number().min(1).max(5),
  trainingMaterials: z.number().min(1).max(5),
  practicalExercises: z.number().min(1).max(5),
  pace: z.number().min(1).max(5),
  organization: z.number().min(1).max(5),
  facilities: z.number().min(1).max(5),
  expectations: z.number().min(1).max(5),
  objectives: z.object({
    clarity: z.number().min(1).max(5),
    achievement: z.number().min(1).max(5),
  }),
  strengths: z.string().min(1, "Veuillez indiquer les points forts"),
  improvements: z.string().min(1, "Veuillez indiquer les points à améliorer"),
  comments: z.string().optional(),
  recommendationScore: z.number().min(0).max(10),
});

type EvaluationForm = z.infer<typeof evaluationSchema>;

interface EvaluationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvaluationForm) => void;
  sessionId: string;
}

const RatingStars = ({ value, onChange, disabled = false }: { 
  value: number; 
  onChange: (value: number) => void;
  disabled?: boolean;
}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          disabled={disabled}
          className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
            disabled ? 'cursor-default' : 'cursor-pointer'
          }`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function EvaluationForm({
  isOpen,
  onClose,
  onSubmit,
  sessionId,
}: EvaluationFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EvaluationForm>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      overallSatisfaction: 0,
      contentQuality: 0,
      trainerExpertise: 0,
      trainingMaterials: 0,
      practicalExercises: 0,
      pace: 0,
      organization: 0,
      facilities: 0,
      expectations: 0,
      objectives: {
        clarity: 0,
        achievement: 0,
      },
      recommendationScore: 0,
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Évaluation de la formation</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Satisfaction générale */}
            <div>
              <h3 className="text-lg font-medium mb-4">Satisfaction générale</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Satisfaction globale
                  </label>
                  <Controller
                    name="overallSatisfaction"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.overallSatisfaction && (
                    <p className="mt-1 text-sm text-red-600">
                      Veuillez noter votre satisfaction globale
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualité du contenu
                  </label>
                  <Controller
                    name="contentQuality"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise du formateur
                  </label>
                  <Controller
                    name="trainerExpertise"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Contenu et organisation */}
            <div>
              <h3 className="text-lg font-medium mb-4">Contenu et organisation</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supports de formation
                  </label>
                  <Controller
                    name="trainingMaterials"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercices pratiques
                  </label>
                  <Controller
                    name="practicalExercises"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rythme de la formation
                  </label>
                  <Controller
                    name="pace"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation générale
                  </label>
                  <Controller
                    name="organization"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locaux et équipements
                  </label>
                  <Controller
                    name="facilities"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Objectifs */}
            <div>
              <h3 className="text-lg font-medium mb-4">Objectifs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clarté des objectifs
                  </label>
                  <Controller
                    name="objectives.clarity"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Atteinte des objectifs
                  </label>
                  <Controller
                    name="objectives.achievement"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réponse aux attentes
                  </label>
                  <Controller
                    name="expectations"
                    control={control}
                    render={({ field }) => (
                      <RatingStars
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Commentaires */}
            <div>
              <h3 className="text-lg font-medium mb-4">Commentaires</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points forts de la formation
                  </label>
                  <textarea
                    {...register('strengths')}
                    rows={3}
                    className="input"
                    placeholder="Qu'avez-vous particulièrement apprécié ?"
                  />
                  {errors.strengths && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.strengths.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points à améliorer
                  </label>
                  <textarea
                    {...register('improvements')}
                    rows={3}
                    className="input"
                    placeholder="Quels aspects pourraient être améliorés ?"
                  />
                  {errors.improvements && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.improvements.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commentaires additionnels
                  </label>
                  <textarea
                    {...register('comments')}
                    rows={3}
                    className="input"
                    placeholder="Avez-vous d'autres commentaires ?"
                  />
                </div>
              </div>
            </div>

            {/* Recommandation */}
            <div>
              <h3 className="text-lg font-medium mb-4">Recommandation</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sur une échelle de 0 à 10, recommanderiez-vous cette formation ?
                </label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <Controller
                      key={score}
                      name="recommendationScore"
                      control={control}
                      render={({ field }) => (
                        <button
                          type="button"
                          onClick={() => field.onChange(score)}
                          className={`w-10 h-10 rounded-full font-medium ${
                            field.value === score
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {score}
                        </button>
                      )}
                    />
                  ))}
                </div>
                {errors.recommendationScore && (
                  <p className="mt-1 text-sm text-red-600">
                    Veuillez indiquer votre score de recommandation
                  </p>
                )}
              </div>
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
                Envoyer l'évaluation
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}