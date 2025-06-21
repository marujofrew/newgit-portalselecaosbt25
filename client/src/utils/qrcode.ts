// QR code visual pattern generator (not functional, just for appearance)
export function generateQRVisualPattern(): string {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
      <rect width="25" height="25" fill="white"/>
      <g fill="black">
        <!-- Corner detection patterns -->
        <rect x="0" y="0" width="7" height="7"/>
        <rect x="1" y="1" width="5" height="5" fill="white"/>
        <rect x="2" y="2" width="3" height="3"/>
        
        <rect x="18" y="0" width="7" height="7"/>
        <rect x="19" y="1" width="5" height="5" fill="white"/>
        <rect x="20" y="2" width="3" height="3"/>
        
        <rect x="0" y="18" width="7" height="7"/>
        <rect x="1" y="19" width="5" height="5" fill="white"/>
        <rect x="2" y="20" width="3" height="3"/>
        
        <!-- Timing patterns -->
        <rect x="8" y="6" width="1" height="1"/>
        <rect x="10" y="6" width="1" height="1"/>
        <rect x="12" y="6" width="1" height="1"/>
        <rect x="14" y="6" width="1" height="1"/>
        <rect x="16" y="6" width="1" height="1"/>
        
        <rect x="6" y="8" width="1" height="1"/>
        <rect x="6" y="10" width="1" height="1"/>
        <rect x="6" y="12" width="1" height="1"/>
        <rect x="6" y="14" width="1" height="1"/>
        <rect x="6" y="16" width="1" height="1"/>
        
        <!-- Data pattern -->
        <rect x="9" y="1" width="1" height="1"/>
        <rect x="11" y="1" width="1" height="1"/>
        <rect x="13" y="1" width="1" height="1"/>
        <rect x="15" y="1" width="1" height="1"/>
        
        <rect x="8" y="8" width="1" height="1"/>
        <rect x="10" y="8" width="1" height="1"/>
        <rect x="12" y="9" width="1" height="1"/>
        <rect x="14" y="8" width="1" height="1"/>
        <rect x="16" y="9" width="1" height="1"/>
        
        <rect x="9" y="10" width="1" height="1"/>
        <rect x="11" y="11" width="1" height="1"/>
        <rect x="13" y="10" width="1" height="1"/>
        <rect x="15" y="11" width="1" height="1"/>
        
        <rect x="8" y="12" width="1" height="1"/>
        <rect x="10" y="13" width="1" height="1"/>
        <rect x="12" y="12" width="1" height="1"/>
        <rect x="14" y="13" width="1" height="1"/>
        
        <rect x="9" y="14" width="1" height="1"/>
        <rect x="11" y="15" width="1" height="1"/>
        <rect x="13" y="14" width="1" height="1"/>
        <rect x="15" y="15" width="1" height="1"/>
        
        <rect x="8" y="16" width="1" height="1"/>
        <rect x="10" y="17" width="1" height="1"/>
        <rect x="12" y="16" width="1" height="1"/>
        <rect x="14" y="17" width="1" height="1"/>
        
        <!-- Side data -->
        <rect x="1" y="9" width="1" height="1"/>
        <rect x="3" y="11" width="1" height="1"/>
        <rect x="1" y="13" width="1" height="1"/>
        <rect x="3" y="15" width="1" height="1"/>
        
        <rect x="20" y="9" width="1" height="1"/>
        <rect x="22" y="11" width="1" height="1"/>
        <rect x="20" y="13" width="1" height="1"/>
        <rect x="22" y="15" width="1" height="1"/>
        
        <!-- Alignment pattern -->
        <rect x="18" y="18" width="3" height="3"/>
        <rect x="19" y="19" width="1" height="1" fill="white"/>
        
        <!-- Bottom data -->
        <rect x="9" y="19" width="1" height="1"/>
        <rect x="11" y="20" width="1" height="1"/>
        <rect x="13" y="19" width="1" height="1"/>
        <rect x="15" y="20" width="1" height="1"/>
        
        <rect x="9" y="22" width="1" height="1"/>
        <rect x="11" y="23" width="1" height="1"/>
        <rect x="13" y="22" width="1" height="1"/>
        <rect x="15" y="23" width="1" height="1"/>
      </g>
    </svg>
  `)}`
}