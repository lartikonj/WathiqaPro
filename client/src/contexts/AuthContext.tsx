import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { userService, UserProfile } from '@/lib/firestore';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  isGuest: boolean;
  setAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Try to get existing user profile from Firestore
          let userProfile = await userService.getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            // Create new user profile in Firestore
            const newUserData = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              preferences: {
                language: 'fr',
                theme: 'light'
              }
            };
            
            // Create the document with the user's UID as the document ID
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...newUserData,
              createdAt: new Date(),
              updatedAt: new Date()
            });
            
            userProfile = newUserData as UserProfile;
          }
          
          setUserData(userProfile);
        } catch (error) {
          console.error('Error managing user data:', error);
        }
        setIsGuest(false);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setIsGuest(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const setAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setUserData(null);
  };

  const value = {
    user,
    userData,
    loading,
    logout,
    isGuest,
    setAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
