export default function CartaoPreview() {
  const samplePassenger = {
    name: "JOÃO SILVA SANTOS",
    seatNumber: "15D"
  };
  
  const sampleDate = new Date();
  const ticketCode = "GRU123";
  const originCode = "GRU";
  const originCity = "SÃO PAULO";
  const boardingTime = "14:35";
  const flightTime = "15:00";

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
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2c4d6b 100%)', 
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
            alignItems: 'flex-start', 
            justifyContent: 'space-between', 
            marginBottom: '20px'
          }}>
            <img src="/attached_assets/azul-logo-02_1750506382633.png" alt="Azul" style={{ height: '32px', width: 'auto' }} />
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#94a3b8' }}>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>DATA</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>07/12/21</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>VOO</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'white' }}>2768</div>
              </div>
            </div>
          </div>
          
          {/* Aeroportos */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>RECIFE</div>
                <div style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1', color: 'white' }}>REC</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 15px' }}>
                <div style={{ fontSize: '20px', color: '#60a5fa' }}>✈</div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>SÃO PAULO - GUARULHOS</div>
                <div style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1', color: 'white' }}>GRU</div>
              </div>
            </div>
          </div>
          
          {/* Linha de informações de embarque */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '15px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>INÍCIO EMBARQUE</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>12:55</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>FIM EMBARQUE</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>13:20</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>SEÇÃO</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>D</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>ASSENTO</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>1D</div>
              </div>
            </div>
          </div>
          
          {/* Cliente e Status */}
          <div style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500', marginBottom: '2px' }}>CLIENTE</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>PRISCILA BRISIGHELLO</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#60a5fa' }}>Diamante</div>
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
              <div style={{
                width: '110px',
                height: '110px',
                backgroundImage: `url('data:image/svg+xml,${encodeURIComponent('<svg width="110" height="110" viewBox="0 0 110 110" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="10" fill="black"/><rect x="20" y="0" width="10" height="10" fill="black"/><rect x="40" y="0" width="10" height="10" fill="black"/><rect x="60" y="0" width="10" height="10" fill="black"/><rect x="80" y="0" width="10" height="10" fill="black"/><rect x="100" y="0" width="10" height="10" fill="black"/><rect x="0" y="20" width="10" height="10" fill="black"/><rect x="100" y="20" width="10" height="10" fill="black"/><rect x="0" y="40" width="10" height="10" fill="black"/><rect x="20" y="40" width="10" height="10" fill="black"/><rect x="40" y="40" width="10" height="10" fill="black"/><rect x="60" y="40" width="10" height="10" fill="black"/><rect x="80" y="40" width="10" height="10" fill="black"/><rect x="100" y="40" width="10" height="10" fill="black"/><rect x="0" y="60" width="10" height="10" fill="black"/><rect x="100" y="60" width="10" height="10" fill="black"/><rect x="0" y="80" width="10" height="10" fill="black"/><rect x="20" y="80" width="10" height="10" fill="black"/><rect x="40" y="80" width="10" height="10" fill="black"/><rect x="60" y="80" width="10" height="10" fill="black"/><rect x="80" y="80" width="10" height="10" fill="black"/><rect x="100" y="80" width="10" height="10" fill="black"/><rect x="0" y="100" width="10" height="10" fill="black"/><rect x="20" y="100" width="10" height="10" fill="black"/><rect x="40" y="100" width="10" height="10" fill="black"/><rect x="60" y="100" width="10" height="10" fill="black"/><rect x="80" y="100" width="10" height="10" fill="black"/><rect x="100" y="100" width="10" height="10" fill="black"/><rect x="10" y="10" width="10" height="10" fill="black"/><rect x="30" y="10" width="10" height="10" fill="black"/><rect x="50" y="10" width="10" height="10" fill="black"/><rect x="70" y="10" width="10" height="10" fill="black"/><rect x="90" y="10" width="10" height="10" fill="black"/><rect x="10" y="30" width="10" height="10" fill="black"/><rect x="90" y="30" width="10" height="10" fill="black"/><rect x="10" y="50" width="10" height="10" fill="black"/><rect x="30" y="50" width="10" height="10" fill="black"/><rect x="50" y="50" width="10" height="10" fill="black"/><rect x="70" y="50" width="10" height="10" fill="black"/><rect x="90" y="50" width="10" height="10" fill="black"/><rect x="10" y="70" width="10" height="10" fill="black"/><rect x="90" y="70" width="10" height="10" fill="black"/><rect x="10" y="90" width="10" height="10" fill="black"/><rect x="30" y="90" width="10" height="10" fill="black"/><rect x="50" y="90" width="10" height="10" fill="black"/><rect x="70" y="90" width="10" height="10" fill="black"/><rect x="90" y="90" width="10" height="10" fill="black"/></svg>')}')`,
                backgroundSize: 'cover'
              }}></div>
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