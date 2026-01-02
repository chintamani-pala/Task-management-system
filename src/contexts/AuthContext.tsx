import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { api } from '../api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const session = localStorage.getItem('session');
      if (session) {
        try {
          //checking is user session valid
          const { data } = await api.auth.getUser();
          if (data?.user) {
            setUser(data.user);
          } else {
            localStorage.removeItem('session');
          }
        } catch (e) {
          localStorage.removeItem('session');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await api.auth.signUp({ email, password });
    if (error) throw error;
    if (data?.session) {
      localStorage.setItem('session', JSON.stringify(data.session));
      setUser(data.session.user);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await api.auth.signIn({ email, password });
    if (error) throw error;
    if (data?.session) {
      localStorage.setItem('session', JSON.stringify(data.session));
      setUser(data.session.user);
    }
  };

  const signOut = async () => {
    localStorage.removeItem('session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
