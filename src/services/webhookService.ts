// Webhook handler simulado para AbacatePay
export class WebhookService {
  static async setupWebhook() {
    // Dados do webhook configurados conforme solicitado
    const webhookConfig = {
      name: "7pay",
      url: "https://arthurbenitez.github.io/tokenstein-definitivo/",
      secret: "arthur7pay"
    };
    
    console.log('Webhook configurado:', webhookConfig);
    return webhookConfig;
  }

  static async handleWebhook(data: any) {
    // Simular processamento do webhook
    console.log('Webhook recebido:', data);
    
    // Verificar se é uma confirmação de pagamento
    if (data.event === 'payment.confirmed' || data.status === 'approved') {
      // Processar pagamento confirmado
      const paymentId = data.payment_id || data.id;
      const amount = data.amount || data.value;
      
      // Buscar dados do pagamento no localStorage
      const pendingPayments = JSON.parse(localStorage.getItem('tokenstein_pending_payments') || '{}');
      
      if (pendingPayments[paymentId]) {
        const paymentData = pendingPayments[paymentId];
        
        // Adicionar créditos ao usuário
        const users = JSON.parse(localStorage.getItem('tokenstein_all_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.email === paymentData.customerEmail);
        
        if (userIndex !== -1) {
          users[userIndex].credits = (users[userIndex].credits || 0) + paymentData.credits;
          localStorage.setItem('tokenstein_all_users', JSON.stringify(users));
          
          // Atualizar usuário atual se for o mesmo
          const currentUser = JSON.parse(localStorage.getItem('tokenstein_user') || 'null');
          if (currentUser && currentUser.email === paymentData.customerEmail) {
            currentUser.credits = users[userIndex].credits;
            localStorage.setItem('tokenstein_user', JSON.stringify(currentUser));
          }
        }
        
        // Remover pagamento pendente
        delete pendingPayments[paymentId];
        localStorage.setItem('tokenstein_pending_payments', JSON.stringify(pendingPayments));
        
        return { success: true, message: 'Pagamento processado com sucesso' };
      }
    }
    
    return { success: false, message: 'Evento não reconhecido' };
  }

  // Simular recebimento de webhook após alguns segundos
  static simulateWebhookReceived(paymentId: string, amount: number) {
    setTimeout(() => {
      const webhookData = {
        event: 'payment.confirmed',
        payment_id: paymentId,
        amount: amount,
        status: 'approved',
        timestamp: new Date().toISOString()
      };
      
      this.handleWebhook(webhookData);
      
      // Disparar evento customizado para notificar a UI
      window.dispatchEvent(new CustomEvent('webhook-received', { 
        detail: webhookData 
      }));
    }, 3000); // Simular delay de 3 segundos
  }
}