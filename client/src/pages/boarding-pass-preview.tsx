export default function BoardingPassPreview() {
  const createBoardingPassHTML = () => {
    return (
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
              <div style={{ fontWeight: '700', color: 'white', fontSize: '12px' }}>{new Date().toLocaleDateString('pt-BR')}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', marginBottom: '2px' }}>VOO</div>
              <div style={{ fontWeight: '700', color: 'white', fontSize: '12px' }}>2768</div>
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
            }}>GOIÂNIA</div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              lineHeight: '1'
            }}>GYN</div>
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
            }}>12:55</span>
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
            }}>13:20</span>
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
            }}>PRISCILA BRISIGHELLO</span>
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
              src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NF2NPC-94-AZUL-PRISCILABRISIGHELLO-2768" 
              style={{ width: '160px', height: '160px', display: 'block' }} 
              alt="QR Code" 
            />
          </div>
        </div>
        
        {/* Código do ticket */}
        <div style={{
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '700',
          color: '#94a3b8',
          padding: '0 24px 24px 24px'
        }}>
          NF2NPC - 94
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Preview - Cartão de Embarque
          </h1>
          <p className="text-gray-600 text-center mb-4">
            Cartão de embarque com logo oficial da Azul
          </p>
        </div>
        
        <div className="flex justify-center">
          {createBoardingPassHTML()}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Características:</h2>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Logo oficial da Azul</li>
            <li>✓ QR code dinâmico real</li>
            <li>✓ Design idêntico ao original</li>
            <li>✓ Dados personalizados do passageiro</li>
            <li>✓ Gradiente azul escuro profissional</li>
            <li>✓ Layout responsivo e moderno</li>
          </ul>
        </div>
      </div>
    </div>
  );
}