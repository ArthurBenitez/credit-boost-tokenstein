import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/token';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface UserContextType {
  user: User | null;
  loading: boolean;
  addCredits: (amount: number) => Promise<void>;
  spendCredits: (amount: number) => Promise<boolean>;
  buyToken: (tokenId: number, quantity: number, price: number) => Promise<boolean>;
  addScore: (amount: number) => Promise<void>;
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
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user data from Supabase when auth user changes
  useEffect(() => {
    const loadUserData = async () => {
      if (authUser) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setUser(null);
            setLoading(false);
            return;
          }

          const { data: credits, error: creditsError } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          const { data: scores, error: scoresError } = await supabase
            .from('user_scores')
            .select('*')
            .eq('user_id', authUser.id)
            .single();

          const { data: tokens, error: tokensError } = await supabase
            .from('user_tokens')
            .select('*')
            .eq('user_id', authUser.id);

          const userData: User = {
            id: authUser.id,
            name: profile.name || authUser.email!,
            email: authUser.email!,
            credits: credits?.credits || 0,
            score: scores?.score || 0,
            tokens: tokens?.map(t => ({ tokenId: parseInt(t.token_id), quantity: 1 })) || [],
            cpf: '',
            cellphone: '',
            pixKey: ''
          };

          setUser(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    if (!authLoading) {
      loadUserData();
    }
  }, [authUser, authLoading]);

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

  const addCredits = async (amount: number) => {
    if (user && authUser) {
      const newCredits = user.credits + amount;
      
      const { error } = await supabase
        .from('user_credits')
        .update({ credits: newCredits })
        .eq('user_id', authUser.id);

      if (!error) {
        const updatedUser = { ...user, credits: newCredits };
        setUser(updatedUser);
      }
    }
  };

  const spendCredits = async (amount: number): Promise<boolean> => {
    if (user && authUser && user.credits >= amount) {
      const newCredits = user.credits - amount;
      
      const { error } = await supabase
        .from('user_credits')
        .update({ credits: newCredits })
        .eq('user_id', authUser.id);

      if (!error) {
        const updatedUser = { ...user, credits: newCredits };
        setUser(updatedUser);
        return true;
      }
    }
    return false;
  };

  const addScore = async (amount: number) => {
    if (user && authUser) {
      const newScore = (user.score || 0) + amount;
      
      const { error } = await supabase
        .from('user_scores')
        .update({ score: newScore })
        .eq('user_id', authUser.id);

      if (!error) {
        const updatedUser = { ...user, score: newScore };
        setUser(updatedUser);
      }
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

  const buyToken = async (tokenId: number, quantity: number, price: number): Promise<boolean> => {
    if (!user || !authUser) return false;
    
    try {
      // Save token to database
      const { error: tokenError } = await supabase
        .from('user_tokens')
        .insert({
          user_id: authUser.id,
          token_id: tokenId.toString(),
          token_name: `Token ${tokenId}`,
          purchase_price: price
        });

      if (tokenError) {
        console.error('Error saving token:', tokenError);
        return false;
      }

      // Add token to user's inventory
      const existingToken = user.tokens.find(t => t.tokenId === tokenId);
      const newTokens = [...user.tokens];
      if (existingToken) {
        existingToken.quantity += quantity;
      } else {
        newTokens.push({ tokenId, quantity });
      }
      
      // Add score (value + 25% bonus)
      const scoreGained = Math.floor(price * 1.25);
      await addScore(scoreGained);
      
      const updatedUser = { 
        ...user, 
        tokens: newTokens
      };
      setUser(updatedUser);

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
    } catch (error) {
      console.error('Error buying token:', error);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      loading,
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