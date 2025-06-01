import { FormField } from './forms';

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  categoryId: string;
  fields: FormField[];
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertCategory {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  isActive: boolean;
}

export interface InsertTemplate {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  categoryId: string;
  fields: FormField[];
  isActive: boolean;
  order: number;
}

export const DEFAULT_CATEGORIES: InsertCategory[] = [
  {
    name: 'Travail / Emploi',
    nameAr: 'العمل / التوظيف',
    description: 'Documents liés au travail et à l\'emploi',
    descriptionAr: 'الوثائق المتعلقة بالعمل والتوظيف',
    order: 1,
    isActive: true,
  },
  {
    name: 'Éducation',
    nameAr: 'التعليم',
    description: 'Documents scolaires et universitaires',
    descriptionAr: 'الوثائق المدرسية والجامعية',
    order: 2,
    isActive: true,
  },
  {
    name: 'Finance / Paiement',
    nameAr: 'المالية / الدفع',
    description: 'Documents financiers et de paiement',
    descriptionAr: 'الوثائق المالية والدفع',
    order: 3,
    isActive: true,
  },
  {
    name: 'Logement',
    nameAr: 'السكن',
    description: 'Documents de logement et résidence',
    descriptionAr: 'وثائق السكن والإقامة',
    order: 4,
    isActive: true,
  },
  {
    name: 'Famille / État civil',
    nameAr: 'الأسرة / الحالة المدنية',
    description: 'Documents d\'état civil et familiaux',
    descriptionAr: 'وثائق الحالة المدنية والأسرة',
    order: 5,
    isActive: true,
  },
  {
    name: 'Justice / Légalisation',
    nameAr: 'العدالة / التوثيق',
    description: 'Documents juridiques et légalisations',
    descriptionAr: 'الوثائق القانونية والتوثيق',
    order: 6,
    isActive: true,
  },
  {
    name: 'Transport / Déplacement',
    nameAr: 'النقل / التنقل',
    description: 'Documents de transport et déplacement',
    descriptionAr: 'وثائق النقل والتنقل',
    order: 7,
    isActive: true,
  },
  {
    name: 'Santé',
    nameAr: 'الصحة',
    description: 'Documents médicaux et de santé',
    descriptionAr: 'الوثائق الطبية والصحية',
    order: 8,
    isActive: true,
  },
  {
    name: 'Autres',
    nameAr: 'أخرى',
    description: 'Autres documents administratifs',
    descriptionAr: 'وثائق إدارية أخرى',
    order: 9,
    isActive: true,
  },
];