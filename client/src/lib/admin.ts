import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Admin authentication
export const adminAuth = {
  isAuthenticated: () => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  },
  
  authenticate: (email: string, password: string) => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  },
  
  logout: () => {
    localStorage.removeItem('adminAuthenticated');
  }
};

// Categories interface
export interface Category {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  order: number;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

// Template interface
export interface Template {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  categoryId: string;
  slug: string;
  schema: any;
  previewLayout: any;
  estimatedTime: string;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

// Categories service
export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  async getActiveCategories(): Promise<Category[]> {
    const q = query(
      collection(db, 'categories'), 
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const categoryData = {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return docRef.id;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async deleteCategory(id: string): Promise<void> {
    const categoryRef = doc(db, 'categories', id);
    await deleteDoc(categoryRef);
  }
};

// Templates service
export const templatesService = {
  async getTemplates(): Promise<Template[]> {
    const q = query(collection(db, 'templates'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Template[];
  },

  async getTemplatesByCategory(categoryId: string): Promise<Template[]> {
    const q = query(
      collection(db, 'templates'),
      where('categoryId', '==', categoryId),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Template[];
  },

  async getActiveTemplates(): Promise<Template[]> {
    const q = query(
      collection(db, 'templates'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Template[];
  },

  async getTemplateBySlug(slug: string): Promise<Template | null> {
    const q = query(
      collection(db, 'templates'),
      where('slug', '==', slug),
      where('isActive', '==', true)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Template;
  },

  async createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const templateData = {
      ...template,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'templates'), templateData);
    return docRef.id;
  },

  async updateTemplate(id: string, updates: Partial<Template>): Promise<void> {
    const templateRef = doc(db, 'templates', id);
    await updateDoc(templateRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async deleteTemplate(id: string): Promise<void> {
    const templateRef = doc(db, 'templates', id);
    await deleteDoc(templateRef);
  }
};

// Default categories to seed the database
export const defaultCategories: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Travail / Emploi',
    nameAr: 'العمل / التوظيف',
    description: 'Documents related to work and employment',
    descriptionAr: 'الوثائق المتعلقة بالعمل والتوظيف',
    order: 1,
    isActive: true
  },
  {
    name: 'Éducation',
    nameAr: 'التعليم',
    description: 'Educational documents and certificates',
    descriptionAr: 'الوثائق التعليمية والشهادات',
    order: 2,
    isActive: true
  },
  {
    name: 'Finance / Paiement',
    nameAr: 'المالية / الدفع',
    description: 'Financial documents and payment forms',
    descriptionAr: 'الوثائق المالية ونماذج الدفع',
    order: 3,
    isActive: true
  },
  {
    name: 'Logement',
    nameAr: 'السكن',
    description: 'Housing and residence documents',
    descriptionAr: 'وثائق السكن والإقامة',
    order: 4,
    isActive: true
  },
  {
    name: 'Famille / État civil',
    nameAr: 'الأسرة / الحالة المدنية',
    description: 'Family and civil status documents',
    descriptionAr: 'وثائق الأسرة والحالة المدنية',
    order: 5,
    isActive: true
  },
  {
    name: 'Justice / Légalisation',
    nameAr: 'العدالة / التصديق',
    description: 'Legal and certification documents',
    descriptionAr: 'الوثائق القانونية والتصديق',
    order: 6,
    isActive: true
  },
  {
    name: 'Transport / Déplacement',
    nameAr: 'النقل / التنقل',
    description: 'Transportation and travel documents',
    descriptionAr: 'وثائق النقل والسفر',
    order: 7,
    isActive: true
  },
  {
    name: 'Santé',
    nameAr: 'الصحة',
    description: 'Health and medical documents',
    descriptionAr: 'الوثائق الصحية والطبية',
    order: 8,
    isActive: true
  },
  {
    name: 'Autres',
    nameAr: 'أخرى',
    description: 'Other miscellaneous documents',
    descriptionAr: 'وثائق متنوعة أخرى',
    order: 9,
    isActive: true
  }
];