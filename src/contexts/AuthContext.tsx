import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemberResponse, AuthContextType, LoginRequest, LoginJoinRequest } from '../types';
import * as api from '../api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const decodeToken = (token: string): MemberResponse | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    return { id: decoded.id, email: decoded.email };
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MemberResponse | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('campusJob_token'));

  useEffect(() => {
    if (token) {
      const decodedUser = decodeToken(token);
      if (decodedUser) {
        setUser(decodedUser);
      }
      localStorage.setItem('campusJob_token', token);
    } else {
      localStorage.removeItem('campusJob_token');
      setUser(null);
    }
  }, [token]);

  const login = async (data: LoginRequest) => {
    const responseToken = await api.login(data);
    if (responseToken) {
      localStorage.setItem('campusJob_token', responseToken);
      setToken(responseToken);
    } else {
      throw new Error('응답 헤더에서 유효한 토큰을 찾을 수 없습니다.');
    }
  };

  const register = async (data: LoginJoinRequest) => {
    await api.createMember(data);
  };

  const logout = () => {
    localStorage.removeItem('campusJob_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
