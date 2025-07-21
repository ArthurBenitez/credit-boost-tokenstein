import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, QrCode, CheckCircle2, XCircle, Clock, Copy } from 'lucide-react';
import { AbacatePayService } from '@/services/abacatePayService';
import { PaymentData } from '@/types/token';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    cellphone: '',
    taxId: ''
  });
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [checkingPayment, setCheckingPayment] = useState(false);
  
  const { user, addCredits } = useUser();
  const { toast } = useToast();

  // Load user data if available
  useEffect(() => {
    if (user) {
      setCustomerData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        cellphone: user.cellphone || '',
        taxId: user.cpf || ''
      }));
    }
  }, [user]);

  // Countdown timer
  useEffect(() => {
    if (paymentData && step === 'payment') {
      const expiresAt = new Date(paymentData.expiresAt).getTime();
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
          setStep('form');
          toast({
            title: "Pagamento expirado",
            description: "O tempo limite para pagamento foi atingido.",
            variant: "destructive"
          });
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paymentData, step, toast]);

  const handleCheckPayment = async () => {
    if (!paymentData) return;
    
    setCheckingPayment(true);
    try {
      const response = await AbacatePayService.checkPaymentStatus(paymentData.id);
      if (response.data.status === 'PAID') {
        // Update payment status in database
        if (user) {
          const { error: updateError } = await supabase
            .from('payments')
            .update({ status: 'paid' })
            .eq('payment_id', paymentData.id)
            .eq('user_id', user.id);
            
          if (updateError) {
            console.error('Error updating payment status:', updateError);
          }
        }
        
        setStep('success');
        const creditsToAdd = Math.floor(parseFloat(amount) * 1); // 1 real = 1 crédito
        addCredits(creditsToAdd);
        toast({
          title: "Pagamento confirmado!",
          description: `${creditsToAdd} créditos foram adicionados à sua conta.`,
        });
      } else {
        toast({
          title: "Pagamento não encontrado",
          description: "O pagamento ainda não foi processado. Tente novamente em alguns instantes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast({
        title: "Erro ao verificar pagamento",
        description: "Não foi possível verificar o status do pagamento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setCheckingPayment(false);
    }
  };

  const handleCreatePayment = async () => {
    setLoading(true);
    try {
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      const payment = await AbacatePayService.createPixQrCode({
        amount: amountInCents,
        expiresIn: 3600, // 1 hour
        description: `Compra de créditos - ${amount} CR`,
        customer: customerData
      });

      setPaymentData(payment);
      
      // Save payment to database
      if (user) {
        const { error: dbError } = await supabase
          .from('payments')
          .insert({
            payment_id: payment.id,
            user_id: user.id,
            amount: parseFloat(amount),
            credits: Math.floor(parseFloat(amount) * 1),
            status: 'pending'
          });
          
        if (dbError) {
          console.error('Error saving payment to database:', dbError);
        }
      }
      
      setStep('payment');
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erro ao criar pagamento",
        description: "Não foi possível gerar o QR Code. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setStep('form');
    setPaymentData(null);
    setTimeLeft(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
            Comprar Créditos
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {step === 'form' && 'Preencha os dados para gerar o PIX'}
            {step === 'payment' && 'Escaneie o QR Code para pagar'}
            {step === 'success' && 'Pagamento realizado com sucesso!'}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' && (
          <div className="space-y-4">
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

            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                value={customerData.name}
                onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerData.email}
                onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="cellphone">Telefone</Label>
              <Input
                id="cellphone"
                value={customerData.cellphone}
                onChange={(e) => setCustomerData(prev => ({ ...prev, cellphone: e.target.value }))}
                placeholder="(11) 99999-9999"
                className="bg-background border-border"
              />
            </div>

            <div>
              <Label htmlFor="taxId">CPF</Label>
              <Input
                id="taxId"
                value={customerData.taxId}
                onChange={(e) => setCustomerData(prev => ({ ...prev, taxId: e.target.value }))}
                placeholder="000.000.000-00"
                className="bg-background border-border"
              />
            </div>

            <Button 
              onClick={handleCreatePayment}
              disabled={loading || !amount || parseFloat(amount) < 3 || !customerData.name || !customerData.email}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando PIX...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Gerar PIX
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'payment' && paymentData && (
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Tempo restante: {formatTime(timeLeft)}</span>
            </div>

            <Card className="bg-white p-4">
              <CardContent className="p-0">
                <img 
                  src={paymentData.brCodeBase64} 
                  alt="QR Code PIX" 
                  className="mx-auto max-w-[250px] w-full"
                />
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="brcode" className="text-sm font-medium">Código PIX (Copiar e Colar)</Label>
              <div className="flex space-x-2">
                <Input
                  id="brcode"
                  value={paymentData.brCode}
                  readOnly
                  className="bg-muted text-xs"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(paymentData.brCode);
                    toast({
                      title: "Código copiado!",
                      description: "O código PIX foi copiado para a área de transferência.",
                    });
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Cole este código no seu app bancário para pagar
              </p>
            </div>

            <div className="text-sm space-y-2">
              <p>Valor: <span className="font-bold text-primary">R$ {amount}</span></p>
              <p>Créditos: <span className="font-bold text-primary">{Math.floor(parseFloat(amount) * 1)} CR</span></p>
              <p className="text-muted-foreground">Escaneie o QR Code com seu app bancário</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-warning">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Aguardando pagamento...</span>
              </div>
              
              <Button 
                onClick={handleCheckPayment}
                disabled={checkingPayment}
                variant="outline"
                className="w-full"
              >
                {checkingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Já efetuei o pagamento'
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-success mx-auto" />
            <div>
              <h3 className="text-xl font-bold text-success mb-2">Pagamento Confirmado!</h3>
              <p className="text-muted-foreground">
                {Math.floor(parseFloat(amount) * 1)} créditos foram adicionados à sua conta.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-gradient-primary hover:opacity-90">
              Continuar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};