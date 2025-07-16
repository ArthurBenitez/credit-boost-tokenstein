import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Gift, TrendingUp, Star } from 'lucide-react';

export const ReferralSection: React.FC = () => {
  const [referralCode] = useState('TOKEN123');
  const [copied, setCopied] = useState(false);

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            GANHE DINHEIRO{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              INDICANDO AMIGOS
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Além de investir, você pode ganhar comissões indicando novos investidores para a plataforma.
            Receba até 5% do valor investido por cada pessoa que você convidar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Referral Benefits */}
          <div className="space-y-6">
            <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Indicações Diretas</CardTitle>
                    <CardDescription>Ganhe com cada novo usuário</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Comissão:</span>
                  <Badge className="bg-gradient-primary text-white">5%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Ganhe 5% do valor investido por cada pessoa que se registrar usando seu link
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Segundo Nível</CardTitle>
                    <CardDescription>Ganhe das indicações dos seus indicados</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Comissão:</span>
                  <Badge className="bg-accent text-white">2%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Receba 2% das indicações feitas pelos seus indicados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-warning rounded-full flex items-center justify-center">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Bônus Premium</CardTitle>
                    <CardDescription>Recompensas especiais por performance</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Bônus:</span>
                  <Badge className="bg-warning text-white">Até R$ 1.000</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Ganhe bônus extras ao atingir metas de indicação mensais
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Referral Card */}
          <div className="flex items-center">
            <Card className="w-full bg-gradient-primary p-1">
              <div className="bg-background rounded-lg p-6">
                <div className="text-center mb-6">
                  <Gift className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Seu Link de Indicação</h3>
                  <p className="text-muted-foreground">
                    Compartilhe este link e comece a ganhar
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Seu código:</label>
                    <div className="mt-1 p-3 bg-muted rounded-lg text-center font-mono text-lg font-bold">
                      {referralCode}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Link completo:</label>
                    <div className="mt-1 p-3 bg-muted rounded-lg text-sm break-all">
                      {window.location.origin}?ref={referralCode}
                    </div>
                  </div>

                  <Button 
                    onClick={copyReferralLink}
                    className="w-full bg-gradient-primary hover:opacity-90 text-white font-semibold"
                  >
                    {copied ? 'Link Copiado! ✓' : 'Copiar Link de Indicação'}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    <p>Você precisa ter CPF cadastrado para receber comissões</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-gradient-card rounded-xl border border-border">
            <div className="text-2xl font-bold text-primary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Indicações</div>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-xl border border-border">
            <div className="text-2xl font-bold text-primary mb-1">R$ 0</div>
            <div className="text-sm text-muted-foreground">Comissões</div>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-xl border border-border">
            <div className="text-2xl font-bold text-primary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Nível 2</div>
          </div>
          <div className="text-center p-6 bg-gradient-card rounded-xl border border-border">
            <div className="text-2xl font-bold text-primary mb-1">R$ 0</div>
            <div className="text-sm text-muted-foreground">Total Ganho</div>
          </div>
        </div>
      </div>
    </section>
  );
};