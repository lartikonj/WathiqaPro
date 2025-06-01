import { useState, useEffect } from 'react';

interface AdminCredentials {
  email: string;
  password: string;
}

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminSession = sessionStorage.getItem('admin_session');
    if (adminSession === 'authenticated') {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const authenticate = async (credentials: AdminCredentials): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        setIsAdmin(true);
        sessionStorage.setItem('admin_session', 'authenticated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin authentication error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_session');
  };

  return {
    isAdmin,
    loading,
    authenticate,
    logout,
  };
}