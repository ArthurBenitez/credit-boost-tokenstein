import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, CreditCard } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { WebhookService } from '@/services/webhookService';

interface PaymentMockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentMockModal: React.FC<PaymentMockModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [amount, setAmount] = useState('');
  
  const { user, addCredits } = useUser();
  const { toast } = useToast();

  const handleMockPayment = () => {
    if (!amount || parseFloat(amount) < 3) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor mínimo de R$ 3,00",
        variant: "destructive"
      });
      return;
    }

    const creditsToAdd = Math.floor(parseFloat(amount) * 1); // 1 real = 1 crédito
    
    // Criar um ID de pagamento simulado
    const paymentId = `sim_${Date.now()}`;
    
    // Salvar pagamento pendente
    const pendingPayments = JSON.parse(localStorage.getItem('tokenstein_pending_payments') || '{}');
    pendingPayments[paymentId] = {
      credits: creditsToAdd,
      customerEmail: user?.email,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('tokenstein_pending_payments', JSON.stringify(pendingPayments));

    // Simular webhook do AbacatePay
    WebhookService.simulateWebhookReceived(paymentId, creditsToAdd);
    
    // Adicionar créditos imediatamente para demonstração
    addCredits(creditsToAdd);
    setStep('success');
    
    toast({
      title: "Créditos adicionados com sucesso!",
      description: `${creditsToAdd} créditos foram adicionados à sua conta.`,
    });

    toast({
      title: "Webhook configurado!",
      description: "7pay - https://arthurbenitez.github.io/tokenstein-definitivo/",
    });
  };

  const handleClose = () => {
    setStep('form');
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Comprar Créditos (DEMO)
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {step === 'form' && 'Sistema de pagamento em demonstração'}
            {step === 'success' && 'Créditos adicionados com sucesso!'}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {step === 'form' && (
            <div className="space-y-4 p-1">
              <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning font-medium text-center">
                  ⚠️ MODO DEMONSTRAÇÃO ⚠️<br/>
                  Webhook: 7pay - arthur7pay
                </p>
              </div>

              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="3"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Mínimo R$ 3,00"
                  className="bg-background border-border"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Você receberá {amount ? Math.floor(parseFloat(amount) * 1) : 0} créditos
                </p>
              </div>

              <Button 
                onClick={handleMockPayment}
                disabled={!amount || parseFloat(amount) < 3}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Simular Pagamento
              </Button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 p-1">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
              <div>
                <h3 className="text-xl font-bold text-success mb-2">Créditos Adicionados!</h3>
                <p className="text-muted-foreground">
                  {Math.floor(parseFloat(amount) * 1)} créditos foram adicionados à sua conta.
                </p>
              </div>
              <Button onClick={handleClose} className="w-full bg-gradient-primary hover:opacity-90">
                Continuar
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};