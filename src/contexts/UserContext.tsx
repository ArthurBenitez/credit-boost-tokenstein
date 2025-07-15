import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/token';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  buyToken: (tokenId: number, quantity: number) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tokenstein_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('tokenstein_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tokenstein_user');
    }
  }, [user]);

  const addCredits = (amount: number) => {
    if (user) {
      setUser({ ...user, credits: user.credits + amount });
    }
  };

  const spendCredits = (amount: number): boolean => {
    if (user && user.credits >= amount) {
      setUser({ ...user, credits: user.credits - amount });
      return true;
    }
    return false;
  };

  const buyToken = (tokenId: number, quantity: number): boolean => {
    if (!user) return false;
    
    const existingToken = user.tokens.find(t => t.tokenId === tokenId);
    if (existingToken) {
      existingToken.quantity += quantity;
    } else {
      user.tokens.push({ tokenId, quantity });
    }
    
    setUser({ ...user });
    return true;
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      addCredits,
      spendCredits,
      buyToken
    }}>
      {children}
    </UserContext.Provider>
  );
};