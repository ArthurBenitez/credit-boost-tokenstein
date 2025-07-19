import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, LogOut, CreditCard, Trophy, Package } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from './UserProfile';
import { TokenInventory } from './TokenInventory';
import { PaymentModal } from './PaymentModal';
import { AdminModal } from './AdminModal';

const Header = () => {
  const navigate = useNavigate();
  const { user, loading, exchangeScore } = useUser();
  const { signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [scoreToExchange, setScoreToExchange] = useState('');
  const [tPressed, setTPressed] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setIsAdmin(false);
    toast({
      title: "Logout realizado!",
      description: "Até logo!",
    });
    navigate('/auth');
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

    if (!user?.pixKey) {
      toast({
        title: "Chave PIX necessária",
        description: "Cadastre sua chave PIX no perfil antes de resgatar pontos",
        variant: "destructive"
      });
      return;
    }

    const success = await exchangeScore(amount);
    if (success) {
      const paymentValue = (amount * 0.5).toFixed(2);
      toast({
        title: "Solicitação enviada!",
        description: `Solicitação de R$ ${paymentValue} criada. Você receberá uma notificação quando o pagamento for processado.`,
      });
      setExchangeOpen(false);
      setScoreToExchange('');
    } else {
      toast({
        title: "Erro",
        description: "Pontos insuficientes, chave PIX não cadastrada ou erro no processamento",
        variant: "destructive"
      });
    }
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
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            ) : user ? (
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
                           1 ponto = R$ 0,50 (transferência PIX)
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setProfileOpen(true)}
                    className="text-sm"
                  >
                    {user.name}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setInventoryOpen(true)}
                    className="text-sm"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Inventário
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <UserProfile />
      {inventoryOpen && <TokenInventory />}
      <PaymentModal isOpen={paymentOpen} onClose={() => setPaymentOpen(false)} />
      <AdminModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
    </>
  );
};

export default Header;