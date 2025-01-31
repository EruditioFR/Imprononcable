import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { AuthState, User } from '../types/auth';
import { AuthService } from '../services/auth';
import { userService } from '../services/airtable';
import { AIRTABLE_CONFIG } from '../services/airtable/config';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshAuthorizations: () => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const authService = new AuthService(AIRTABLE_CONFIG.apiKey, AIRTABLE_CONFIG.baseId);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_AUTHORIZATIONS'; payload: string[] };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { user: action.payload, isLoading: false, error: null };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { user: null, isLoading: false, error: null };
    case 'UPDATE_AUTHORIZATIONS':
      return state.user
        ? { ...state, user: { ...state.user, authorizedImageIds: action.payload } }
        : state;
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      userService.refreshUserAuthorizations(user)
        .then(refreshedUser => {
          dispatch({ type: 'LOGIN_SUCCESS', payload: refreshedUser });
        })
        .catch(() => {
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const isAdmin = (): boolean => {
    return state.user?.role === 'Administrateur';
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await authService.login({ email, password });
      const userWithAuthorizations = await userService.refreshUserAuthorizations(user);
      localStorage.setItem('user', JSON.stringify(userWithAuthorizations));
      dispatch({ type: 'LOGIN_SUCCESS', payload: userWithAuthorizations });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error instanceof Error ? error.message : 'Échec de la connexion' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const refreshAuthorizations = async () => {
    if (!state.user) return;
    
    try {
      const authorizedImageIds = await userService.getAuthorizedImageIds(state.user.id);
      dispatch({ type: 'UPDATE_AUTHORIZATIONS', payload: authorizedImageIds });
    } catch (error) {
      console.error('Failed to refresh authorizations:', error);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!state.user) throw new Error('Non authentifié');
    await authService.changePassword(state.user.id, { currentPassword, newPassword, confirmPassword: newPassword });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout, 
      changePassword,
      refreshAuthorizations,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}