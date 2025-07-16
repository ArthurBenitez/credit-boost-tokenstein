import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';
import { tokens } from '@/data/tokens';
import { Coins, TrendingUp, Award } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const userTokens = user.tokens.map(userToken => {
    const token = tokens.find(t => t.id === userToken.tokenId);
    return {
      ...userToken,
      tokenData: token
    };
  }).filter(t => t.tokenData);

  const totalInvested = userTokens.reduce((sum, userToken) => {
    return sum + (userToken.tokenData!.price * userToken.quantity);
  }, 0);

  const portfolioValue = Math.round(totalInvested * 1.125); // Simulated 12.5% gain
  const profit = portfolioValue - totalInvested;
  const profitPercentage = totalInvested > 0 ? ((profit / totalInvested) * 100) : 0;

  if (userTokens.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-gradient-card">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            SEU{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              PORTFÓLIO
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Acompanhe seus investimentos e rendimentos
          </p>
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
          <Card className="bg-background border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Investido</CardTitle>
              <Coins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalInvested} CR</div>
              <p className="text-xs text-muted-foreground">
                Valor total dos seus tokens
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Atual</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{portfolioValue} CR</div>
              <p className="text-xs text-success">
                +{profit} CR ({profitPercentage.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tokens Únicos</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{userTokens.length}</div>
              <p className="text-xs text-muted-foreground">
                Diferentes tipos de tokens
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Token Holdings */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-6 text-center">Seus Tokens</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTokens.map((userToken) => {
              const token = userToken.tokenData!;
              const currentValue = Math.round(token.price * userToken.quantity * 1.125);
              const investedValue = token.price * userToken.quantity;
              const tokenProfit = currentValue - investedValue;
              const tokenProfitPercentage = ((tokenProfit / investedValue) * 100);

              return (
                <Card key={token.id} className="bg-background border-border">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-primary p-0.5">
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
                                parent.innerHTML = `<span class="text-lg font-bold text-primary">${token.name.charAt(0)}</span>`;
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{token.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{token.rarity}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {userToken.quantity}x
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Investido:</span>
                      <span className="font-medium">{investedValue} CR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Valor atual:</span>
                      <span className="font-medium text-success">{currentValue} CR</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Lucro:</span>
                      <span className="font-medium text-success">
                        +{tokenProfit} CR ({tokenProfitPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={Math.min(100, 80 + tokenProfitPercentage)} className="h-2" />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};