/**
 * For4Payments PIX Integration
 * 
 * Integração completa com a API For4Payments para pagamentos PIX
 * Baseado na documentação oficial fornecida
 */

interface PaymentRequestData {
  name: string;
  email: string;
  cpf: string;
  amount: number; // Valor em centavos
  phone?: string;
  description?: string;
}

interface PaymentResponse {
  id: string;
  pix_code: string;
  pix_qr_code: string;
  expires_at: string;
  status: string;
}

interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  original_status: string;
  found: boolean;
  pixCode?: string;
  pixQrCode?: string;
  amount?: number;
  paidAt?: string;
  expiresAt?: string;
  error?: string;
}

export class For4PaymentsAPI {
  private readonly API_URL = "https://app.for4payments.com.br/api/v1";
  private readonly secret_key: string;

  constructor(secret_key: string) {
    if (!secret_key || secret_key.length < 10) {
      throw new Error("Token de autenticação inválido");
    }
    this.secret_key = secret_key;
  }

  static fromEnv(): For4PaymentsAPI {
    const secret_key = process.env.FOR4PAYMENTS_SECRET_KEY;
    
    if (!secret_key) {
      throw new Error("Chave de API FOR4PAYMENTS_SECRET_KEY não configurada");
    }
    
    return new For4PaymentsAPI(secret_key);
  }

  private getHeaders(): Record<string, string> {
    return {
      "Authorization": this.secret_key,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "For4Payments-NodeJS-SDK/1.0.0",
      "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
    };
  }

  private validatePaymentData(data: PaymentRequestData): void {
    if (!data.name?.trim()) {
      throw new Error("Nome é obrigatório");
    }
    if (!data.email?.trim() || !data.email.includes("@")) {
      throw new Error("Email válido é obrigatório");
    }
    if (!data.cpf?.trim()) {
      throw new Error("CPF é obrigatório");
    }
    if (!data.amount || data.amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    // Validar CPF
    const cpf = data.cpf.replace(/\D/g, "");
    if (cpf.length !== 11) {
      throw new Error("CPF deve conter exatamente 11 dígitos");
    }
  }

  async createPixPayment(data: PaymentRequestData): Promise<PaymentResponse> {
    this.validatePaymentData(data);

    try {
      console.log('🔄 Criando pagamento PIX via For4Payments...');
      console.log('📊 Dados do pagamento:', { ...data, cpf: data.cpf?.substring(0, 3) + '***' });

      const cpf = data.cpf.replace(/\D/g, "");
      const phone = data.phone?.replace(/\D/g, "") || "11999999999";

      const paymentData = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        cpf: cpf,
        phone: phone,
        paymentMethod: "PIX",
        amount: data.amount,
        traceable: true,
        items: [
          {
            title: (data.description || "Pagamento PIX").replace(/\*\*/g, ""),
            quantity: 1,
            unitPrice: data.amount,
            tangible: false
          }
        ],
        cep: "01001-000",
        street: "Rua da Sé",
        number: "1",
        complement: "",
        district: "Sé",
        city: "São Paulo",
        state: "SP",
        utmQuery: "",
        checkoutUrl: "",
        referrerUrl: "",
        externalId: `sbt-${Date.now()}`,
        postbackUrl: "",
        fingerPrints: []
      };

      console.log('📤 Enviando request para:', `${this.API_URL}/transaction.purchase`);

      const response = await fetch(`${this.API_URL}/transaction.purchase`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });

      console.log('📡 Status da resposta:', response.status);
      
      // Processar resposta
      const responseText = await response.text();

      if (!response.ok) {
        console.error('❌ Erro na API For4Payments - Status:', response.status);
        console.error('❌ Response text:', responseText);
        throw new Error(`Erro da API For4Payments: Status ${response.status} - ${responseText}`);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('✅ PIX criado com sucesso - ID:', responseData.id);
      } catch (e) {
        console.error('❌ Erro ao fazer parse da resposta JSON:', e);
        throw new Error(`Resposta inválida da API: ${responseText}`);
      }

      return this.parsePaymentResponse(responseData);

    } catch (error) {
      console.error('💥 Erro ao criar pagamento PIX:', error);
      throw error;
    }
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    try {
      const errorData = await response.json();
      return errorData.message || errorData.error || 'Erro desconhecido da API';
    } catch {
      return `Erro HTTP ${response.status}: ${response.statusText}`;
    }
  }

  private parsePaymentResponse(responseData: any): PaymentResponse {
    // Extrair códigos PIX com múltiplos fallbacks conforme documentação
    const pixCode = (
      responseData.pix?.code ||
      responseData.pixData?.copyPaste ||
      responseData.pixCode ||
      responseData.copy_paste ||
      responseData.code ||
      ""
    );
    
    const pixQrCode = (
      responseData.pix?.qrCode ||
      responseData.pix?.base64Image ||
      responseData.qrCode?.imageUrl ||
      responseData.qr_code_image ||
      responseData.pixQrCode ||
      ""
    );
    
    const expiresAt = (
      responseData.expiration ||
      responseData.expiresAt ||
      new Date(Date.now() + 30 * 60 * 1000).toISOString()
    );
    
    const paymentId = (
      responseData.id ||
      responseData.transactionId ||
      responseData._id ||
      `txn-${Date.now()}`
    );

    return {
      id: String(paymentId),
      pix_code: pixCode,
      pix_qr_code: pixQrCode,
      expires_at: expiresAt,
      status: responseData.status?.toLowerCase() || 'pending'
    };
  }

  async checkPaymentStatus(payment_id: string): Promise<PaymentStatus> {
    try {
      console.log(`🔍 Verificando status do pagamento: ${payment_id}`);
      
      const response = await fetch(`${this.API_URL}/transaction.getPayment?id=${payment_id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      console.log('📡 Status da resposta:', response.status);

      if (response.status === 404) {
        console.log('❌ Pagamento não encontrado');
        return this.parseStatusResponse({ status: 'not_found', found: false });
      }

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        console.error('❌ Erro ao verificar status:', errorMessage);
        throw new Error(`Erro da API: ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log('✅ Status verificado:', responseData);

      return this.parseStatusResponse(responseData);

    } catch (error) {
      console.error('💥 Erro ao verificar status:', error);
      return this.parseStatusResponse({ status: 'error', error: error.message, found: false });
    }
  }

  private parseStatusResponse(paymentData: any): PaymentStatus {
    // Mapeamento de status da API para status padronizados
    const statusMapping = {
      "pending": "pending",
      "processing": "pending", 
      "waiting": "pending",
      "approved": "completed",
      "completed": "completed",
      "paid": "completed",
      "success": "completed",
      "confirmed": "completed",
      "failed": "failed",
      "error": "failed",
      "cancelled": "cancelled",
      "canceled": "cancelled",
      "expired": "cancelled"
    };

    const originalStatus = paymentData.status?.toLowerCase() || "pending";
    const mappedStatus = statusMapping[originalStatus] || "pending";

    const result: PaymentStatus = {
      status: mappedStatus as 'pending' | 'completed' | 'failed' | 'cancelled',
      original_status: originalStatus,
      found: paymentData.found !== false,
      error: paymentData.error
    };

    // Adicionar dados extras se disponíveis
    if (paymentData.pixCode) result.pixCode = paymentData.pixCode;
    if (paymentData.pixQrCode) result.pixQrCode = paymentData.pixQrCode;
    if (paymentData.amount) result.amount = paymentData.amount;
    if (paymentData.paidAt) result.paidAt = paymentData.paidAt;
    if (paymentData.expiresAt) result.expiresAt = paymentData.expiresAt;

    return result;
  }

  async getPaymentSummary(payment_id: string) {
    const status = await this.checkPaymentStatus(payment_id);
    return {
      id: payment_id,
      is_paid: status.status === 'completed',
      is_pending: status.status === 'pending',
      is_failed: status.status === 'failed',
      status: status.status,
      original_status: status.original_status,
      found: status.found,
      error: status.error
    };
  }
}

export async function createQuickPixPayment(
  name: string,
  email: string,
  cpf: string,
  amount: number,
  description?: string,
  phone?: string
): Promise<PaymentResponse> {
  const api = For4PaymentsAPI.fromEnv();
  
  const paymentData: PaymentRequestData = {
    name,
    email,
    cpf,
    amount,
    description: description || "Pagamento SBT Casting",
    phone
  };

  return await api.createPixPayment(paymentData);
}