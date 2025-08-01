import React, { useState, useEffect } from 'react';
import { User, CreditCard, Check, X, Filter, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addNotification } from './NotificationSystem';

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  pixKey: string;
  amount: number;
  points: number;
  status: 'pending' | 'approved' | 'denied';
  timestamp: string;
}

export const AdminPanel: React.FC = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const savedRequests = localStorage.getItem('spritepay_withdrawal_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  };

  const saveRequests = (newRequests: WithdrawalRequest[]) => {
    localStorage.setItem('spritepay_withdrawal_requests', JSON.stringify(newRequests));
    setRequests(newRequests);
  };

  const handleApprove = (request: WithdrawalRequest) => {
    const updatedRequests = requests.map(req =>
      req.id === request.id ? { ...req, status: 'approved' as const } : req
    );
    saveRequests(updatedRequests);

    // Adicionar notificação para o usuário
    addNotification({
      type: 'success',
      title: 'Pagamento Realizado!',
      message: `Seu saque de R$ ${request.amount.toFixed(2)} foi processado com sucesso!`
    });
  };

  const handleDeny = (request: WithdrawalRequest) => {
    const updatedRequests = requests.map(req =>
      req.id === request.id ? { ...req, status: 'denied' as const } : req
    );
    saveRequests(updatedRequests);

    // Devolver os pontos para o usuário (simulação)
    const users = JSON.parse(localStorage.getItem('spritepay_all_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === request.userId);
    if (userIndex !== -1) {
      users[userIndex].score = (users[userIndex].score || 0) + request.points;
      localStorage.setItem('spritepay_all_users', JSON.stringify(users));
    }

    // Adicionar notificação para o usuário
    addNotification({
      type: 'warning',
      title: 'Solicitação Negada',
      message: 'Sua solicitação foi negada. Seus pontos foram devolvidos. Envie uma chave PIX válida.'
    });
  };

  const filteredRequests = requests
    .filter(req => filter === 'all' || req.status === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="border-warning text-warning">Pendente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="border-success text-success">Aprovado</Badge>;
      case 'denied':
        return <Badge variant="outline" className="border-destructive text-destructive">Negado</Badge>;
      default:
        return null;
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    denied: requests.filter(r => r.status === 'denied').length,
    totalAmount: requests
      .filter(r => r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Painel Admin - SpritePay
        </h1>
        <Badge variant="destructive" className="animate-pulse">
          MODO ADMINISTRADOR
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Aprovados</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Negados</p>
                <p className="text-2xl font-bold">{stats.denied}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Pago</p>
                <p className="text-2xl font-bold">R$ {stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovados</SelectItem>
            <SelectItem value="denied">Negados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Data (mais recente)</SelectItem>
            <SelectItem value="amount">Valor (maior)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Nenhuma solicitação encontrada</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="bg-gradient-card border-border hover:shadow-glow transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.userName}</h3>
                      <p className="text-sm text-muted-foreground">{request.userEmail}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-semibold text-success">R$ {request.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pontos</p>
                    <p className="font-semibold">{request.points}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chave PIX</p>
                    <p className="font-mono text-sm">{request.pixKey}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="text-sm">{new Date(request.timestamp).toLocaleString()}</p>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(request)}
                      size="sm"
                      className="bg-success hover:bg-success/90 text-white"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                    <Button
                      onClick={() => handleDeny(request)}
                      size="sm"
                      variant="destructive"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Negar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};