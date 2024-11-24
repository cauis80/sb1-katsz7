export interface SpecialtyGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Specialty {
  id: string;
  name: string;
  groupId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}