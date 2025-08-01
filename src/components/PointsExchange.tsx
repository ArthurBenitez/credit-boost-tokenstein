import React, { useState } from 'react';
import { ArrowRightLeft, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { addNotification } from './NotificationSystem';

export const PointsExchange: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pointsToExchange, setPointsToExchange] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const handleExchange = async () => {
    if (!user) return;

    const points = parseInt(pointsToExchange);
    if (!points || points <= 0 || points > (user.score || 0)) {
      toast({
        title: 'Erro',
        description: 'Digite uma quantidade válida de pontos',
        variant: 'destructive'
      });
      return;
    }

    if (!pixKey.trim()) {
      toast({
        title: 'Erro',
        description: 'Insira uma chave PIX válida',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const amount = points * 0.5; // 1 ponto = R$ 0,50

      // Criar solicitação de saque
      const withdrawalRequest = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        pixKey: pixKey.trim(),
        amount,
        points,
        status: 'pending' as const,
        timestamp: new Date().toISOString()
      };

      // Salvar solicitação
      const existingRequests = JSON.parse(localStorage.getItem('spritepay_withdrawal_requests') || '[]');
      existingRequests.push(withdrawalRequest);
      localStorage.setItem('spritepay_withdrawal_requests', JSON.stringify(existingRequests));

      // Remover pontos do usuário (eles serão devolvidos se negado)
      const updatedUser = { 
        ...user, 
        score: (user.score || 0) - points
      };
      
      // Atualizar usuário no localStorage
      const allUsers = JSON.parse(localStorage.getItem('spritepay_all_users') || '[]');
      const userIndex = allUsers.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        allUsers[userIndex] = updatedUser;
        localStorage.setItem('spritepay_all_users', JSON.stringify(allUsers));
      }

      // Adicionar notificação
      addNotification({
        type: 'info',
        title: 'Solicitação Enviada',
        message: `Sua solicitação de saque de R$ ${amount.toFixed(2)} foi enviada para análise.`
      });

      toast({
        title: 'Solicitação enviada!',
        description: `Sua solicitação de R$ ${amount.toFixed(2)} foi enviada para análise. Você será notificado quando processada.`,
      });

      setIsOpen(false);
      setPointsToExchange('');
      setPixKey('');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar solicitação. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exchangeValue = pointsToExchange ? (parseInt(pointsToExchange) * 0.5).toFixed(2) : '0.00';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-gradient-primary hover:opacity-90 animate-glow-pulse">
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Trocar Pontos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Trocar Pontos por Dinheiro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Card */}
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-success" />
                <span className="font-semibold">Taxa de Conversão</span>
              </div>
              <p className="text-2xl font-bold text-success">1 ponto = R$ 0,50</p>
              <p className="text-sm text-muted-foreground mt-2">
                Seus pontos disponíveis: <span className="font-semibold text-primary">{user?.score || 0}</span>
              </p>
            </CardContent>
          </Card>

          {/* Exchange Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="points">Quantos pontos deseja trocar?</Label>
              <Input
                id="points"
                type="number"
                placeholder="Digite a quantidade de pontos"
                value={pointsToExchange}
                onChange={(e) => setPointsToExchange(e.target.value)}
                max={user?.score || 0}
                min="1"
                className="mt-1"
              />
              {pointsToExchange && (
                <p className="text-sm text-success mt-2">
                  Você receberá: <span className="font-bold">R$ {exchangeValue}</span>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                placeholder="Digite sua chave PIX"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          {/* Warning */}
          <Card className="bg-warning/10 border-warning/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                <div>
                  <p className="font-semibold text-warning mb-1">Importante:</p>
                  <p className="text-sm text-muted-foreground">
                    Solicitações mais antigas e de maior valor são priorizadas. 
                    O processamento pode levar até 24 horas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleExchange}
              disabled={loading || !pointsToExchange || !pixKey}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {loading ? 'Processando...' : 'Solicitar Saque'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};