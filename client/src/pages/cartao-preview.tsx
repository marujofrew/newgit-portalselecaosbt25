import React, { useState, useEffect } from 'react';
import { Download, Plane, Calendar, Clock, MapPin, QrCode, User, FileText, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import ChatBot from '../components/ChatBot';
import { ChatStorage } from '../utils/chatStorage';


import azulLogo from '@assets/azul-logo-02_1750506382633.png';
import sbtLogo from '@assets/sbt_logo.png';

interface Passenger {
  name: string;
  type: string;
  isMain: boolean;
}

interface FlightData {
  flightDate: Date;
  flightTime: string;
  boardingTime: string;
  originCode: string;
  originCity: string;
  destinationCode: string;
  destinationCity: string;
}

export default function CartaoPreview() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChatBot, setShowChatBot] = useState(false);
  // Chat sempre inicia minimizado
  const [chatBotMinimized, setChatBotMinimized] = useState(true);


  const [userCity, setUserCity] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    loadBoardingPassData();
    
    // Marcar página como ativa imediatamente
    ChatStorage.markAsActive('/cartao-preview');
    
    // Verificar se deve mostrar chatbot (só se agendamento foi confirmado)
    const agendamentoConfirmado = localStorage.getItem('agendamentoConfirmado');
    console.log('🎯 Agendamento confirmado:', agendamentoConfirmado);
    
    if (agendamentoConfirmado === 'true') {
      // Verificar se há conversa da página de agendamento
      const hasExistingChat = ChatStorage.hasConversation();
      console.log('📋 Conversa da página anterior encontrada:', hasExistingChat);
      
      // Mostrar chatbot automaticamente
      setShowChatBot(true);
      
      if (hasExistingChat) {
        console.log('✅ Abrindo chat com conversa anterior da página de agendamento');
        setChatBotMinimized(false); // Abrir expandido para mostrar a conversa
        
        // Debug: mostrar detalhes da conversa
        const state = ChatStorage.getState();
        console.log('📊 Detalhes da conversa:', {
          totalMensagens: state.messages?.length,
          passoAtual: state.currentStep,
          transporteSelecionado: state.selectedTransport,
          vooSelecionado: state.selectedFlightOption
        });
      } else {
        console.log('⚠️ Nenhuma conversa anterior encontrada');
        setChatBotMinimized(true);
      }
    }
    
    // Scroll automático para o botão de download após 4 segundos
    const scrollTimer = setTimeout(() => {
      const downloadButton = document.querySelector('#download-button-below');
      if (downloadButton) {
        downloadButton.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 4000);

    // Timer para abrir chatbot após 15 segundos se ainda não foi aberto
    let chatBotTimer: NodeJS.Timeout;
    if (agendamentoConfirmado === 'true' && chatBotMinimized) {
      chatBotTimer = setTimeout(() => {
        console.log('⏰ Abrindo chat automaticamente após 15 segundos');
        setChatBotMinimized(false);
      }, 15000);
    }

    return () => {
      clearTimeout(scrollTimer);
      if (chatBotTimer) clearTimeout(chatBotTimer);
    };
  }, [chatBotMinimized]);

  const loadBoardingPassData = () => {
    try {
      // Carregar dados do responsável
      const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
      const candidatosData = JSON.parse(localStorage.getItem('candidatos') || '[]');
      const storedSelectedDate = localStorage.getItem('selectedDate');
      const storedUserCity = localStorage.getItem('userCity');
      
      // Salvar dados para o chatbot
      setUserData(responsavelData);
      setUserCity(storedUserCity || '');
      setSelectedDate(storedSelectedDate || '');

      // Criar lista de passageiros
      const passengersList: Passenger[] = [];
      
      if (responsavelData.nome) {
        passengersList.push({
          name: responsavelData.nome.toUpperCase(),
          type: 'Responsável',
          isMain: true
        });
      }

      candidatosData.forEach((candidato: any, index: number) => {
        if (candidato.nome) {
          passengersList.push({
            name: candidato.nome.toUpperCase(),
            type: `Candidato ${index + 1}`,
            isMain: false
          });
        }
      });

      setPassengers(passengersList);

      // Calcular dados do voo
      if (storedSelectedDate) {
        const flightDate = new Date(storedSelectedDate);
        flightDate.setDate(flightDate.getDate() - 1); // Um dia antes do agendamento
        
        const boardingDate = new Date(flightDate);
        boardingDate.setMinutes(boardingDate.getMinutes() - 25); // 25 min antes

        setFlightData({
          flightDate,
          flightTime: "08:30",
          boardingTime: boardingDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          originCode: "GYN",
          originCity: storedUserCity?.toUpperCase() || "GOIÂNIA",
          destinationCode: "GRU",
          destinationCity: "SÃO PAULO"
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados dos cartões:', error);
      setLoading(false);
    }
  };

  const generateQRPattern = () => {
    const patterns = ['█▄█▄', '▄█▄█', '█▄▄█', '▄██▄', '█▄█▄'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  };

  const downloadAllCards = async () => {
    try {
      for (let i = 0; i < passengers.length; i++) {
        const cardElement = document.querySelector(`#boarding-card-${i}`);
        if (cardElement) {
          const canvas = await html2canvas(cardElement as HTMLElement, {
            backgroundColor: null,
            scale: 2,
            useCORS: true,
            allowTaint: true,
            width: 300,
            height: 520
          });
          
          const link = document.createElement('a');
          link.download = `cartao-embarque-${passengers[i].name.replace(/\s+/g, '-')}.png`;
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Pequeno delay entre downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Abrir chatbot após download concluído
      setTimeout(() => {
        setChatBotMinimized(false);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao baixar cartões:', error);
      alert('Erro ao gerar imagens dos cartões. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderBottomColor: '#001f3f' }}></div>
          <p className="text-xl">Carregando seus cartões de embarque...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={sbtLogo} alt="SBT" className="h-12" />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-800">Cartões de Embarque</h1>
                <p className="text-gray-600">Sistema Brasileiro de Televisão</p>
              </div>
            </div>
            <button
              onClick={() => {
                downloadAllCards();
                setChatBotMinimized(false);
              }}
              className="flex items-center space-x-2 text-white px-6 py-3 rounded-lg transition-colors font-semibold hover:opacity-90"
              style={{ backgroundColor: '#001f3f' }}
            >
              <Download size={20} />
              <span>Baixar Todos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-xl p-6 shadow-lg text-white" style={{ backgroundColor: '#001f3f' }}>
            <div className="flex items-center space-x-3 mb-3">
              <Calendar className="text-white" size={24} />
              <span className="font-semibold text-white">Data do Voo</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {flightData?.flightDate.toLocaleDateString('pt-BR')}
            </p>
            <p className="text-gray-300">Horário: {flightData?.flightTime}</p>
          </div>

          <div className="rounded-xl p-6 shadow-lg text-white" style={{ backgroundColor: '#001f3f' }}>
            <div className="flex items-center space-x-3 mb-3">
              <MapPin className="text-white" size={24} />
              <span className="font-semibold text-white">Rota</span>
            </div>
            <p className="text-lg font-bold text-white">
              {flightData?.originCode} → {flightData?.destinationCode}
            </p>
            <p className="text-gray-300">{flightData?.originCity} - {flightData?.destinationCity}</p>
          </div>

          <div className="rounded-xl p-6 shadow-lg text-white" style={{ backgroundColor: '#001f3f' }}>
            <div className="flex items-center space-x-3 mb-3">
              <User className="text-white" size={24} />
              <span className="font-semibold text-white">Passageiros</span>
            </div>
            <p className="text-2xl font-bold text-white">{passengers.length}</p>
            <p className="text-gray-300">Cartões de embarque</p>
          </div>
        </div>

        {/* Boarding Pass Cards - Layout Original */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Seus Cartões de Embarque</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {passengers.map((passenger, index) => (
              <div key={index} className="relative">
                <div 
                  className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedCard(index)}
                >
                  {/* Cartão de embarque - Modelo Oficial Azul Original */}
                  <div 
                    id={`boarding-card-${index}`}
                    style={{
                    width: '300px', 
                    height: '520px', 
                    background: '#001f3f', 
                    borderRadius: '12px', 
                    padding: '20px', 
                    color: 'white', 
                    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", 
                    position: 'relative', 
                    margin: '0 auto', 
                    boxShadow: '0 12px 32px rgba(0,0,0,0.4)'
                  }}>
                    
                    {/* Header - Layout oficial */}
                    <div style={{
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      marginBottom: '18px'
                    }}>
                      <img src={azulLogo} alt="Azul" style={{ height: '24px', width: 'auto' }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', textAlign: 'center' }}>
                        <div>
                          <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>DATA</div>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{flightData?.flightDate.toLocaleDateString('pt-BR')}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>VOO</div>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>AD{1200 + index}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Aeroportos */}
                    <div style={{ marginBottom: '25px' }}>
                      {/* Nomes das cidades em uma linha */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>{flightData?.originCity}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>SAO PAULO - GUARULHOS</div>
                      </div>
                      
                      {/* Códigos dos aeroportos alinhados */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '48px', fontWeight: '400', lineHeight: '1', color: 'white' }}>{flightData?.originCode}</div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 15px' }}>
                          <div style={{ fontSize: '20px', color: '#60a5fa' }}>✈</div>
                        </div>
                        
                        <div style={{ fontSize: '48px', fontWeight: '400', lineHeight: '1', color: 'white' }}>GRU</div>
                      </div>
                    </div>
                    
                    {/* Linha de informações de embarque */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>INÍCIO EMBARQUE</div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>{flightData?.boardingTime}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>FIM EMBARQUE</div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>{flightData?.flightTime}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>SEÇÃO</div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>D</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>ASSENTO</div>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>{index + 1}D</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cliente e Status */}
                    <div style={{ marginBottom: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                          <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>CLIENTE</div>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{passenger.name}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', fontWeight: '600', color: '#60a5fa' }}>Diamante</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* QR Code centralizado na parte inferior */}
                    <div style={{
                      position: 'absolute',
                      bottom: '25px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '8px'
                      }}>
                        <img 
                          src="/qr-code.png" 
                          alt="QR Code" 
                          style={{
                            width: '110px',
                            height: '110px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        color: 'white',
                        letterSpacing: '1px'
                      }}>
                        {flightData?.originCode}{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Download Button Below Cards */}
          <div className="flex justify-center mt-8">
            <button
              id="download-button-below"
              onClick={() => {
                downloadAllCards();
                setChatBotMinimized(false);
              }}
              className="flex items-center space-x-3 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 hover:opacity-90"
              style={{ backgroundColor: '#001f3f' }}
            >
              <Download size={24} />
              <span>Baixar Todos os Cartões</span>
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl p-6 mt-8 shadow-lg">
          <div className="flex items-start space-x-3">
            <FileText className="text-blue-600 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Instruções Importantes</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Chegue ao aeroporto com pelo menos 2 horas de antecedência</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Apresente documento de identidade original com foto</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Mantenha este cartão de embarque até o final da viagem</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Em caso de dúvidas, procure o balcão da Azul no aeroporto</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for detailed view */}
      {selectedCard !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Cartão de Embarque</h3>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide">Passageiro</p>
                  <p className="text-lg font-bold text-gray-900">{passengers[selectedCard]?.name}</p>
                  <p className="text-sm text-blue-600">{passengers[selectedCard]?.type}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Voo</p>
                    <p className="font-semibold">AD{1200 + selectedCard}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Assento</p>
                    <p className="font-semibold">{selectedCard + 1}D</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-semibold">{flightData?.flightDate.toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Horário</p>
                    <p className="font-semibold">{flightData?.flightTime}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Rota</p>
                  <p className="font-semibold">{flightData?.originCode} → {flightData?.destinationCode}</p>
                  <p className="text-sm text-gray-600">{flightData?.originCity} - {flightData?.destinationCity}</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedCard(null)}
                className="w-full mt-6 text-white py-3 rounded-lg font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: '#001f3f' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ChatBot */}
      {showChatBot && (
        <ChatBot
          isOpen={showChatBot}
          onClose={() => setShowChatBot(false)}
          userCity={userCity}
          userData={userData}
          selectedDate={selectedDate}
          isMinimized={chatBotMinimized}
          onMinimize={() => setChatBotMinimized(true)}
          onExpand={() => setChatBotMinimized(false)}
        />
      )}
    </div>
  );
}