import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { FormData } from '@/types/forms';

// Firestore collection names
export const COLLECTIONS = {
  USERS: 'users',
  SAVED_FORMS: 'savedForms',
  GENERATED_DOCUMENTS: 'generatedDocuments',
  FORM_TEMPLATES: 'formTemplates'
} as const;

// User profile interface for Firestore
export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences: {
    language: string;
    theme: string;
  };
}

// Saved form interface
export interface SavedForm {
  id: string;
  userId: string;
  formId: string;
  formType: string;
  title: string;
  formData: FormData;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Generated document interface
export interface GeneratedDocument {
  id: string;
  userId: string;
  formId: string;
  formType: string;
  title: string;
  generatedAt: Timestamp;
  downloadCount: number;
}

// User operations
export const userService = {
  // Create user profile
  async createUserProfile(userId: string, userData: Partial<UserProfile>) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const profileData = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      preferences: {
        language: 'fr',
        theme: 'light',
        ...userData.preferences
      }
    };
    await updateDoc(userRef, profileData);
    return profileData;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() } as UserProfile;
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<UserProfile>) {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};

// Saved forms operations
export const savedFormsService = {
  // Save a form
  async saveForm(userId: string, formData: Omit<SavedForm, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
    const savedFormData = {
      ...formData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.SAVED_FORMS), savedFormData);
    return docRef.id;
  },

  // Get user's saved forms
  async getUserSavedForms(userId: string): Promise<SavedForm[]> {
    const q = query(
      collection(db, COLLECTIONS.SAVED_FORMS),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SavedForm[];
  },

  // Update saved form
  async updateSavedForm(formId: string, updates: Partial<SavedForm>) {
    const formRef = doc(db, COLLECTIONS.SAVED_FORMS, formId);
    await updateDoc(formRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  // Delete saved form
  async deleteSavedForm(formId: string) {
    const formRef = doc(db, COLLECTIONS.SAVED_FORMS, formId);
    await deleteDoc(formRef);
  }
};

// Generated documents operations
export const documentsService = {
  // Record document generation
  async recordGeneration(userId: string, documentData: Omit<GeneratedDocument, 'id' | 'userId' | 'generatedAt' | 'downloadCount'>) {
    const generatedDocData = {
      ...documentData,
      userId,
      generatedAt: serverTimestamp(),
      downloadCount: 1
    };
    
    const docRef = await addDoc(collection(db, COLLECTIONS.GENERATED_DOCUMENTS), generatedDocData);
    return docRef.id;
  },

  // Get user's generated documents
  async getUserGeneratedDocuments(userId: string): Promise<GeneratedDocument[]> {
    const q = query(
      collection(db, COLLECTIONS.GENERATED_DOCUMENTS),
      where('userId', '==', userId),
      orderBy('generatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GeneratedDocument[];
  },

  // Increment download count
  async incrementDownloadCount(documentId: string) {
    const docRef = doc(db, COLLECTIONS.GENERATED_DOCUMENTS, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const currentCount = docSnap.data().downloadCount || 0;
      await updateDoc(docRef, {
        downloadCount: currentCount + 1
      });
    }
  }
};

// Statistics operations
export const statsService = {
  // Get user statistics
  async getUserStats(userId: string) {
    const [savedForms, generatedDocs] = await Promise.all([
      savedFormsService.getUserSavedForms(userId),
      documentsService.getUserGeneratedDocuments(userId)
    ]);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    
    const thisMonthDocs = generatedDocs.filter(doc => 
      doc.generatedAt.toDate() >= thisMonth
    );

    return {
      savedFormsCount: savedForms.length,
      generatedDocsCount: generatedDocs.length,
      thisMonthCount: thisMonthDocs.length,
      totalDownloads: generatedDocs.reduce((sum, doc) => sum + doc.downloadCount, 0)
    };
  }
};