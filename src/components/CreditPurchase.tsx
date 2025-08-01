import React, { useState } from 'react';
import { CreditCard, QrCode, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const CREDIT_PACKAGES = [
  { credits: 10, price: 10, bonus: 0 },
  { credits: 25, price: 25, bonus: 2 },
  { credits: 50, price: 50, bonus: 5 },
  { credits: 100, price: 100, bonus: 15 },
  { credits: 250, price: 250, bonus: 50 },
  { credits: 500, price: 500, bonus: 100 },
];

export const CreditPurchase: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof CREDIT_PACKAGES[0] | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'pix'>('card');
  const [loading, setLoading] = useState(false);
  const { addCredits } = useUser();
  const { toast } = useToast();

  const handlePurchase = async () => {
    if (!selectedPackage && !customAmount) {
      toast({
        title: 'Erro',
        description: 'Selecione um pacote ou digite um valor',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      let credits = 0;
      let amount = 0;

      if (selectedPackage) {
        credits = selectedPackage.credits + selectedPackage.bonus;
        amount = selectedPackage.price;
      } else {
        const customValue = parseInt(customAmount);
        if (customValue < 5) {
          toast({
            title: 'Erro',
            description: 'Valor mínimo é R$ 5,00',
            variant: 'destructive'
          });
          return;
        }
        credits = customValue;
        amount = customValue;
      }

      if (paymentMethod === 'pix') {
        toast({
          title: 'PIX em desenvolvimento',
          description: 'Esta funcionalidade estará disponível em breve!',
          variant: 'destructive'
        });
        return;
      }

      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Adicionar créditos
      await addCredits(credits);

      toast({
        title: 'Pagamento aprovado!',
        description: `${credits} créditos foram adicionados à sua conta.`,
      });

      setIsOpen(false);
      setSelectedPackage(null);
      setCustomAmount('');
    } catch (error) {
      toast({
        title: 'Erro no pagamento',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:opacity-90 animate-glow-pulse">
          <Plus className="w-4 h-4 mr-2" />
          Comprar Créditos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Comprar Créditos - SpritePay
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pacotes de Créditos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pacotes Populares</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CREDIT_PACKAGES.map((pkg, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all border-2 hover:shadow-glow ${
                    selectedPackage === pkg
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setCustomAmount('');
                  }}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {pkg.credits + pkg.bonus}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">créditos</div>
                    <div className="text-lg font-bold">R$ {pkg.price}</div>
                    {pkg.bonus > 0 && (
                      <div className="text-xs text-success font-semibold mt-1">
                        +{pkg.bonus} BÔNUS!
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Valor Personalizado */}
          <div>
            <Label htmlFor="custom">Ou digite um valor personalizado (mín. R$ 5,00)</Label>
            <Input
              id="custom"
              type="number"
              placeholder="Ex: 75"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedPackage(null);
              }}
              min="5"
              className="mt-2"
            />
          </div>

          {/* Método de Pagamento */}
          <div>
            <Label>Método de Pagamento</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <Card
                className={`cursor-pointer border-2 transition-all hover:shadow-glow ${
                  paymentMethod === 'card'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod('card')}
              >
                <CardContent className="p-4 text-center">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Cartão</div>
                  <div className="text-sm text-success">Aprovação Instantânea</div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer border-2 transition-all hover:shadow-glow ${
                  paymentMethod === 'pix'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod('pix')}
              >
                <CardContent className="p-4 text-center">
                  <QrCode className="w-8 h-8 mx-auto mb-2 text-warning" />
                  <div className="font-semibold">PIX</div>
                  <div className="text-sm text-warning">Em Desenvolvimento</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Resumo */}
          {(selectedPackage || customAmount) && (
            <Card className="bg-gradient-card border-primary/30">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2 text-primary">Resumo da Compra</h4>
                <div className="flex justify-between items-center">
                  <span>Créditos:</span>
                  <span className="font-bold">
                    {selectedPackage 
                      ? `${selectedPackage.credits + selectedPackage.bonus}` 
                      : customAmount
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Valor:</span>
                  <span className="font-bold text-success">
                    R$ {selectedPackage ? selectedPackage.price : customAmount || '0'}.00
                  </span>
                </div>
                {selectedPackage && selectedPackage.bonus > 0 && (
                  <div className="text-sm text-success mt-2">
                    Inclui {selectedPackage.bonus} créditos de bônus!
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Botões */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handlePurchase}
              disabled={loading || (!selectedPackage && !customAmount)}
              className="flex-1 bg-gradient-primary hover:opacity-90"
            >
              {loading ? 'Processando...' : 'Pagar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};