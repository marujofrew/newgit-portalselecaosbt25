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
      "User-Agent": "SBT-Casting-Platform/1.0.0",
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

    const cpf = data.cpf.replace(/\D/g, "");
    const phone = data.phone?.replace(/\D/g, "") || "11999999999";

    const paymentData = {
      name: data.name.trim(),
      email: data.email.trim(),
      cpf: cpf,
      phone: phone,
      paymentMethod: "PIX",
      amount: data.amount,
      traceable: true,
      items: [
        {
          title: data.description || "Inscrição SBT Casting",
          quantity: 1,
          unitPrice: data.amount,
          tangible: false
        }
      ],
      // Dados de endereço padrão (obrigatórios pela API)
      cep: "01001-000",
      street: "Rua da Sé",
      number: "1",
      complement: "",
      district: "Sé", 
      city: "São Paulo",
      state: "SP",
      // Metadados
      utmQuery: "",
      checkoutUrl: "",
      referrerUrl: "",
      externalId: `sbt-casting-${Date.now()}`,
      postbackUrl: "",
      fingerPrints: []
    };

    try {
      console.log(`[For4Payments] Criando pagamento PIX para ${data.email}`);
      console.log(`[For4Payments] Valor: R$ ${(data.amount / 100).toFixed(2)}`);

      const response = await fetch(`${this.API_URL}/transaction.purchase`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData)
      });

      console.log(`[For4Payments] Status HTTP: ${response.status}`);

      if (!response.ok) {
        const errorMessage = await this.extractErrorMessage(response);
        console.log(`[For4Payments] Erro: ${errorMessage}`);
        throw new Error(`API Error: ${errorMessage}`);
      }

      const responseData = await response.json();
      console.log(`[For4Payments] Pagamento criado com sucesso`);

      return this.parsePaymentResponse(responseData);

    } catch (error) {
      console.error(`[For4Payments] Erro na requisição:`, error);
      throw error;
    }
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    if (response.status === 401) {
      return "Falha na autenticação. Verifique sua chave de API.";
    } else if (response.status === 400) {
      return "Dados inválidos enviados para a API.";
    } else if (response.status === 500) {
      return "Erro interno do servidor For4Payments.";
    }

    try {
      const errorData = await response.json();
      return (
        errorData.message ||
        errorData.error ||
        errorData.errors?.message ||
        "Erro desconhecido"
      );
    } catch {
      return await response.text() || "Erro desconhecido";
    }
  }

  private parsePaymentResponse(responseData: any): PaymentResponse {
    // Extrair códigos PIX com múltiplos fallbacks
    const pix_code = (
      responseData.pix?.code ||
      responseData.pixData?.copyPaste ||
      responseData.pixCode ||
      responseData.copy_paste ||
      responseData.code ||
      ""
    );

    const pix_qr_code = (
      responseData.pix?.qrCode ||
      responseData.pix?.base64Image ||
      responseData.qrCode?.imageUrl ||
      responseData.qr_code_image ||
      responseData.pixQrCode ||
      ""
    );

    // Extrair data de expiração
    const expires_at = (
      responseData.expiration ||
      responseData.expiresAt ||
      new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    );

    // Extrair status
    const status = (responseData.status || "pending").toLowerCase();

    // Extrair ID da transação
    const payment_id = (
      responseData.id ||
      responseData.transactionId ||
      responseData._id ||
      `txn-${Date.now()}`
    );

    return {
      id: String(payment_id),
      pix_code,
      pix_qr_code,
      expires_at,
      status
    };
  }

  async checkPaymentStatus(payment_id: string): Promise<PaymentStatus> {
    if (!payment_id?.trim()) {
      throw new Error("ID do pagamento é obrigatório");
    }

    try {
      const url = `${this.API_URL}/transaction.getPayment?id=${payment_id}`;
      console.log(`[For4Payments] Verificando status: ${payment_id}`);

      const response = await fetch(url, {
        headers: this.getHeaders()
      });

      console.log(`[For4Payments] Status HTTP: ${response.status}`);

      // Pagamento não encontrado
      if (response.status === 404) {
        console.log(`[For4Payments] Pagamento não encontrado`);
        return { status: "pending", original_status: "not_found", found: false };
      }

      // Outros erros HTTP
      if (!response.ok) {
        console.log(`[For4Payments] Erro ao verificar: ${response.status}`);
        return { status: "pending", original_status: "error", found: false, error: `HTTP ${response.status}` };
      }

      // Processar resposta
      const paymentData = await response.json();
      return this.parseStatusResponse(paymentData);

    } catch (error) {
      console.error(`[For4Payments] Erro ao verificar status:`, error);
      return { status: "pending", original_status: "error", found: false, error: String(error) };
    }
  }

  private parseStatusResponse(paymentData: any): PaymentStatus {
    // Mapeamento de status da API para status padronizados
    const statusMapping: Record<string, PaymentStatus['status']> = {
      "pending": "pending",
      "processing": "pending",
      "waiting": "pending",
      "approved": "completed",
      "completed": "completed", 
      "paid": "completed",
      "success": "completed",
      "expired": "failed",
      "failed": "failed",
      "error": "failed",
      "canceled": "cancelled",
      "cancelled": "cancelled",
      "refunded": "cancelled"
    };

    const currentStatus = (paymentData.status || "pending").toLowerCase();
    const mappedStatus = statusMapping[currentStatus] || "pending";

    // Extrair códigos PIX
    const pixCode = (
      paymentData.pix?.code ||
      paymentData.pixData?.copyPaste ||
      paymentData.pixCode ||
      paymentData.copy_paste ||
      paymentData.code
    );

    const pixQrCode = (
      paymentData.pix?.qrCode ||
      paymentData.pix?.base64Image ||
      paymentData.qrCode?.imageUrl ||
      paymentData.qr_code_image ||
      paymentData.pixQrCode
    );

    // Construir resposta
    const result: PaymentStatus = {
      status: mappedStatus,
      original_status: currentStatus,
      found: true
    };

    // Adicionar códigos PIX se disponíveis
    if (pixCode) result.pixCode = pixCode;
    if (pixQrCode) result.pixQrCode = pixQrCode;

    // Adicionar informações adicionais
    if (paymentData.amount) result.amount = paymentData.amount;
    if (paymentData.paidAt) result.paidAt = paymentData.paidAt;
    if (paymentData.expiration) result.expiresAt = paymentData.expiration;

    console.log(`[For4Payments] Status processado: ${mappedStatus}`);
    return result;
  }

  async getPaymentSummary(payment_id: string) {
    const statusData = await this.checkPaymentStatus(payment_id);

    return {
      payment_id,
      is_paid: statusData.status === "completed",
      is_pending: statusData.status === "pending",
      is_failed: ["failed", "cancelled"].includes(statusData.status),
      status: statusData.status,
      original_status: statusData.original_status,
      pix_code: statusData.pixCode,
      qr_code: statusData.pixQrCode,
      amount: statusData.amount,
      paid_at: statusData.paidAt,
      expires_at: statusData.expiresAt,
      found: statusData.found,
      error: statusData.error
    };
  }
}

// Função de conveniência para uso rápido
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
    phone,
    description
  };

  return api.createPixPayment(paymentData);
}