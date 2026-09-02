import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../services/mockData';

export interface RegisteredAccount {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export interface SessionData {
  username: string;
  role: UserRole;
  isAuthenticated: boolean;
  user: User;
}

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  isAuthenticated: boolean;
  login: (usernameOrEmail: string, password: string, rememberMe?: boolean) => { success: boolean; role?: UserRole; error?: string };
  signup: (data: { fullName: string; username: string; email: string; phone: string; password: string; role: UserRole }) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  getDashboardPath: (role?: UserRole | null) => string;
  allDemoUsers: User[];
}

// Built-in Demo Credentials
export const DEMO_CREDENTIALS: Record<string, { role: UserRole; userIndex: number; defaultPass: string }> = {
  patient: { role: 'PATIENT', userIndex: 0, defaultPass: 'patient123' },
  'patient@lifelink.demo': { role: 'PATIENT', userIndex: 0, defaultPass: 'patient123' },
  hospital: { role: 'HOSPITAL_ADMIN', userIndex: 1, defaultPass: 'hospital123' },
  'hospital@lifelink.demo': { role: 'HOSPITAL_ADMIN', userIndex: 1, defaultPass: 'hospital123' },
  ambulance: { role: 'AMBULANCE_DRIVER', userIndex: 4, defaultPass: 'ambulance123' },
  'ambulance@lifelink.demo': { role: 'AMBULANCE_DRIVER', userIndex: 4, defaultPass: 'ambulance123' },
  'driver@lifelink.demo': { role: 'AMBULANCE_DRIVER', userIndex: 4, defaultPass: 'ambulance123' },
  admin: { role: 'SUPER_ADMIN', userIndex: 5, defaultPass: 'admin123' },
  'admin@lifelink.demo': { role: 'SUPER_ADMIN', userIndex: 5, defaultPass: 'admin123' },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('lifelink_auth_session');
    if (saved) {
      try {
        const parsed: SessionData = JSON.parse(saved);
        if (parsed.isAuthenticated && parsed.user) {
          return parsed.user;
        }
      } catch {
        // Fallback
      }
    }
    return DEMO_USERS[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('lifelink_auth_session');
    if (saved) {
      try {
        const parsed: SessionData = JSON.parse(saved);
        return Boolean(parsed.isAuthenticated);
      } catch {
        return false;
      }
    }
    return false;
  });

  const currentRole = currentUser.role;

  // Persist session changes
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const sessionData: SessionData = {
        username: currentUser.email.split('@')[0],
        role: currentUser.role,
        isAuthenticated: true,
        user: currentUser
      };
      localStorage.setItem('lifelink_auth_session', JSON.stringify(sessionData));
    } else {
      localStorage.removeItem('lifelink_auth_session');
    }
  }, [isAuthenticated, currentUser]);

  const getDashboardPath = (role?: UserRole | null): string => {
    const targetRole = role || currentRole;
    switch (targetRole) {
      case 'PATIENT':
        return '/user';
      case 'HOSPITAL_ADMIN':
      case 'DOCTOR':
      case 'NURSE':
        return '/hospital';
      case 'AMBULANCE_DRIVER':
        return '/ambulance';
      case 'SUPER_ADMIN':
        return '/admin';
      default:
        return '/login';
    }
  };

  const login = (usernameOrEmail: string, password: string, rememberMe = true): { success: boolean; role?: UserRole; error?: string } => {
    const cleanKey = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanKey) {
      return { success: false, error: 'Please enter your username or email' };
    }
    if (!cleanPass) {
      return { success: false, error: 'Please enter your password' };
    }

    // 1. Check Demo Accounts
    if (DEMO_CREDENTIALS[cleanKey]) {
      const demoConfig = DEMO_CREDENTIALS[cleanKey];
      if (cleanPass === demoConfig.defaultPass || cleanPass === 'password' || cleanPass === 'demo123') {
        const userObj = DEMO_USERS[demoConfig.userIndex] || DEMO_USERS[0];
        setCurrentUser(userObj);
        setIsAuthenticated(true);
        return { success: true, role: demoConfig.role };
      }
      return { success: false, error: `Invalid password for demo account '${cleanKey}'. (Default: ${demoConfig.defaultPass})` };
    }

    // 2. Check Custom Registered Accounts in localStorage
    const rawRegistered = localStorage.getItem('lifelink_registered_users');
    let registeredUsers: RegisteredAccount[] = [];
    if (rawRegistered) {
      try {
        registeredUsers = JSON.parse(rawRegistered);
      } catch {
        registeredUsers = [];
      }
    }

    const matchedAccount = registeredUsers.find(
      u => u.username.toLowerCase() === cleanKey || u.email.toLowerCase() === cleanKey
    );

    if (matchedAccount) {
      if (matchedAccount.password === cleanPass) {
        const userObj: User = {
          id: `usr-${Date.now()}`,
          name: matchedAccount.fullName,
          email: matchedAccount.email,
          role: matchedAccount.role,
          phone: matchedAccount.phone,
          bloodGroup: 'O+',
          isActive: true
        };
        setCurrentUser(userObj);
        setIsAuthenticated(true);
        return { success: true, role: matchedAccount.role };
      }
      return { success: false, error: 'Incorrect password. Please try again.' };
    }

    // 3. Fallback for quick generic demo login
    if (cleanKey.includes('admin')) {
      const userObj = DEMO_USERS[5]; // Admin
      setCurrentUser(userObj);
      setIsAuthenticated(true);
      return { success: true, role: 'SUPER_ADMIN' };
    }
    if (cleanKey.includes('hosp') || cleanKey.includes('doctor')) {
      const userObj = DEMO_USERS[1]; // Hospital
      setCurrentUser(userObj);
      setIsAuthenticated(true);
      return { success: true, role: 'HOSPITAL_ADMIN' };
    }
    if (cleanKey.includes('amb') || cleanKey.includes('driver')) {
      const userObj = DEMO_USERS[4]; // Ambulance
      setCurrentUser(userObj);
      setIsAuthenticated(true);
      return { success: true, role: 'AMBULANCE_DRIVER' };
    }

    return { 
      success: false, 
      error: 'Account not found. Please use a demo account below (e.g., "patient", "hospital", "ambulance", "admin") or Sign Up.' 
    };
  };

  const signup = (data: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
  }): { success: boolean; error?: string } => {
    if (!data.fullName.trim() || !data.username.trim() || !data.email.trim() || !data.password) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    const cleanUsername = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    // Check if exists in demo or registered
    if (DEMO_CREDENTIALS[cleanUsername] || DEMO_CREDENTIALS[cleanEmail]) {
      return { success: false, error: 'This username/email is reserved for a demo account.' };
    }

    const rawRegistered = localStorage.getItem('lifelink_registered_users');
    let registeredUsers: RegisteredAccount[] = [];
    if (rawRegistered) {
      try {
        registeredUsers = JSON.parse(rawRegistered);
      } catch {
        registeredUsers = [];
      }
    }

    if (registeredUsers.some(u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this username or email already exists.' };
    }

    const newAccount: RegisteredAccount = {
      fullName: data.fullName.trim(),
      username: cleanUsername,
      email: cleanEmail,
      phone: data.phone.trim() || '+91 98000 00000',
      password: data.password,
      role: data.role,
      createdAt: new Date().toISOString()
    };

    registeredUsers.push(newAccount);
    localStorage.setItem('lifelink_registered_users', JSON.stringify(registeredUsers));

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('lifelink_auth_session');
    setCurrentUser(DEMO_USERS[0]);
    setIsAuthenticated(false);
  };

  const switchRole = (role: UserRole) => {
    const match = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser(match);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        login,
        signup,
        logout,
        switchRole,
        getDashboardPath,
        allDemoUsers: DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
