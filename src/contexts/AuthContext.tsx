import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('campusJob_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // 실제 구현에서는 API 호출
    const mockUser: User = {
      id: '1',
      name: '김학생',
      email,
      university: '서울대학교',
      major: '컴퓨터공학과',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      createdAt: new Date().toISOString(),
    };
    
    setUser(mockUser);
    localStorage.setItem('campusJob_user', JSON.stringify(mockUser));
    return true;
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    // 실제 구현에서는 API 호출
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      university: userData.university,
      major: userData.major,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('campusJob_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campusJob_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};