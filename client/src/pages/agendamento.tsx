import { useState } from 'react';
import { Link } from 'wouter';
import ChatBot from '@/components/ChatBot';
import sbtLogo from '@assets/sbt_logo.png';

export default function Agendamento() {
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Recuperar dados da cidade do localStorage
  const getUserCity = () => {
    try {
      const cityData = localStorage.getItem('userCityData');
      if (cityData) {
        const parsed = JSON.parse(cityData);
        return `${parsed.cidade} - ${parsed.uf}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar dados da cidade:', error);
    }
    return 'São Paulo - SP'; // fallback
  };

  // Recuperar dados completos do usuário
  const getUserData = () => {
    try {
      const cityData = localStorage.getItem('userCityData');
      if (cityData) {
        return JSON.parse(cityData);
      }
    } catch (error) {
      console.error('Erro ao recuperar dados do usuário:', error);
    }
    return null;
  };

  // Gerar datas disponíveis apenas aos sábados começando 1 mês no futuro
  const gerarDatasDisponiveis = () => {
    const datas = [];
    const hoje = new Date();
    
    // Começar exatamente 1 mês (30 dias) a partir de hoje
    const dataInicio = new Date(hoje);
    dataInicio.setDate(hoje.getDate() + 30);
    
    // Encontrar o primeiro sábado a partir da data de início
    let proximoSabado = new Date(dataInicio);
    while (proximoSabado.getDay() !== 6) { // 6 = sábado
      proximoSabado.setDate(proximoSabado.getDate() + 1);
    }
    
    // Gerar 8 sábados consecutivos
    for (let i = 0; i < 8; i++) {
      const sabado = new Date(proximoSabado);
      sabado.setDate(proximoSabado.getDate() + (i * 7)); // Adicionar 7 dias para cada sábado
      
      datas.push({
        valor: sabado.toISOString().split('T')[0],
        texto: sabado.toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
    }
    
    return datas;
  };

  // Função temporária para manter compatibilidade
  const gerarDatasDisponiveisOld = () => {
    const datas = [];
    const hoje = new Date();
    const umMesAFrente = new Date(hoje);
    umMesAFrente.setMonth(hoje.getMonth() + 1);
    
    const diasDoMes = [5, 12, 19, 26];
    
    diasDoMes.forEach(dia => {
      const data = new Date(umMesAFrente.getFullYear(), umMesAFrente.getMonth(), dia);
      
      // Verificar se é um dia útil, se não for, ajustar para o próximo dia útil
      while (data.getDay() === 0 || data.getDay() === 6) {
        data.setDate(data.getDate() + 1);
      }
      
      datas.push({
        valor: data.toISOString().split('T')[0],
        texto: data.toLocaleDateString('pt-BR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    });
    
    return datas;
  };

  const horariosDisponiveis = [
    { valor: '09:00', texto: '09:00 - Manhã' },
    { valor: '10:00', texto: '10:00 - Manhã' },
    { valor: '11:00', texto: '11:00 - Manhã' },
    { valor: '14:00', texto: '14:00 - Tarde' },
    { valor: '15:00', texto: '15:00 - Tarde' },
    { valor: '16:00', texto: '16:00 - Tarde' },
    { valor: '17:00', texto: '17:00 - Tarde' }
  ];

  const confirmarAgendamento = () => {
    if (!dataSelecionada || !horarioSelecionado) {
      alert('Por favor, selecione uma data e horário.');
      return;
    }

    setLoading(true);
    
    // Salvar dados do agendamento
    localStorage.setItem('selectedDate', dataSelecionada);
    localStorage.setItem('selectedTime', horarioSelecionado);
    
    // Reset AGRESSIVO do chat bot para começar conversa do zero
    console.log('🔄 Limpando TODAS as chaves do chat para nova conversa');
    
    // Limpar apenas chaves específicas do chat para não quebrar outras funcionalidades
    const chatKeysToRemove = [
      'chatState', 'chatbotMessages', 'chatbotCurrentStep', 'chatbotSelectedTransport',
      'chatbotSelectedFlightOption', 'chatbotHasBaggage', 'chatbotShowQuickOptions',
      'chatbotShowPaymentStatus', 'chatbotPaymentTimer', 'chatMessages', 'chatStep',
      'chatTransport', 'chatFlight', 'chatBaggage', 'chatPayment'
    ];
    
    chatKeysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Removido: ${key}`);
      }
    });
    
    // Remover chaves específicas conhecidas
    localStorage.removeItem('chatState');
    localStorage.removeItem('chatbotMessages');
    localStorage.removeItem('chatbotCurrentStep');
    localStorage.removeItem('chatbotSelectedTransport');
    localStorage.removeItem('chatbotSelectedFlightOption');
    localStorage.removeItem('chatbotHasBaggage');
    localStorage.removeItem('chatbotShowQuickOptions');
    localStorage.removeItem('chatbotShowPaymentStatus');
    localStorage.removeItem('chatbotPaymentTimer');
    
    // Marcar que agendamento foi confirmado - chatbot só funciona a partir daqui
    localStorage.setItem('agendamentoConfirmado', 'true');
    
    // Abrir o chat bot imediatamente após confirmação
    setTimeout(() => {
      setLoading(false);
      
      setChatBotOpen(true);
      localStorage.setItem('chatBotOpened', 'true');
      console.log('🎯 ChatBot aberto após agendamento');
    }, 1000);
  };

  // Função para scroll automático para o botão de confirmar
  const scrollToConfirmButton = () => {
    setTimeout(() => {
      const confirmButton = document.getElementById('confirm-button');
      if (confirmButton) {
        confirmButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        // Scroll adicional para garantir que o botão fique bem visível
        setTimeout(() => {
          window.scrollBy({ top: -50, behavior: 'smooth' });
        }, 300);
      }
    }, 200);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src={sbtLogo} 
              alt="SBT Logo" 
              className="h-16 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-800">Agendamento do Teste</h1>
            <p className="text-gray-600 mt-2">
              Selecione a data e horário que melhor se adequa à sua agenda
            </p>
          </div>

          {/* Formulário de Agendamento */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <h2 className="font-semibold text-gray-800 text-lg mb-6">Escolha sua Data e Horário</h2>
            
            <div className="space-y-6">
              {/* Seleção de Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Data do Teste *
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                  {gerarDatasDisponiveis().map((data) => (
                    <label key={data.valor} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                      <input
                        type="radio"
                        name="data"
                        value={data.valor}
                        checked={dataSelecionada === data.valor}
                        onChange={(e) => setDataSelecionada(e.target.value)}
                        className="mr-3 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 capitalize">{data.texto}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Seleção de Horário */}
              {dataSelecionada && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Horário do Teste *
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {horariosDisponiveis.map((horario) => (
                      <label key={horario.valor} className="flex items-center cursor-pointer p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                        <input
                          type="radio"
                          name="horario"
                          value={horario.valor}
                          checked={horarioSelecionado === horario.valor}
                          onChange={(e) => {
                            setHorarioSelecionado(e.target.value);
                            scrollToConfirmButton();
                          }}
                          className="mr-3 text-blue-600"
                        />
                        <span className="text-sm text-gray-700">{horario.texto}</span>
                      </label>
                    ))}
                  </div>

                  {/* Botão Confirmar Agendamento */}
                  <div className="mb-6">
                    <button 
                      id="confirm-button"
                      onClick={confirmarAgendamento}
                      disabled={!dataSelecionada || !horarioSelecionado || loading}
                      className={`w-full px-4 py-3 rounded-md font-medium transition duration-200 flex items-center justify-center ${
                        (dataSelecionada && horarioSelecionado && !loading)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processando...
                        </>
                      ) : (
                        'Confirmar Agendamento'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Informações Importantes */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="font-medium text-blue-800 mb-2">Informações Importantes:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Chegue 30 minutos antes do horário agendado</li>
                  <li>• Traga documento de identidade do responsável e certidão de nascimento da criança</li>
                  <li>• O teste terá duração aproximada de 2 horas</li>
                  <li>• Local: Estúdios SBT - Osasco/SP</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bot */}
      {chatBotOpen && (
        <ChatBot 
          key={`agendamento-chat-${Date.now()}`}
          isOpen={chatBotOpen} 
          onClose={() => setChatBotOpen(false)}
          userCity={getUserCity()}
          userData={getUserData()}
          selectedDate={dataSelecionada}
        />
      )}
    </main>
  );
}