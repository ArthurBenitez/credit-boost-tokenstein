import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Trophy } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { tokens } from '@/data/tokens';

export const TokenInventory: React.FC = () => {
  const { user } = useUser();

  if (!user || user.tokens.length === 0) {
    return (
      <Card className="bg-gradient-card border-border">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl text-foreground">Inventário Vazio</CardTitle>
          <CardDescription>Você ainda não possui tokens. Comece comprando alguns!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const userTokensWithDetails = user.tokens.map(userToken => {
    const tokenDetail = tokens.find(t => t.id === userToken.tokenId);
    return {
      ...userToken,
      ...tokenDetail
    };
  }).filter(token => token.name); // Filter out tokens that don't exist in our data

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-6">
        <Package className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Seu Inventário</h2>
        <Badge variant="outline" className="text-primary border-primary">
          {userTokensWithDetails.length} tipos
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userTokensWithDetails.map((token) => (
          <Card key={token.tokenId} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader className="text-center pb-3">
              <div className="mx-auto mb-3 w-20 h-20 rounded-full bg-gradient-primary p-1">
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                  <img 
                    src={token.image} 
                    alt={token.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-2xl font-bold text-primary">${token.name?.charAt(0)}</span>`;
                      }
                    }}
                  />
                </div>
              </div>
              <CardTitle className="text-lg text-foreground">{token.name}</CardTitle>
              <div className="flex items-center justify-center space-x-2">
                <Badge className="bg-primary text-white">
                  {token.rarity}
                </Badge>
                <Badge variant="outline" className="text-success border-success">
                  x{token.quantity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <div className="text-2xl font-bold text-primary">
                x{token.quantity}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};