import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/token';

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  addCredits: (amount: number) => void;
  spendCredits: (amount: number) => boolean;
  buyToken: (tokenId: number, quantity: number, price: number) => boolean;
  addScore: (amount: number) => void;
  exchangeScore: (scoreAmount: number) => Promise<boolean>;
  getAllUsers: () => User[];
  updateUser: (updatedUser: User) => void;
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

  // Load all users from localStorage
  const getAllUsers = (): User[] => {
    const allUsers = localStorage.getItem('tokenstein_all_users');
    return allUsers ? JSON.parse(allUsers) : [];
  };

  // Save all users to localStorage
  const saveAllUsers = (users: User[]) => {
    localStorage.setItem('tokenstein_all_users', JSON.stringify(users));
  };

  // Update a specific user in the global users list
  const updateUser = (updatedUser: User) => {
    const allUsers = getAllUsers();
    const userIndex = allUsers.findIndex(u => u.id === updatedUser.id);
    
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
    } else {
      allUsers.push(updatedUser);
    }
    
    saveAllUsers(allUsers);
    
    // Update current user if it's the same
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
    }
  };

  const addCredits = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, credits: user.credits + amount };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const spendCredits = (amount: number): boolean => {
    if (user && user.credits >= amount) {
      const updatedUser = { ...user, credits: user.credits - amount };
      setUser(updatedUser);
      updateUser(updatedUser);
      return true;
    }
    return false;
  };

  const addScore = (amount: number) => {
    if (user) {
      const updatedUser = { ...user, score: (user.score || 0) + amount };
      setUser(updatedUser);
      updateUser(updatedUser);
    }
  };

  const exchangeScore = async (scoreAmount: number): Promise<boolean> => {
    if (!user || (user.score || 0) < scoreAmount) {
      return false;
    }

    if (!user.pixKey) {
      console.error('Usuário não possui chave PIX cadastrada');
      return false;
    }

    try {
      // Criar solicitação de pagamento
      const paymentRequest = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        pixKey: user.pixKey,
        amount: scoreAmount * 0.5, // 50 centavos por ponto
        scoreAmount: scoreAmount,
        timestamp: new Date().toISOString(),
        status: 'pending' as const
      };

      // Salvar solicitação
      const existingRequests = JSON.parse(localStorage.getItem('tokenstein_payment_requests') || '[]');
      existingRequests.push(paymentRequest);
      localStorage.setItem('tokenstein_payment_requests', JSON.stringify(existingRequests));

      // Remover os pontos do usuário
      const updatedUser = { 
        ...user, 
        score: (user.score || 0) - scoreAmount
      };
      setUser(updatedUser);
      updateUser(updatedUser);
      
      console.log(`Solicitação de pagamento criada: R$ ${(scoreAmount * 0.5).toFixed(2)} para ${user.pixKey}`);
      return true;
    } catch (error) {
      console.error('Erro ao processar solicitação:', error);
      return false;
    }
  };

  const buyToken = (tokenId: number, quantity: number, price: number): boolean => {
    if (!user) return false;
    
    // Add token to user's inventory
    const existingToken = user.tokens.find(t => t.tokenId === tokenId);
    if (existingToken) {
      existingToken.quantity += quantity;
    } else {
      user.tokens.push({ tokenId, quantity });
    }
    
    // Add score (25% bonus)
    const scoreGained = Math.floor(price * 1.25);
    const updatedUser = { 
      ...user, 
      score: (user.score || 0) + scoreGained,
      tokens: [...user.tokens]
    };
    setUser(updatedUser);
    updateUser(updatedUser);

    // Check for token stealing mechanic
    const allUsers = getAllUsers();
    const usersWithToken = allUsers.filter(u => 
      u.id !== user.id && 
      u.tokens.some(t => t.tokenId === tokenId && t.quantity > 0)
    );

    if (usersWithToken.length > 0) {
      // Random selection for stealing
      const randomUser = usersWithToken[Math.floor(Math.random() * usersWithToken.length)];
      const tokenToSteal = randomUser.tokens.find(t => t.tokenId === tokenId);
      
      if (tokenToSteal && tokenToSteal.quantity > 0) {
        // Remove one token from random user
        tokenToSteal.quantity -= 1;
        if (tokenToSteal.quantity === 0) {
          randomUser.tokens = randomUser.tokens.filter(t => t.tokenId !== tokenId);
        }
        
        // Give them score as compensation
        const compensationScore = price;
        randomUser.score = (randomUser.score || 0) + compensationScore;
        
        updateUser(randomUser);
        
        // Notify about the stealing (this would be shown via toast in real implementation)
        console.log(`User ${randomUser.name} lost 1 token and gained ${compensationScore} score points!`);
      }
    }
    
    return true;
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      addCredits,
      spendCredits,
      buyToken,
      addScore,
      exchangeScore,
      getAllUsers,
      updateUser
    }}>
      {children}
    </UserContext.Provider>
  );
};