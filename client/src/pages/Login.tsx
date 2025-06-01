import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LoginForm } from '@/components/Auth/LoginForm';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const { user, isGuest } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Handle Google OAuth redirect result
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          toast({
            title: 'Success',
            description: 'Successfully signed in with Google!',
          });
        }
      } catch (error: any) {
        console.error('OAuth redirect error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to sign in with Google',
          variant: 'destructive',
        });
      }
    };

    handleRedirectResult();
  }, [toast]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user || isGuest) {
      window.location.href = '/dashboard';
    }
  }, [user, isGuest]);

  if (user || isGuest) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
