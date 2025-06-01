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
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { Category, Template, InsertCategory, InsertTemplate } from '@/types/admin';

// Collection names
export const ADMIN_COLLECTIONS = {
  CATEGORIES: 'categories',
  TEMPLATES: 'templates'
} as const;

// Category operations
export const categoryService = {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    const q = query(
      collection(db, ADMIN_COLLECTIONS.CATEGORIES),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  },

  // Get active categories
  async getActiveCategories(): Promise<Category[]> {
    const q = query(
      collection(db, ADMIN_COLLECTIONS.CATEGORIES),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Category[];
  },

  // Create category
  async createCategory(categoryData: InsertCategory): Promise<string> {
    const docData = {
      ...categoryData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, ADMIN_COLLECTIONS.CATEGORIES), docData);
    return docRef.id;
  },

  // Update category
  async updateCategory(categoryId: string, updates: Partial<InsertCategory>): Promise<void> {
    const categoryRef = doc(db, ADMIN_COLLECTIONS.CATEGORIES, categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Delete category
  async deleteCategory(categoryId: string): Promise<void> {
    const categoryRef = doc(db, ADMIN_COLLECTIONS.CATEGORIES, categoryId);
    await deleteDoc(categoryRef);
  },

  // Get category by ID
  async getCategoryById(categoryId: string): Promise<Category | null> {
    const categoryRef = doc(db, ADMIN_COLLECTIONS.CATEGORIES, categoryId);
    const categorySnap = await getDoc(categoryRef);
    
    if (categorySnap.exists()) {
      return {
        id: categorySnap.id,
        ...categorySnap.data(),
        createdAt: categorySnap.data().createdAt?.toDate() || new Date(),
        updatedAt: categorySnap.data().updatedAt?.toDate() || new Date(),
      } as Category;
    }
    return null;
  }
};

// Template operations
export const templateService = {
  // Get all templates
  async getTemplates(): Promise<Template[]> {
    const q = query(
      collection(db, ADMIN_COLLECTIONS.TEMPLATES),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Template[];
  },

  // Get templates by category
  async getTemplatesByCategory(categoryId: string): Promise<Template[]> {
    const q = query(
      collection(db, ADMIN_COLLECTIONS.TEMPLATES),
      where('categoryId', '==', categoryId),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Template[];
  },

  // Get active templates
  async getActiveTemplates(): Promise<Template[]> {
    const q = query(
      collection(db, ADMIN_COLLECTIONS.TEMPLATES),
      where('isActive', '==', true),
      orderBy('order', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as Template[];
  },

  // Create template
  async createTemplate(templateData: InsertTemplate): Promise<string> {
    const docData = {
      ...templateData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, ADMIN_COLLECTIONS.TEMPLATES), docData);
    return docRef.id;
  },

  // Update template
  async updateTemplate(templateId: string, updates: Partial<InsertTemplate>): Promise<void> {
    const templateRef = doc(db, ADMIN_COLLECTIONS.TEMPLATES, templateId);
    await updateDoc(templateRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Delete template
  async deleteTemplate(templateId: string): Promise<void> {
    const templateRef = doc(db, ADMIN_COLLECTIONS.TEMPLATES, templateId);
    await deleteDoc(templateRef);
  },

  // Get template by ID
  async getTemplateById(templateId: string): Promise<Template | null> {
    const templateRef = doc(db, ADMIN_COLLECTIONS.TEMPLATES, templateId);
    const templateSnap = await getDoc(templateRef);
    
    if (templateSnap.exists()) {
      return {
        id: templateSnap.id,
        ...templateSnap.data(),
        createdAt: templateSnap.data().createdAt?.toDate() || new Date(),
        updatedAt: templateSnap.data().updatedAt?.toDate() || new Date(),
      } as Template;
    }
    return null;
  }
};

// Initialize default categories
export const initializeDefaultCategories = async (): Promise<void> => {
  try {
    const existingCategories = await categoryService.getCategories();
    
    if (existingCategories.length === 0) {
      const { DEFAULT_CATEGORIES } = await import('@/types/admin');
      
      for (const category of DEFAULT_CATEGORIES) {
        await categoryService.createCategory(category);
      }
      
      console.log('Default categories initialized');
    }
  } catch (error) {
    console.error('Error initializing default categories:', error);
  }
};