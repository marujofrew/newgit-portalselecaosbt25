import React, { useState, useEffect } from 'react';

export default function CartaoPreview() {
  // Recuperar dados reais do localStorage
  const [passengerData, setPassengerData] = useState<any>(null);
  const [flightData, setFlightData] = useState<any>(null);

  useEffect(() => {
    // Recuperar dados do passageiro
    const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{}');
    const cidadeInfo = JSON.parse(localStorage.getItem('cidadeInfo') || '{}');
    const selectedDate = localStorage.getItem('selectedDate');
    
    // Calcular data do voo baseado na data de agendamento
    let flightDate = new Date();
    let flightTime = '13:20';
    
    if (selectedDate) {
      const appointmentDate = new Date(selectedDate);
      // Por padrão, usar opção 1 (2 dias antes)
      flightDate = new Date(appointmentDate);
      flightDate.setDate(appointmentDate.getDate() - 2);
    }
    
    // Calcular horário de embarque (25 minutos antes)
    const flightTimeparts = flightTime.split(':');
    const flightHour = parseInt(flightTimeparts[0]);
    const flightMinute = parseInt(flightTimeparts[1]);
    
    let boardingHour = flightHour;
    let boardingMinute = flightMinute - 25;
    
    if (boardingMinute < 0) {
      boardingMinute += 60;
      boardingHour -= 1;
    }
    
    const boardingTime = `${boardingHour.toString().padStart(2, '0')}:${boardingMinute.toString().padStart(2, '0')}`;
    
    // Determinar aeroporto de origem
    let originCode = 'GRU';
    let originCity = 'SÃO PAULO';
    
    if (cidadeInfo.localidade) {
      const cityLower = cidadeInfo.localidade.toLowerCase();
      if (cityLower.includes('goiânia') || cityLower.includes('goiania')) {
        originCode = 'GYN';
        originCity = 'GOIÂNIA';
      } else if (cityLower.includes('brasília') || cityLower.includes('brasilia')) {
        originCode = 'BSB';
        originCity = 'BRASÍLIA';
      } else if (cityLower.includes('recife')) {
        originCode = 'REC';
        originCity = 'RECIFE';
      } else if (cityLower.includes('salvador')) {
        originCode = 'SSA';
        originCity = 'SALVADOR';
      } else if (cityLower.includes('belo horizonte')) {
        originCode = 'CNF';
        originCity = 'BELO HORIZONTE';
      } else if (cityLower.includes('fortaleza')) {
        originCode = 'FOR';
        originCity = 'FORTALEZA';
      } else if (cityLower.includes('manaus')) {
        originCode = 'MAO';
        originCity = 'MANAUS';
      } else if (cityLower.includes('belém')) {
        originCode = 'BEL';
        originCity = 'BELÉM';
      } else if (cityLower.includes('porto alegre')) {
        originCode = 'POA';
        originCity = 'PORTO ALEGRE';
      } else if (cityLower.includes('curitiba')) {
        originCode = 'CWB';
        originCity = 'CURITIBA';
      } else if (cityLower.includes('campo grande')) {
        originCode = 'CGR';
        originCity = 'CAMPO GRANDE';
      } else if (cityLower.includes('florianópolis')) {
        originCode = 'FLN';
        originCity = 'FLORIANÓPOLIS';
      } else if (cityLower.includes('vitória')) {
        originCode = 'VIX';
        originCity = 'VITÓRIA';
      } else {
        originCity = cidadeInfo.localidade.toUpperCase();
      }
    }
    
    setPassengerData({
      name: responsavelData.nome || "PASSAGEIRO EXEMPLO",
      seatNumber: "1D"
    });
    
    setFlightData({
      date: flightDate,
      originCode,
      originCity,
      boardingTime,
      flightTime,
      ticketCode: `${originCode}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    });
  }, []);

  if (!passengerData || !flightData) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f1f5f9', 
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '20px',
          color: '#1e293b'
        }}>
          Modelo do Cartão de Embarque - Azul
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#64748b', 
          marginBottom: '30px'
        }}>
          Layout baseado no modelo oficial da Azul conforme prints fornecidos
        </p>
        
        {/* Cartão de embarque - Modelo Oficial Azul */}
        <div style={{
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
            <img src="/attached_assets/azul-logo-02_1750506382633.png" alt="Azul" style={{ height: '24px', width: 'auto' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>DATA</div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{flightData.date.toLocaleDateString('pt-BR')}</div>
              </div>
              <div>
                <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>VOO</div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>2768</div>
              </div>
            </div>
          </div>
          
          {/* Aeroportos */}
          <div style={{ marginBottom: '25px' }}>
            {/* Nomes das cidades em uma linha */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>{flightData.originCity}</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>SAO PAULO - GUARULHOS</div>
            </div>
            
            {/* Códigos dos aeroportos alinhados */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '48px', fontWeight: '400', lineHeight: '1', color: 'white' }}>{flightData.originCode}</div>
              
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
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>12:55</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>FIM EMBARQUE</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>13:20</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>SEÇÃO</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>D</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>ASSENTO</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>{passengerData.seatNumber}</div>
              </div>
            </div>
          </div>
          
          {/* Cliente e Status */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>CLIENTE</div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{passengerData.name.toUpperCase()}</div>
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
              NF2NPC - 94
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#1e293b' }}>
            Especificações do Layout
          </h3>
          <ul style={{ textAlign: 'left', color: '#64748b', fontSize: '12px', lineHeight: '1.5' }}>
            <li>• <strong>Primeira Parte:</strong> Header com logo oficial e "BOARDING PASS / CARTÃO DE EMBARQUE"</li>
            <li>• <strong>Segunda Parte:</strong> Aeroportos grandes (36px) com data do voo + linha PASSAGEIRO/VOO/ASSENTO</li>
            <li>• <strong>Terceira Parte:</strong> 3 linhas organizadas com todas as informações de embarque</li>
            <li>• <strong>Quarta Parte:</strong> QR Code profissional no canto inferior direito</li>
            <li>• <strong>Cor:</strong> Azul escuro oficial da Azul (#003d82 → #0052a3)</li>
            <li>• <strong>Fonte:</strong> Segoe UI para máxima legibilidade</li>
            <li>• <strong>Alinhamento:</strong> Todas as informações organizadas em linhas perfeitamente alinhadas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}