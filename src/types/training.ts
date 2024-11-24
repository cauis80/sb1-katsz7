export interface TrainingFile {
  id: string;
  trainingId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: 'presentation' | 'exercise' | 'documentation' | 'other';
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  objectives: string[];
  requiredSpecialties: string[];
  status: 'active' | 'draft' | 'archived';
  thumbnail?: string;
  files: TrainingFile[];
  createdAt: string;
  updatedAt: string;
}