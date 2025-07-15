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
  const { user, spendCredits, buyToken } = useUser();
  const { toast } = useToast();

  const handleBuy = () => {
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

    if (spendCredits(token.price)) {
      buyToken(token.id, 1);
      toast({
        title: "Token comprado!",
        description: `Você comprou 1x ${token.name} por ${token.price} créditos.`,
      });
      onBuy?.(token);
    }
  };

  const userToken = user?.tokens.find(t => t.tokenId === token.id);
  const ownedQuantity = userToken?.quantity || 0;

  return (
    <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 hover:scale-105">
      <CardHeader className="text-center">
        <div className="flex justify-between items-start mb-2">
          <Badge className={`${getRarityColor(token.rarity)} text-white`}>
            {token.rarity}
          </Badge>
          {ownedQuantity > 0 && (
            <Badge variant="outline" className="text-primary">
              Owned: {ownedQuantity}
            </Badge>
          )}
        </div>
        <div className="mx-auto mb-4 w-32 h-32 rounded-full bg-gradient-primary p-1">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-4xl font-bold text-primary">
            {token.name.charAt(0)}
          </div>
        </div>
        <CardTitle className="text-xl font-bold text-foreground">{token.name}</CardTitle>
        <CardDescription className="text-muted-foreground">{token.description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-2xl font-bold text-primary mb-2">
          {token.price} CR
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleBuy}
          className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold"
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