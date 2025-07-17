import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Edit, CreditCard, Trophy, Bell, Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { tokens } from '@/data/tokens';

export const UserProfile: React.FC = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    cellphone: user?.cellphone || '',
    cpf: user?.cpf || '',
    pixKey: user?.pixKey || ''
  });

  if (!user) return null;

  const handleSave = () => {
    const updatedUser = {
      ...user,
      ...editData
    };
    updateUser(updatedUser);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const getUserTokens = () => {
    return user.tokens.map(userToken => {
      const tokenData = tokens.find(t => t.id === userToken.tokenId);
      return {
        ...tokenData,
        quantity: userToken.quantity
      };
    }).filter(Boolean);
  };

  const userTokens = getUserTokens();
  const totalInvested = userTokens.reduce((sum, token) => sum + (token.price * token.quantity), 0);

  // Buscar notificações do usuário
  const notifications = JSON.parse(localStorage.getItem('tokenstein_notifications') || '{}')[user.id] || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <User className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-warning text-white">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-primary bg-clip-text text-transparent">
            Meu Perfil
          </DialogTitle>
          <DialogDescription className="text-center">
            Gerencie suas informações pessoais e acompanhe seu portfólio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo da Conta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-background border-border">
              <CardContent className="p-4 text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-primary">{user.credits}</p>
                <p className="text-sm text-muted-foreground">Créditos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold text-warning">{user.score || 0}</p>
                <p className="text-sm text-muted-foreground">Pontos</p>
              </CardContent>
            </Card>
            
            <Card className="bg-background border-border">
              <CardContent className="p-4 text-center">
                <User className="h-8 w-8 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">{userTokens.length}</p>
                <p className="text-sm text-muted-foreground">Tokens Únicos</p>
              </CardContent>
            </Card>
          </div>

          {/* Abas */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={!showNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setShowNotifications(false)}
                className={!showNotifications ? "bg-gradient-primary" : ""}
              >
                Informações Pessoais
              </Button>
              <Button
                variant={showNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => setShowNotifications(true)}
                className={`relative ${showNotifications ? "bg-gradient-primary" : ""}`}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notificações
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-warning text-white">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            {!showNotifications ? (
              /* Informações Pessoais */
              <Card className="bg-background border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Dados Pessoais
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancelar' : 'Editar'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nome Completo</Label>
                      {isEditing ? (
                        <Input
                          value={editData.name}
                          onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{user.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Email</Label>
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editData.email}
                          onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{user.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>Telefone</Label>
                      {isEditing ? (
                        <Input
                          value={editData.cellphone}
                          onChange={(e) => setEditData(prev => ({ ...prev, cellphone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{user.cellphone || 'Não informado'}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label>CPF</Label>
                      {isEditing ? (
                        <Input
                          value={editData.cpf}
                          onChange={(e) => setEditData(prev => ({ ...prev, cpf: e.target.value }))}
                          placeholder="000.000.000-00"
                          className="bg-background border-border"
                        />
                      ) : (
                        <p className="text-sm bg-muted p-2 rounded">{user.cpf || 'Não informado'}</p>
                      )}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label>Chave PIX (para receber pagamentos)</Label>
                    {isEditing ? (
                      <Input
                        value={editData.pixKey}
                        onChange={(e) => setEditData(prev => ({ ...prev, pixKey: e.target.value }))}
                        placeholder="CPF, email, celular ou chave aleatória"
                        className="bg-background border-border"
                      />
                    ) : (
                      <p className="text-sm bg-muted p-2 rounded">{user.pixKey || 'Não informado'}</p>
                    )}
                  </div>
                  
                  {isEditing && (
                    <Button onClick={handleSave} className="w-full bg-gradient-primary hover:opacity-90">
                      Salvar Alterações
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Notificações */
              <Card className="bg-background border-border">
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhuma notificação
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map((notification: any) => (
                          <Card key={notification.id} className={`p-3 ${notification.read ? 'bg-muted/30' : 'bg-warning/10 border-warning/30'}`}>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-medium">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(notification.timestamp).toLocaleString('pt-BR')}
                                </p>
                              </div>
                              {!notification.read && (
                                <Badge className="bg-warning text-white text-xs">Novo</Badge>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Portfólio */}
          {userTokens.length > 0 && (
            <Card className="bg-background border-border">
              <CardHeader>
                <CardTitle>Meu Portfólio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userTokens.map((token: any) => (
                    <div key={token.id} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                      <div className="flex items-center gap-3">
                        <img src={token.image} alt={token.name} className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="font-medium">{token.name}</p>
                          <p className="text-sm text-muted-foreground">{token.quantity}x</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {(token.price * token.quantity).toFixed(2)}</p>
                        <Badge variant="outline" className={`text-xs ${
                          token.rarity === 'Legendary' ? 'border-orange-500 text-orange-500' :
                          token.rarity === 'Epic' ? 'border-purple-500 text-purple-500' :
                          token.rarity === 'Rare' ? 'border-blue-500 text-blue-500' :
                          token.rarity === 'Uncommon' ? 'border-green-500 text-green-500' :
                          'border-gray-500 text-gray-500'
                        }`}>
                          {token.rarity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Investido:</span>
                    <span className="text-primary">R$ {totalInvested.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};