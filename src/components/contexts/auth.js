'use client';
import { createClient } from '@/utils/supabase/client';
import { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserFromLocalStorage() {
      const token = localStorage.getItem('token');
      if (token === undefined || token === 'undefined') {
        logout();
      }
      if (token && !user) {
        const {
          data: { user },
        } = await supabase.auth.getUser(token);

        if (user) setUser(user);
        if (!user) logout()
      }
      setLoading(false);
    }
    loadUserFromLocalStorage();
  }, []);

  const persistUserAndToken = (user) => {
    if (user) {
      localStorage.setItem('token', user.session.access_token);
      setUser(user);
    }
  };

  const getTokenFromStorage = () => {
    return localStorage.getItem('token');
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    await supabase.auth.signOut();
    window.location.pathname = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        persistUserAndToken,
        loading,
        logout,
        getTokenFromStorage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
