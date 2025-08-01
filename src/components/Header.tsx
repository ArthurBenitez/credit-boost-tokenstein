import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, LogOut, CreditCard, Trophy, Package, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from './UserProfile';
import { TokenInventory } from './TokenInventory';
import { PaymentModal } from './PaymentModal';
import { AdminModal } from './AdminModal';
import { NotificationSystem } from './NotificationSystem';
import { PointsExchange } from './PointsExchange';
import { CreditPurchase } from './CreditPurchase';

const Header = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  const { signOut, user: authUser } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [scoreToExchange, setScoreToExchange] = useState('');
  
  // Verificar se é admin
  const isAdmin = authUser?.email === 'admin@imperium.com';

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logout realizado!",
      description: "Até logo!",
    });
    navigate('/auth');
  };

  return (
    <>
      <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SPRITEPAY
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
                  <CreditPurchase />
                  <PointsExchange />
                  <NotificationSystem />
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
                  
                  {isAdmin && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setAdminOpen(true)}
                      className="text-sm animate-pulse"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      ADMIN
                    </Button>
                  )}
                  
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