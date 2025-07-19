import { PaymentData } from '@/types/token';
import { supabase } from '@/integrations/supabase/client';

export class AbacatePayService {
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
      const { data, error } = await supabase.functions.invoke('abacate-pay', {
        body: {
          action: 'createPixQrCode',
          data: paymentData
        }
      });

      if (error) {
        throw new Error(`Supabase function error: ${error.message}`);
      }

      if (data.error) {
        throw new Error(`API error: ${data.error}`);
      }

      return data.data;
    } catch (error) {
      console.error('Error creating PIX QR Code:', error);
      throw error;
    }
  }

  static async checkPaymentStatus(paymentId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('abacate-pay', {
        body: {
          action: 'checkPaymentStatus',
          data: { paymentId }
        }
      });

      if (error) {
        throw new Error(`Supabase function error: ${error.message}`);
      }

      if (data.error) {
        throw new Error(`API error: ${data.error}`);
      }

      return data;
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  }
}