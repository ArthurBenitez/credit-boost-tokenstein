import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins, LogIn, LogOut, UserPlus, CreditCard, Trophy, Package } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { PaymentMockModal } from './PaymentMockModal';
import { useToast } from '@/hooks/use-toast';

export const Header: React.FC = () => {
  const { user, setUser, exchangeScore } = useUser();
  const { toast } = useToast();
  const [loginOpen, setLoginOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [scoreToExchange, setScoreToExchange] = useState('');
  const [loginData, setLoginData] = useState({ name: '', email: '', cpf: '', cellphone: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', cpf: '', cellphone: '' });

  const handleLogin = () => {
    if (!loginData.email) {
      toast({
        title: "Erro",
        description: "Email é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: loginData.name || 'Usuário',
      email: loginData.email,
      cpf: loginData.cpf,
      cellphone: loginData.cellphone,
      credits: 10, // Créditos iniciais
      score: 0,
      tokens: []
    };

    setUser(newUser);
    setLoginOpen(false);
    toast({
      title: "Login realizado!",
      description: "Você ganhou 10 créditos de boas-vindas!",
    });
  };

  const handleRegister = () => {
    if (!registerData.name || !registerData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: registerData.name,
      email: registerData.email,
      cpf: registerData.cpf,
      cellphone: registerData.cellphone,
      credits: 20, // Mais créditos para registro
      score: 0,
      tokens: []
    };

    setUser(newUser);
    setLoginOpen(false);
    toast({
      title: "Conta criada!",
      description: "Você ganhou 20 créditos de boas-vindas!",
    });
  };

  const handleExchangeScore = async () => {
    const amount = parseInt(scoreToExchange);
    if (!amount || amount < 1) {
      toast({
        title: "Erro",
        description: "Digite uma quantidade válida de pontos",
        variant: "destructive"
      });
      return;
    }

    const success = await exchangeScore(amount);
    if (success) {
      const paymentValue = (amount * 0.5).toFixed(2);
      toast({
        title: "Resgate processado!",
        description: `${amount} pontos resgatados. R$ ${paymentValue} será transferido para sua conta.`,
      });
      setExchangeOpen(false);
      setScoreToExchange('');
    } else {
      toast({
        title: "Erro",
        description: "Pontos insuficientes ou erro no processamento",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TOKENSTEIN
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Coins className="h-5 w-5 text-primary" />
                    <Badge variant="outline" className="text-primary border-primary">
                      {user.credits} CR
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-warning" />
                    <Badge variant="outline" className="text-warning border-warning">
                      {user.score || 0} PTS
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setPaymentOpen(true)}
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Comprar
                  </Button>

                  <Dialog open={exchangeOpen} onOpenChange={setExchangeOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-warning text-warning hover:bg-warning hover:text-white"
                        disabled={!user.score || user.score < 1}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        Trocar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px] bg-card border-border">
                      <DialogHeader>
                        <DialogTitle className="text-center bg-gradient-primary bg-clip-text text-transparent">
                          Trocar Pontos
                        </DialogTitle>
                        <DialogDescription className="text-center">
                          1 ponto = 0,5 créditos
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="score-amount">Quantidade de pontos</Label>
                          <Input
                            id="score-amount"
                            type="number"
                            min="1"
                            max={user.score || 0}
                            value={scoreToExchange}
                            onChange={(e) => setScoreToExchange(e.target.value)}
                            placeholder="Digite a quantidade"
                            className="bg-background border-border"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            Você receberá R$ {scoreToExchange ? (parseInt(scoreToExchange) * 0.5).toFixed(2) : '0,00'} em sua conta
                          </p>
                        </div>
                        <Button 
                          onClick={handleExchangeScore}
                          className="w-full bg-gradient-primary hover:opacity-90"
                          disabled={!scoreToExchange || parseInt(scoreToExchange) < 1}
                        >
                          Trocar Pontos
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Olá, {user.name}</span>
                  <Button onClick={handleLogout} variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-primary hover:opacity-90">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login / Cadastro
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-center bg-gradient-primary bg-clip-text text-transparent">
                      Acesse sua conta
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      Entre ou crie uma conta para começar a investir
                    </DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Cadastro</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-4">
                      <div>
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="login-name">Nome (opcional)</Label>
                        <Input
                          id="login-name"
                          value={loginData.name}
                          onChange={(e) => setLoginData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </div>
                      <Button onClick={handleLogin} className="w-full bg-gradient-primary hover:opacity-90">
                        <LogIn className="h-4 w-4 mr-2" />
                        Entrar (10 CR grátis)
                      </Button>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-4">
                      <div>
                        <Label htmlFor="register-name">Nome completo</Label>
                        <Input
                          id="register-name"
                          value={registerData.name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-cellphone">Telefone (opcional)</Label>
                        <Input
                          id="register-cellphone"
                          value={registerData.cellphone}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, cellphone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                          className="bg-background border-border"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-cpf">CPF (opcional)</Label>
                        <Input
                          id="register-cpf"
                          value={registerData.cpf}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, cpf: e.target.value }))}
                          placeholder="000.000.000-00"
                          className="bg-background border-border"
                        />
                      </div>
                      <Button onClick={handleRegister} className="w-full bg-gradient-primary hover:opacity-90">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Criar Conta (20 CR grátis)
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </header>

      <PaymentMockModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
    </>
  );
};