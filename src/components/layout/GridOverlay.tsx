
import React from 'react';
import { useDeviceState } from '../../hooks/useDeviceState';

interface GridOverlayProps {
  accentColor?: string | null;
  hotspotFocus?: { x: number; y: number } | null;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ accentColor, hotspotFocus }) => {
  const primaryColor = hotspotFocus ? '#FFFFFF' : (accentColor || '#00F0FF'); 
  const secondaryColor = hotspotFocus ? '#00F0FF' : (accentColor || '#FF003C');
  const device = useDeviceState();
  const isMobile = device !== 'desktop';
  const isMobileLandscape = device === 'mobile-landscape';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-background overflow-hidden transition-colors duration-500">
      {/* === 1. DYNAMIC BACKGROUND ENERGY (High Impact) === */}
      <div className={`absolute inset-0 transition-all duration-1000 ease-in-out mix-blend-screen ${isMobile ? 'opacity-25' : 'opacity-40'}`}>
         <div 
            className={`absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] animate-[orb-float-fast_5s_ease-in-out_infinite] transition-colors duration-1000 ${isMobile ? 'blur-[50px]' : 'blur-[80px]'}`}
            style={{ background: `radial-gradient(circle, ${primaryColor}66 0%, transparent 60%)` }}
         />
         
         <div 
            className={`absolute bottom-[-20%] right-[-20%] w-[80vw] h-[80vw] animate-[orb-float-fast_7s_ease-in-out_infinite_reverse] transition-colors duration-1000 ${isMobile ? 'blur-[60px]' : 'blur-[90px]'}`}
            style={{ background: `radial-gradient(circle, ${secondaryColor}4D 0%, transparent 60%)` }}
         />
         
         <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] animate-pulse transition-colors duration-1000 ${isMobile ? 'blur-[60px]' : 'blur-[100px]'}`}
            style={{ background: `radial-gradient(circle, ${primaryColor}0D 0%, transparent 70%)` }}
         />
      </div>

      {/* === 2. DIGITAL NOISE TEXTURE === */}
      <div className="absolute inset-0 opacity-[0.08] z-0"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* === 3. TOPOGRAPHIC CONTOUR TEXTURE === */}
      <div className={`absolute inset-0 invert-0 pointer-events-none mix-blend-plus-lighter ${isMobile ? 'opacity-[0.04]' : 'opacity-[0.08]'}`}
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='lines' x='0' y='0' width='12' height='12' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 6 L12 6' stroke='white' stroke-width='0.8' fill='none' opacity='1'/%3E%3C/pattern%3E%3Cfilter id='topo'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.006' numOctaves='5' seed='50' result='noise'/%3E%3CfeDisplacementMap in='SourceGraphic' in2='noise' scale='80' xChannelSelector='R' yChannelSelector='G'/%3E%3C/filter%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23lines)' filter='url(%23topo)'/%3E%3C/svg%3E")`,
             backgroundSize: 'cover',
             animation: 'contour-drift 120s linear infinite alternate'
           }}>
      </div>

      {/* === 4. THE SCANNER BEAM (Visual Impact) === */}
      {!isMobileLandscape && (
      <div className="absolute inset-x-0 h-[2px] z-20 shadow-[0_0_20px_rgba(var(--foreground),0.2)] animate-[cyber-scan_4s_linear_infinite] transition-colors duration-1000" 
           style={{ animationDelay: '1s', backgroundColor: primaryColor ? `${primaryColor}80` : 'rgba(120,120,120,0.5)' }}>
           <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-t from-foreground/5 to-transparent -translate-y-full pointer-events-none"></div>
      </div>
      )}

      {!isMobile && (
      <>
      <div className="absolute top-8 left-8 text-foreground/50 font-mono text-xs flex items-center gap-2 animate-[glitch-flicker_5s_infinite]">
        <span className="w-2 h-2 border border-foreground/50" style={{ borderColor: primaryColor }}></span>
        <span>{hotspotFocus ? 'TARGET_LOCKED' : 'SYS.MONITOR'}</span>
      </div>
      <div className="absolute top-8 right-8 text-foreground/50 font-mono text-xs text-right animate-[glitch-flicker_7s_infinite_reverse]">
        R + <span className="text-foreground transition-colors duration-500" style={{ color: primaryColor }}>REC</span>
      </div>
      <div className="absolute bottom-8 left-8 text-foreground/50 font-mono text-xs animate-[glitch-flicker_4s_infinite]">
        COORD: {hotspotFocus ? `${hotspotFocus.x.toFixed(2)} | ${hotspotFocus.y.toFixed(2)}` : '34.22.91'}
      </div>
      <div className="absolute bottom-8 right-8 text-foreground/50 font-mono text-xs flex items-center gap-2">
        <span>MEM: 64TB</span>
        <span className="w-2 h-2 bg-foreground/50 animate-pulse" style={{ backgroundColor: secondaryColor }}></span>
      </div>
      </>
      )}

      {/* === DYNAMIC RETICLE === */}
      {/* Moves based on hotspotFocus, or stays center */}
      <div 
        className={`absolute border border-foreground/5 rounded-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMobileLandscape ? 'w-[30vw] h-[30vw]' : isMobile ? 'w-[40vw] h-[40vw]' : 'md:w-[20vw] md:h-[20vw] w-[40vw] h-[40vw]'}`}
        style={{ 
            top: hotspotFocus ? `${hotspotFocus.y}%` : '50%', 
            left: hotspotFocus ? `${hotspotFocus.x}%` : '50%',
            transform: 'translate(-50%, -50%)',
            opacity: hotspotFocus ? 1 : 0.4,
            borderColor: hotspotFocus ? primaryColor : undefined
        }}
      >
        <div className={`w-[80%] h-[80%] border rounded-full border-dashed ${hotspotFocus ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_20s_linear_infinite]'}`}
             style={{ 
                 borderColor: primaryColor ? `${primaryColor}66` : undefined,
                 borderWidth: hotspotFocus ? '2px' : '1px'
             }}></div>
        
        {/* Crosshairs appearing on focus */}
        {hotspotFocus && (
            <>
                <div className="absolute w-[120%] h-px bg-gradient-to-r from-transparent via-foreground/50 to-transparent"></div>
                <div className="absolute h-[120%] w-px bg-gradient-to-b from-transparent via-foreground/50 to-transparent"></div>
                <div className="absolute w-4 h-4 border border-foreground bg-foreground/20 animate-ping"></div>
            </>
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(var(--background),0.8)_90%)] z-10 pointer-events-none"></div>
    </div>
  );
};

export default GridOverlay;
