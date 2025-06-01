import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterForm } from '@/components/Auth/RegisterForm';

export default function Register() {
  const { user, isGuest } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user || isGuest) {
      window.location.href = '/';
    }
  }, [user, isGuest]);

  if (user || isGuest) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <RegisterForm onSwitchToLogin={() => window.location.href = '/login'} />
      </div>
    </div>
  );
}
