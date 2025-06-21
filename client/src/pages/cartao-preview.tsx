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
        
        {/* Cartão de embarque */}
        <div style={{
          width: '320px', 
          height: '500px', 
          background: 'linear-gradient(135deg, #003d82 0%, #0052a3 100%)', 
          borderRadius: '8px', 
          padding: '20px', 
          color: 'white', 
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
          position: 'relative', 
          margin: '0 auto', 
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
          
          {/* PRIMEIRA PARTE: Header com logo e boarding pass */}
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '20px', 
            borderBottom: '1px solid rgba(255,255,255,0.2)', 
            paddingBottom: '15px'
          }}>
            <img src="/attached_assets/azul-logo-02_1750506382633.png" alt="Azul" style={{ height: '32px', width: 'auto' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '9px', color: '#b3d1ff', letterSpacing: '0.5px', fontWeight: '500' }}>BOARDING PASS</div>
              <div style={{ fontSize: '9px', color: '#b3d1ff', letterSpacing: '0.5px', fontWeight: '500' }}>CARTÃO DE EMBARQUE</div>
            </div>
          </div>
          
          {/* SEGUNDA PARTE: Aeroportos e informações principais */}
          <div style={{ marginBottom: '25px' }}>
            {/* Aeroportos origem e destino */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '1', marginBottom: '2px' }}>{originCode}</div>
                <div style={{ fontSize: '10px', color: '#b3d1ff', fontWeight: '500' }}>{originCity}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1', margin: '0 20px' }}>
                <div style={{ fontSize: '20px', marginBottom: '5px' }}>✈</div>
                <div style={{ fontSize: '8px', color: '#b3d1ff', fontWeight: '500' }}>
                  {sampleDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' }).toUpperCase()}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', lineHeight: '1', marginBottom: '2px' }}>GRU</div>
                <div style={{ fontSize: '10px', color: '#b3d1ff', fontWeight: '500' }}>SÃO PAULO</div>
              </div>
            </div>
            
            {/* Linha de informações principais - tudo na mesma linha */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>PASSAGEIRO</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{samplePassenger.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>VOO</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>AD1234</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>ASSENTO</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{samplePassenger.seatNumber}</span>
              </div>
            </div>
          </div>
          
          {/* TERCEIRA PARTE: Informações de embarque organizadas */}
          <div style={{ marginBottom: '25px' }}>
            {/* Primeira linha de informações */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>PORTÃO</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>15</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>EMBARQUE</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{boardingTime}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>PARTIDA</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{flightTime}</span>
              </div>
            </div>
            
            {/* Segunda linha de informações */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>SEÇÃO</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>Y</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>CLASSE</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>ECONÔMICA</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>STATUS</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>OK</span>
              </div>
            </div>
            
            {/* Terceira linha de informações */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>SEQUÊNCIA</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>001</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>LOCALIZADOR</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>{ticketCode}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ color: '#b3d1ff', fontWeight: '500', marginBottom: '2px' }}>BAGAGEM</span>
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>1PC</span>
              </div>
            </div>
          </div>
          
          {/* QUARTA PARTE: QR Code no canto inferior direito */}
          <div style={{
            position: 'absolute', 
            bottom: '20px', 
            right: '20px', 
            width: '70px', 
            height: '70px', 
            backgroundColor: 'white', 
            borderRadius: '4px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <div style={{
              width: '60px', 
              height: '60px', 
              backgroundImage: `url('data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="6" height="6" fill="black"/><rect x="12" y="0" width="6" height="6" fill="black"/><rect x="24" y="0" width="6" height="6" fill="black"/><rect x="36" y="0" width="6" height="6" fill="black"/><rect x="48" y="0" width="6" height="6" fill="black"/><rect x="0" y="12" width="6" height="6" fill="black"/><rect x="48" y="12" width="6" height="6" fill="black"/><rect x="0" y="24" width="6" height="6" fill="black"/><rect x="12" y="24" width="6" height="6" fill="black"/><rect x="24" y="24" width="6" height="6" fill="black"/><rect x="36" y="24" width="6" height="6" fill="black"/><rect x="48" y="24" width="6" height="6" fill="black"/><rect x="0" y="36" width="6" height="6" fill="black"/><rect x="48" y="36" width="6" height="6" fill="black"/><rect x="0" y="48" width="6" height="6" fill="black"/><rect x="12" y="48" width="6" height="6" fill="black"/><rect x="24" y="48" width="6" height="6" fill="black"/><rect x="36" y="48" width="6" height="6" fill="black"/><rect x="48" y="48" width="6" height="6" fill="black"/><rect x="6" y="6" width="6" height="6" fill="black"/><rect x="18" y="6" width="6" height="6" fill="black"/><rect x="30" y="6" width="6" height="6" fill="black"/><rect x="42" y="6" width="6" height="6" fill="black"/><rect x="6" y="18" width="6" height="6" fill="black"/><rect x="42" y="18" width="6" height="6" fill="black"/><rect x="6" y="30" width="6" height="6" fill="black"/><rect x="18" y="30" width="6" height="6" fill="black"/><rect x="30" y="30" width="6" height="6" fill="black"/><rect x="42" y="30" width="6" height="6" fill="black"/><rect x="6" y="42" width="6" height="6" fill="black"/><rect x="42" y="42" width="6" height="6" fill="black"/></svg>')}')`, 
              backgroundSize: 'cover'
            }}></div>
          </div>
          
          {/* Texto informativo no rodapé */}
          <div style={{
            position: 'absolute', 
            bottom: '15px', 
            left: '20px', 
            fontSize: '7px', 
            color: '#b3d1ff'
          }}>
            <div>Azul Linhas Aéreas Brasileiras</div>
            <div>Keep this boarding pass until departure</div>
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