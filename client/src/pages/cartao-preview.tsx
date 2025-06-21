import React, { useState, useEffect } from 'react';

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
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>07/12/21</div>
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
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>RECIFE</div>
              <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>SAO PAULO - GUARULHOS</div>
            </div>
            
            {/* Códigos dos aeroportos alinhados */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '48px', fontWeight: '400', lineHeight: '1', color: 'white' }}>REC</div>
              
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
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>1D</div>
              </div>
            </div>
          </div>
          
          {/* Cliente e Status */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <div style={{ fontSize: '8px', color: '#94a3b8', fontWeight: '500', marginBottom: '1px' }}>CLIENTE</div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'white' }}>PRISCILA BRISIGHELLO</div>
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
              <div style={{
                width: '110px',
                height: '110px',
                backgroundImage: `url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><rect width="25" height="25" fill="white"/><g fill="black"><rect x="0" y="0" width="7" height="7"/><rect x="1" y="1" width="5" height="5" fill="white"/><rect x="2" y="2" width="3" height="3"/><rect x="18" y="0" width="7" height="7"/><rect x="19" y="1" width="5" height="5" fill="white"/><rect x="20" y="2" width="3" height="3"/><rect x="0" y="18" width="7" height="7"/><rect x="1" y="19" width="5" height="5" fill="white"/><rect x="2" y="20" width="3" height="3"/><rect x="8" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="12" y="6" width="1" height="1"/><rect x="14" y="6" width="1" height="1"/><rect x="16" y="6" width="1" height="1"/><rect x="6" y="8" width="1" height="1"/><rect x="6" y="10" width="1" height="1"/><rect x="6" y="12" width="1" height="1"/><rect x="6" y="14" width="1" height="1"/><rect x="6" y="16" width="1" height="1"/><rect x="9" y="1" width="1" height="1"/><rect x="11" y="1" width="1" height="1"/><rect x="13" y="1" width="1" height="1"/><rect x="15" y="1" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="10" y="8" width="1" height="1"/><rect x="12" y="9" width="1" height="1"/><rect x="14" y="8" width="1" height="1"/><rect x="16" y="9" width="1" height="1"/><rect x="9" y="10" width="1" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="13" y="10" width="1" height="1"/><rect x="15" y="11" width="1" height="1"/><rect x="8" y="12" width="1" height="1"/><rect x="10" y="13" width="1" height="1"/><rect x="12" y="12" width="1" height="1"/><rect x="14" y="13" width="1" height="1"/><rect x="9" y="14" width="1" height="1"/><rect x="11" y="15" width="1" height="1"/><rect x="13" y="14" width="1" height="1"/><rect x="15" y="15" width="1" height="1"/><rect x="8" y="16" width="1" height="1"/><rect x="10" y="17" width="1" height="1"/><rect x="12" y="16" width="1" height="1"/><rect x="14" y="17" width="1" height="1"/><rect x="1" y="9" width="1" height="1"/><rect x="3" y="11" width="1" height="1"/><rect x="1" y="13" width="1" height="1"/><rect x="3" y="15" width="1" height="1"/><rect x="20" y="9" width="1" height="1"/><rect x="22" y="11" width="1" height="1"/><rect x="20" y="13" width="1" height="1"/><rect x="22" y="15" width="1" height="1"/><rect x="18" y="18" width="3" height="3"/><rect x="19" y="19" width="1" height="1" fill="white"/><rect x="9" y="19" width="1" height="1"/><rect x="11" y="20" width="1" height="1"/><rect x="13" y="19" width="1" height="1"/><rect x="15" y="20" width="1" height="1"/><rect x="9" y="22" width="1" height="1"/><rect x="11" y="23" width="1" height="1"/><rect x="13" y="22" width="1" height="1"/><rect x="15" y="23" width="1" height="1"/></g></svg>')}')`,
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