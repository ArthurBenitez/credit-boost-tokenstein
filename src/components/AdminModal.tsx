import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Send, Trash2, User, DollarSign } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  pixKey: string;
  amount: number;
  scoreAmount: number;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed';
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const { getAllUsers, updateUser } = useUser();
  const { toast } = useToast();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem('tokenstein_payment_requests');
    return saved ? JSON.parse(saved) : [];
  });
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  const savePaymentRequests = (requests: PaymentRequest[]) => {
    localStorage.setItem('tokenstein_payment_requests', JSON.stringify(requests));
    setPaymentRequests(requests);
  };

  const handleSendPayment = async (request: PaymentRequest) => {
    setProcessingPayment(request.id);
    
    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remover solicitação
      const updatedRequests = paymentRequests.filter(r => r.id !== request.id);
      savePaymentRequests(updatedRequests);
      
      // Criar notificação para o usuário
      const notifications = JSON.parse(localStorage.getItem('tokenstein_notifications') || '{}');
      notifications[request.userId] = [
        ...(notifications[request.userId] || []),
        {
          id: Date.now().toString(),
          type: 'payment_received',
          title: 'Pagamento Recebido!',
          message: `Você recebeu R$ ${request.amount.toFixed(2)} do resgate de ${request.scoreAmount} pontos.`,
          timestamp: new Date().toISOString(),
          read: false
        }
      ];
      localStorage.setItem('tokenstein_notifications', JSON.stringify(notifications));
      
      toast({
        title: "Pagamento processado!",
        description: `R$ ${request.amount.toFixed(2)} enviado para ${request.userName}`,
      });
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao processar pagamento",
        variant: "destructive"
      });
    } finally {
      setProcessingPayment(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Chave PIX copiada para a área de transferência",
    });
  };

  const allUsers = getAllUsers();
  const totalRequestsValue = paymentRequests.reduce((sum, req) => sum + req.amount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-primary bg-clip-text text-transparent text-2xl">
            🔐 PAINEL ADMINISTRATIVO
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Solicitações de Pagamento */}
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Solicitações de Pagamento
                </span>
                <Badge variant="outline" className="text-warning border-warning">
                  R$ {totalRequestsValue.toFixed(2)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {paymentRequests.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma solicitação pendente
                  </p>
                ) : (
                  <div className="space-y-4">
                    {paymentRequests.map((request) => (
                      <Card key={request.id} className="bg-card border-border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold">{request.userName}</p>
                              <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(request.timestamp).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <Badge variant="outline" className="text-warning border-warning">
                              R$ {request.amount.toFixed(2)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Label className="text-xs">PIX:</Label>
                            <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                              {request.pixKey}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(request.pixKey)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSendPayment(request)}
                              disabled={processingPayment === request.id}
                              className="flex-1 bg-gradient-primary hover:opacity-90"
                            >
                              <Send className="h-3 w-3 mr-1" />
                              {processingPayment === request.id ? 'Enviando...' : 'Enviar'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Lista de Usuários */}
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Usuários Cadastrados ({allUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {allUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum usuário cadastrado
                  </p>
                ) : (
                  <div className="space-y-3">
                    {allUsers.map((user) => (
                      <Card key={user.id} className="bg-card border-border">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              {user.pixKey && (
                                <div className="flex items-center gap-2 mt-1">
                                  <Label className="text-xs">PIX:</Label>
                                  <code className="text-xs bg-muted px-1 rounded">
                                    {user.pixKey}
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(user.pixKey!)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-primary border-primary mb-1">
                                {user.credits} CR
                              </Badge>
                              <br />
                              <Badge variant="outline" className="text-warning border-warning">
                                {user.score || 0} PTS
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};