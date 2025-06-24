import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface PaymentData {
  id: string;
  pix_code: string;
  qr_code: string;
  expires_at: string;
  status: string;
  amount: number;
  formatted_amount: string;
}

interface PaymentStatus {
  is_paid: boolean;
  is_pending: boolean;
  is_failed: boolean;
  status: string;
  original_status: string;
  found: boolean;
  error?: string;
}

export default function PixPayment() {
  const [, setLocation] = useLocation();
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    createPayment();
  }, []);

  useEffect(() => {
    if (payment && !paymentStatus?.is_paid) {
      // Verificar status a cada 3 segundos
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [payment, paymentStatus]);

  const createPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados do responsável no localStorage
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      const selectedDate = localStorage.getItem('selectedDate');
      
      if (!responsavelData.nome || !responsavelData.email || !responsavelData.cpf) {
        throw new Error('Dados do responsável não encontrados');
      }

      // Criar pagamento PIX
      const response = await apiRequest('/api/pix/create', {
        method: 'POST',
        body: JSON.stringify({
          name: responsavelData.nome,
          email: responsavelData.email,
          cpf: responsavelData.cpf,
          amount: 2990, // R$ 29,90 em centavos
          description: `Inscrição SBT Casting - ${selectedDate}`,
          phone: responsavelData.telefone
        })
      });

      if (response.success) {
        setPayment(response.payment);
        console.log('💳 PIX criado:', response.payment.id);
      } else {
        throw new Error(response.message || 'Erro ao criar pagamento');
      }

    } catch (err) {
      console.error('Erro ao criar PIX:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!payment?.id) return;

    try {
      setCheckingStatus(true);

      const response = await apiRequest(`/api/pix/status/${payment.id}`, {
        method: 'GET'
      });

      if (response.success) {
        setPaymentStatus(response.payment);
        
        if (response.payment.is_paid) {
          console.log('✅ Pagamento confirmado!');
          // Salvar status no localStorage
          localStorage.setItem('pixPaymentStatus', 'paid');
          localStorage.setItem('pixPaymentId', payment.id);
          
          // Redirecionar para confirmação após 2 segundos
          setTimeout(() => {
            setLocation('/confirmacao-inscricao');
          }, 2000);
        }
      }

    } catch (err) {
      console.error('Erro ao verificar status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const copyPixCode = async () => {
    if (!payment?.pix_code) return;

    try {
      setCopying(true);
      await navigator.clipboard.writeText(payment.pix_code);
      
      // Feedback visual
      setTimeout(() => setCopying(false), 1000);
      
    } catch (err) {
      console.error('Erro ao copiar código PIX:', err);
      setCopying(false);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expirado';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Gerando PIX
            </h2>
            <p className="text-gray-600">
              Preparando seu pagamento...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Erro ao gerar PIX
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={createPayment}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!payment) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/sbt_logo.png" 
            alt="SBT" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Finalizar Pagamento
          </h1>
          <p className="text-gray-600">
            Complete sua inscrição com o pagamento via PIX
          </p>
        </div>

        {/* Status do Pagamento */}
        {paymentStatus?.is_paid ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center text-green-600 mb-3">
              <div className="text-4xl">✅</div>
            </div>
            <h3 className="text-xl font-semibold text-green-800 text-center mb-2">
              Pagamento Confirmado!
            </h3>
            <p className="text-green-700 text-center">
              Sua inscrição foi processada com sucesso. Redirecionando...
            </p>
          </div>
        ) : (
          <>
            {/* Informações do Pagamento */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Valor a pagar
                </h2>
                <div className="text-3xl font-bold text-blue-600">
                  {payment.formatted_amount}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Tempo restante: {formatTimeRemaining(payment.expires_at)}
                </p>
              </div>

              {/* QR Code */}
              {payment.qr_code && (
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    1. Escaneie o QR Code
                  </h3>
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img 
                      src={payment.qr_code} 
                      alt="QR Code PIX"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Use o app do seu banco para escanear
                  </p>
                </div>
              )}

              {/* Código PIX */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  2. Ou copie o código PIX
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="text-xs text-gray-600 font-mono break-all mb-2">
                    {payment.pix_code}
                  </div>
                </div>
                <button
                  onClick={copyPixCode}
                  disabled={copying}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    copying
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copying ? '✓ Copiado!' : 'Copiar código PIX'}
                </button>
              </div>
            </div>

            {/* Status de Verificação */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center mb-4">
                {checkingStatus ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                ) : (
                  <div className="text-2xl">⏳</div>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                Aguardando pagamento...
              </h3>
              <p className="text-gray-600 text-center text-sm">
                Verificamos automaticamente quando o pagamento for confirmado
              </p>
              
              {paymentStatus && (
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Status: {paymentStatus.original_status}
                </div>
              )}
            </div>
          </>
        )}

        {/* Botão de Voltar */}
        <div className="text-center mt-8">
          <button
            onClick={() => setLocation('/agendamento')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Voltar ao agendamento
          </button>
        </div>
      </div>
    </div>
  );
}