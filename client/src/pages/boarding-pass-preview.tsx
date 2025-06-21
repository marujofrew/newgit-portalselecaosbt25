export default function BoardingPassPreview() {
  const createBoardingPassHTML = () => {
    return (
      <div style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderRadius: '20px',
        padding: '0',
        color: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: '10px auto',
        position: 'relative',
        width: '350px',
        height: '600px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}>
        
        {/* Header com logo e data/voo */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '24px 24px 20px 24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/azul-logo.png" 
              style={{ height: '40px', width: 'auto', filter: 'brightness(0) invert(1)' }} 
              alt="Azul"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/azul-logo.svg';
                target.style.filter = 'none';
                target.onerror = () => {
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.innerHTML = '<span style="font-size: 32px; font-weight: 700; color: #60a5fa; font-family: Arial, sans-serif;">Azul</span>';
                  target.parentNode?.appendChild(fallback);
                };
              }}
            />
          </div>
          <div style={{
            textAlign: 'right',
            fontSize: '12px',
            color: '#94a3b8',
            lineHeight: '1.4'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '2px' }}>DATA</div>
            <div style={{ fontWeight: '700', color: 'white', fontSize: '14px' }}>07/12/21</div>
            <div style={{ fontWeight: '600', marginTop: '8px', marginBottom: '2px' }}>VOO</div>
            <div style={{ fontWeight: '700', color: 'white', fontSize: '14px' }}>2768</div>
          </div>
        </div>
        
        {/* Aeroportos */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          marginBottom: '32px'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '6px'
            }}>RECIFE</div>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              letterSpacing: '1px',
              color: 'white'
            }}>REC</div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            background: 'rgba(96, 165, 250, 0.1)',
            borderRadius: '50%',
            margin: '0 20px'
          }}>
            <div style={{ fontSize: '24px', color: '#60a5fa' }}>✈</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '12px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '6px'
            }}>SÃO PAULO - GUARULHOS</div>
            <div style={{
              fontSize: '48px',
              fontWeight: '700',
              letterSpacing: '1px',
              color: 'white'
            }}>GRU</div>
          </div>
        </div>
        
        {/* Informações de embarque */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '0',
          padding: '0 24px',
          marginBottom: '32px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '8px'
            }}>INÍCIO EMBARQUE</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white'
            }}>12:55</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '8px'
            }}>FIM EMBARQUE</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white'
            }}>13:20</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '8px'
            }}>SEÇÃO</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white'
            }}>D</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '8px'
            }}>ASSENTO</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white'
            }}>1D</div>
          </div>
        </div>
        
        {/* Cliente e categoria */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          marginBottom: '40px'
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              color: '#94a3b8',
              fontWeight: '600',
              marginBottom: '8px'
            }}>CLIENTE</div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white'
            }}>PRISCILA BRISIGHELLO</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '18px',
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