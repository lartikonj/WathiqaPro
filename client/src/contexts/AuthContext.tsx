import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@shared/schema';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
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
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from your backend
        try {
          const response = await fetch(`/api/users/profile/${firebaseUser.uid}`, {
            credentials: 'include',
          });
          
          if (response.ok) {
            const userProfile = await response.json();
            setUserData(userProfile);
          } else if (response.status === 404) {
            // User doesn't exist in our database, create them
            const newUserResponse = await fetch('/api/users', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                email: firebaseUser.email,
                username: firebaseUser.email?.split('@')[0] || 'user',
                firebaseUid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
              }),
            });
            
            if (newUserResponse.ok) {
              const newUser = await newUserResponse.json();
              setUserData(newUser);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
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
