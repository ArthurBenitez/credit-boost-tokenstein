import { PaymentData } from '@/types/token';

const API_BASE_URL = 'https://api.abacatepay.com/v1';
const BEARER_TOKEN = 'YOUR_ABACATE_PAY_TOKEN'; // Em produção, isso deve vir de variáveis de ambiente

export class AbacatePayService {
  private static headers = {
    'Authorization': `Bearer ${BEARER_TOKEN}`,
    'Content-Type': 'application/json'
  };

  static async createCustomer(customerData: {
    name: string;
    cellphone: string;
    email: string;
    taxId: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/create`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(customerData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  static async createPixQrCode(paymentData: {
    amount: number;
    expiresIn: number;
    description: string;
    customer: {
      name: string;
      cellphone: string;
      email: string;
      taxId: string;
    };
  }): Promise<PaymentData> {
    try {
      const response = await fetch(`${API_BASE_URL}/pixQrCode/create`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating PIX QR Code:', error);
      throw error;
    }
  }

  static async checkPaymentStatus(paymentId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/pixQrCode/check/${paymentId}`, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
}