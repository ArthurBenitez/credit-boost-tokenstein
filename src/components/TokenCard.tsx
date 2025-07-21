import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Token } from '@/types/token';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface TokenCardProps {
  token: Token;
  onBuy?: (token: Token) => void;
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Common': return 'bg-muted';
    case 'Uncommon': return 'bg-success';
    case 'Rare': return 'bg-primary';
    case 'Epic': return 'bg-accent';
    case 'Legendary': return 'bg-warning';
    default: return 'bg-muted';
  }
};

export const TokenCard: React.FC<TokenCardProps> = ({ token, onBuy }) => {
  const { user, spendCredits, buyToken, getAllUsers } = useUser();
  const { toast } = useToast();

  const handleBuy = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para comprar tokens.",
        variant: "destructive"
      });
      return;
    }

    if (user.credits < token.price) {
      toast({
        title: "Créditos insuficientes",
        description: `Você precisa de ${token.price} créditos para comprar este token.`,
        variant: "destructive"
      });
      return;
    }

    const success = await spendCredits(token.price);
    if (success) {
      const allUsers = getAllUsers();
      const usersWithToken = allUsers.filter(u => 
        u.id !== user.id && 
        u.tokens.some(t => t.tokenId === token.id && t.quantity > 0)
      );
      
      let stealMessage = "";
      if (usersWithToken.length > 0) {
        const randomUser = usersWithToken[Math.floor(Math.random() * usersWithToken.length)];
        stealMessage = ` ${randomUser.name} perdeu 1 token e ganhou ${token.price} pontos!`;
      }
      
      const tokenBought = await buyToken(token.id, 1, token.price);
      if (tokenBought) {
        const scoreGained = Math.floor(token.price * 1.25);
        
        toast({
          title: "Token comprado!",
          description: `Você comprou 1x ${token.name} por ${token.price} créditos e ganhou ${scoreGained} pontos!${stealMessage}`,
        });
        onBuy?.(token);
      }
    }
  };

  const userToken = user?.tokens.find(t => t.tokenId === token.id);
  const ownedQuantity = userToken?.quantity || 0;

  return (
    <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in group">
      <CardHeader className="text-center">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${getRarityColor(token.rarity)} text-white transition-all duration-300 group-hover:scale-110`}>
            {token.rarity}
          </Badge>
          {ownedQuantity > 0 && (
            <Badge variant="outline" className="text-primary border-primary animate-glow-pulse">
              Owned: {ownedQuantity}
            </Badge>
          )}
        </div>
        <div className="mx-auto mb-4 w-32 h-32 rounded-full bg-gradient-primary p-1 animate-float group-hover:animate-glow-pulse">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
            <img 
              src={token.image} 
              alt={token.name}
              className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-4xl font-bold text-primary">${token.name.charAt(0)}</span>`;
                }
              }}
            />
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">{token.name}</CardTitle>
        <CardDescription className="text-muted-foreground">{token.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-2xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
          {token.price} CR
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBuy}
          className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-glow"
          disabled={!user || user.credits < token.price}
        >
          {!user ? 'Login necessário' : 
           user.credits < token.price ? 'Créditos insuficientes' : 
           'Comprar Token'}
        </Button>
      </CardFooter>
    </Card>
  );
};