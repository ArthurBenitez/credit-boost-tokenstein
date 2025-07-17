export interface Token {
  id: number;
  name: string;
  price: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  image: string;
  owned?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  cellphone?: string;
  pixKey?: string;
  credits: number;
  score: number;
  tokens: { tokenId: number; quantity: number }[];
}

export interface PaymentData {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'EXPIRED';
  brCode: string;
  brCodeBase64: string;
  expiresAt: string;
  createdAt: string;
}