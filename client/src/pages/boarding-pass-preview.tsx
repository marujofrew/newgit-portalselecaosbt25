export default function BoardingPassPreview() {
  // Recuperar dados reais salvos
  const responsavelData = JSON.parse(localStorage.getItem('responsavelData') || '{"nome": "PASSAGEIRO EXEMPLO"}');
  const cidadeInfo = JSON.parse(localStorage.getItem('cidadeInfo') || '{"localidade": "São Paulo"}');
  const selectedDate = localStorage.getItem('selectedDate') || new Date().toISOString().split('T')[0];
  
  // Calcular data do voo (2 dias antes do agendamento por padrão)
  const appointmentDate = new Date(selectedDate);
  const flightDate = new Date(appointmentDate);
  flightDate.setDate(appointmentDate.getDate() - 2);
  
  // Horário padrão
  const flightTime = '13:20';
  const boardingTime = '12:55';
  
  // Determinar aeroporto baseado na cidade
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
    } else if (cityLower.includes('rio de janeiro')) {
      originCode = 'GIG';
      originCity = 'RIO DE JANEIRO';
    } else {
      originCity = cidadeInfo.localidade.toUpperCase();
    }
  }
  
  const passengerName = responsavelData.nome !== 'PASSAGEIRO EXEMPLO' ? responsavelData.nome : '-';
  const flightNumber = 'AD2768';
  const ticketCode = `${originCode}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderRadius: '8px',
        padding: '0',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: '10px auto',
        position: 'relative',
        width: '400px',
        height: '520px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        
        {/* Header com logo e data/voo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px 20px 20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/azul-logo-oficial.png" 
              style={{ height: '24px', width: 'auto' }} 
              alt="Azul"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.innerHTML = '<span style="font-size: 24px; font-weight: 700; color: #60a5fa; font-family: Arial, sans-serif;">Azul</span>';
                target.parentNode?.appendChild(fallback);
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '11px',
            color: '#94a3b8'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>DATA</div>
              <div style={{ fontWeight: '700', color: 'white', fontSize: '12px' }}>{flightDate.toLocaleDateString('pt-BR')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>VOO</div>
              <div style={{ fontWeight: '700', color: 'white', fontSize: '12px' }}>{flightNumber}</div>
            </div>
          </div>
        </div>
        
        {/* Aeroportos */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '24px'
        }}>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <div style={{
              fontSize: '10px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '4px',
              textTransform: 'uppercase'
            }}>{originCity}</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              lineHeight: '1'
            }}>{originCode}</div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 30px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'rgba(96, 165, 250, 0.15)',
              borderRadius: '50%'
            }}>
              <div style={{ fontSize: '16px', color: '#60a5fa' }}>✈</div>
            </div>
          </div>
          <div style={{ textAlign: 'right', flex: 1 }}>
            <div style={{
              fontSize: '10px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '4px',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>SÃO PAULO - GUARULHOS</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              lineHeight: '1'
            }}>GRU</div>
          </div>
        </div>
        
        {/* Informações de embarque */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '8px',
              color: '#94a3b8',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>INÍCIO EMBARQUE</span>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'white'
            }}>{boardingTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '8px',
              color: '#94a3b8',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>FIM EMBARQUE</span>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'white'
            }}>{flightTime}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '8px',
              color: '#94a3b8',
              fontWeight: '600'
            }}>SEÇÃO</span>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'white'
            }}>D</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '8px',
              color: '#94a3b8',
              fontWeight: '600'
            }}>ASSENTO</span>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'white'
            }}>1D</span>
          </div>
        </div>
        
        {/* Cliente e categoria */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 20px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '8px',
              color: '#94a3b8',
              fontWeight: '600'
            }}>CLIENTE</span>
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'white'
            }}>{passengerName.toUpperCase()}</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#60a5fa'
            }}>
              Diamante
            </div>
          </div>
        </div>
        
        {/* QR Code */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '24px',
          padding: '0 24px'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${ticketCode}-AZUL-${passengerName.replace(/\s+/g, '')}-${flightNumber}-${flightDate.toLocaleDateString('pt-BR').replace(/\//g, '')}`}
              style={{ width: '160px', height: '160px', display: 'block' }} 
              alt="QR Code" 
            />
          </div>
        </div>
        
        {/* Localizador */}
        <div style={{
          textAlign: 'center',
          padding: '0 20px',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '10px',
            color: '#94a3b8',
            fontWeight: '600',
            marginBottom: '4px'
          }}>LOCALIZADOR</div>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            color: 'white',
            letterSpacing: '2px'
          }}>{ticketCode}</div>
        </div>
      </div>
    </div>
  );
}