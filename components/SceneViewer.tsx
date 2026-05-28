
import React, { useState, useRef, useEffect } from 'react';
import { Scene, Hotspot } from '../types';
import { ArrowLeft, ChevronRight, ChevronLeft, Scan, List, X } from 'lucide-react';
import DetailCard from './DetailCard';

interface SceneViewerProps {
  scene: Scene;
  onBack: () => void;
  onHotspotSelect?: (hotspot: Hotspot | null) => void;
}

const SceneViewer: React.FC<SceneViewerProps> = ({ scene, onBack, onHotspotSelect }) => {
  const activeHotspotRef = useRef<Hotspot | null>(null);
  const [activeHotspot, _setActiveHotspot] = useState<Hotspot | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const setActiveHotspot = (h: Hotspot | null) => {
      activeHotspotRef.current = h;
      _setActiveHotspot(h);
      // Bubble up the state to App for dynamic background effects
      if (onHotspotSelect) {
          onHotspotSelect(h);
      }
  };

  useEffect(() => {
    const checkMobile = () => {
        const mobile = window.innerWidth < 768;
        setIsMobile(mobile);
        if (mobile) setIsMenuOpen(false);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebarWidth = isMobile 
    ? (isMenuOpen ? '100%' : '0px') 
    : (isMenuOpen ? '320px' : '60px');

  return (
    // Changed bg-background to bg-transparent to allow GridOverlay to show through when image dims
    <div className="fixed inset-0 z-20 bg-transparent flex flex-col animate-in fade-in duration-500 font-sans transition-colors">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 md:p-6 flex items-center gap-4 md:gap-6 pointer-events-none">
        
        {/* Back Button */}
        <button 
            onClick={onBack}
            className="pointer-events-auto flex-none flex items-center justify-center w-10 h-10 md:w-12 md:h-12 group bg-background/60 backdrop-blur-md border border-border/10 hover:bg-[--accent-color] hover:text-black hover:border-transparent transition-all duration-300 rounded-sm text-foreground"
            style={{ '--accent-color': scene.color } as React.CSSProperties}
            title="返回"
        >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
        </button>

        <div className="h-8 w-px bg-border/10 hidden md:block"></div>

        <div className="pointer-events-auto text-left min-w-0 flex-1 md:flex-none">
            <h2 className="text-xl md:text-4xl font-black uppercase tracking-wide text-foreground drop-shadow-2xl leading-none truncate"
                style={{ textShadow: `0 0 30px ${scene.color}40` }}>
                {scene.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full animate-pulse flex-none" style={{ backgroundColor: scene.color }}></span>
                <span className="text-[9px] md:text-xs font-mono text-muted tracking-[0.2em] uppercase truncate">{scene.subtitle}</span>
            </div>
        </div>
      </div>

      {/* Main Viewport */}
      {/* Also made bg-surface conditional or transparent to avoid blocking GridOverlay */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden bg-transparent">
        {/* Background Image - Becomes more transparent when hotspot active to show GridOverlay */}
        <img 
            src={scene.mainImage} 
            alt={scene.title} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 
                ${activeHotspot 
                    ? 'scale-105 opacity-20 blur-[2px] grayscale' // Analysis Mode
                    : 'scale-100 opacity-90 dark:opacity-80' // View Mode: Clear in Light, slightly dim in Dark
                }`}
        />
        
        {/* Decorative Grid Overlay (Internal to SceneViewer, on top of image) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        
        {/* Vignette - Less opaque in Light Mode to avoid white fog */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(var(--background),0.3)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,rgba(var(--background),0.8)_100%)]" />

        {/* --- INTERACTIVE HOTSPOT LAYERS --- */}
        <div className="absolute inset-0 z-30 pointer-events-none">
            {scene.hotspots.map((hotspot) => {
                const isActive = activeHotspot?.id === hotspot.id;
                
                return (
                    <button
                        key={hotspot.id}
                        onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(isActive ? null : hotspot);
                        }}
                        className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center group outline-none focus:outline-none transition-all duration-500`}
                        style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                        aria-label={`Select ${hotspot.title}`}
                    >
                        {isActive && (
                            <div 
                                className="absolute inset-0 rounded-full border opacity-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" 
                                style={{ borderColor: scene.color }}
                            ></div>
                        )}

                        {!isActive && (
                            <div className="absolute inset-0 rounded-full border border-current scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out text-white dark:text-white/50"></div>
                        )}

                        <div 
                            className={`relative w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                                ${isActive 
                                    ? 'scale-125 shadow-[0_0_20px_var(--accent-color)]' 
                                    : 'bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:bg-white group-hover:scale-110 group-hover:shadow-[0_0_15px_white]'
                                }
                            `}
                            style={{ 
                                backgroundColor: isActive ? scene.color : undefined,
                                '--accent-color': scene.color 
                            } as React.CSSProperties}
                        >
                            {isActive && <div className="absolute inset-0 m-auto w-1 h-1 bg-white/80 rounded-full"></div>}
                        </div>

                        <div className={`absolute left-1/2 top-full mt-3 -translate-x-1/2 pointer-events-none transition-all duration-300 ${!isActive ? 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0' : 'opacity-0'}`}>
                            <div className="bg-black/80 backdrop-blur-md border border-white/20 px-2 py-1 rounded-sm whitespace-nowrap">
                                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-white/90">
                                    {hotspot.title}
                                </span>
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full h-3 w-px bg-gradient-to-t from-white/20 to-transparent"></div>
                        </div>
                    </button>
                );
            })}
        </div>

        {/* TARGET RETICLE & CARD */}
        {activeHotspot && (
            <div className="absolute inset-0 pointer-events-none z-30">
                {/* 1. The Reticle at the specific location */}
                <div 
                    className="absolute w-16 h-16 md:w-24 md:h-24 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                    style={{ top: `${activeHotspot.y}%`, left: `${activeHotspot.x}%` }}
                >
                    <div className="absolute top-0 left-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-l-2 opacity-80" style={{ borderColor: scene.color }}></div>
                    <div className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t-2 border-r-2 opacity-80" style={{ borderColor: scene.color }}></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-l-2 opacity-80" style={{ borderColor: scene.color }}></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 md:w-4 md:h-4 border-b-2 border-r-2 opacity-80" style={{ borderColor: scene.color }}></div>
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <div className="w-full h-px bg-foreground/20"></div>
                        <div className="h-full w-px bg-foreground/20 absolute"></div>
                    </div>
                </div>

                {/* 2. The Detail Card */}
                <div 
                    className={`absolute pointer-events-auto transition-all duration-500 z-50 ${isMobile ? 'inset-x-0 bottom-0' : 'max-w-sm'}`}
                    style={isMobile ? {} : {
                        top: `clamp(15%, ${activeHotspot.y}%, 50%)`, 
                        left: activeHotspot.x > 50 ? `auto` : `clamp(20px, ${activeHotspot.x + 8}%, 50%)`,
                        right: activeHotspot.x > 50 ? `clamp(340px, ${100 - activeHotspot.x + 8}%, 80%)` : `auto`,
                    }}
                >
                    <DetailCard 
                        hotspot={activeHotspot} 
                        onClose={() => setActiveHotspot(null)} 
                        sceneTitle={scene.title}
                        accentColor={scene.color}
                        isMobile={isMobile}
                        onExpand={(expanded) => {
                            if (expanded) setIsMenuOpen(false);
                        }}
                    />
                </div>
            </div>
        )}

        {/* SIDEBAR MENU */}
        <aside 
            onMouseEnter={() => !isMobile && setIsMenuOpen(true)}
            onMouseLeave={() => !isMobile && setIsMenuOpen(false)}
            className={`absolute top-0 right-0 h-full z-50 bg-background/90 md:bg-background/80 backdrop-blur-xl border-l border-border/10 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col shadow-2xl`}
            style={{ 
                width: sidebarWidth,
                right: 0,
            }}
        >
            {!isMobile && (
                 <div 
                    className={`absolute inset-0 w-[60px] border-l border-border/10 bg-background/90 flex flex-col items-center pt-24 gap-4 transition-opacity duration-300 ${!isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                 >
                     <button 
                        onClick={() => setIsMenuOpen(true)} 
                        className="p-3 text-muted hover:text-[--accent-color] hover:bg-surface/5 rounded-sm transition-all mb-4 border border-transparent hover:border-border/10"
                        style={{ '--accent-color': scene.color } as React.CSSProperties}
                        title="展开菜单"
                     >
                         <ChevronLeft size={20} />
                     </button>

                    <div className="flex flex-col gap-3 w-full items-center">
                        {scene.hotspots.map((hotspot, idx) => (
                            <button
                                key={hotspot.id}
                                onClick={() => setActiveHotspot(hotspot)}
                                className="group relative w-8 h-8 flex items-center justify-center"
                            >
                                <span 
                                    className={`font-mono text-[10px] transition-colors ${activeHotspot?.id === hotspot.id ? 'text-[--accent-color] font-bold' : 'text-muted group-hover:text-foreground'}`}
                                    style={{ '--accent-color': scene.color } as React.CSSProperties}
                                >
                                    {(idx + 1).toString().padStart(2, '0')}
                                </span>
                                {activeHotspot?.id === hotspot.id && (
                                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-4 rounded-l-full bg-[--accent-color]" style={{ backgroundColor: scene.color }}></div>
                                )}
                            </button>
                        ))}
                    </div>
                 </div>
            )}

            <div className={`flex flex-col h-full w-full overflow-hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 delay-100' : 'opacity-0 pointer-events-none'}`}>
                 
                <div className="flex-none p-6 border-b border-border/10 mt-12 md:mt-0 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         {!isMobile && (
                            <button 
                                onClick={() => setIsMenuOpen(false)}
                                className="p-1 -ml-2 text-muted hover:text-foreground transition-colors hover:bg-surface/10 rounded"
                                title="收起菜单"
                            >
                                <ChevronRight size={18} />
                            </button>
                        )}
                        <h3 className="font-mono text-xs text-muted uppercase tracking-widest">区域分析</h3>
                    </div>
                    
                    {isMobile ? (
                        <button 
                            onClick={() => setIsMenuOpen(false)}
                            className="p-2 -mr-2 text-muted hover:text-foreground"
                        >
                            <X size={20} />
                        </button>
                    ) : (
                        <Scan size={16} style={{ color: scene.color }} />
                    )}
                </div>
                <div className="h-px w-full bg-gradient-to-r from-border/20 to-transparent flex-none"></div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4">
                    <div className="flex flex-col gap-2 px-4">
                        {scene.hotspots.map((hotspot, idx) => {
                            const isActive = activeHotspot?.id === hotspot.id;
                            return (
                                <button
                                    key={hotspot.id}
                                    onClick={() => {
                                        setActiveHotspot(isActive ? null : hotspot);
                                        if (isMobile) setIsMenuOpen(false);
                                    }}
                                    className={`group relative flex items-center gap-4 p-3 w-full text-left border border-transparent transition-all duration-300 overflow-hidden ${isActive ? 'bg-surface/5 border-border/20' : 'hover:bg-surface/5 hover:border-border/10'}`}
                                >
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${isActive ? 'bg-[--accent-color]' : 'bg-transparent group-hover:bg-surface/20'}`} style={{ '--accent-color': scene.color } as React.CSSProperties}></div>
                                    
                                    <div className="w-12 h-12 shrink-0 bg-surface overflow-hidden relative border border-border/10">
                                        <img src={hotspot.detailImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                                        {isActive && <div className="absolute inset-0 bg-[--accent-color] mix-blend-overlay opacity-50" style={{ '--accent-color': scene.color } as React.CSSProperties}></div>}
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-mono text-[10px] ${isActive ? 'text-[--accent-color]' : 'text-muted'}`} style={{ '--accent-color': scene.color } as React.CSSProperties}>
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </span>
                                            {isActive && <span className="w-1 h-1 rounded-full bg-[--accent-color] animate-pulse" style={{ backgroundColor: scene.color }}></span>}
                                        </div>
                                        <h4 className={`font-bold text-sm uppercase tracking-wide truncate transition-colors ${isActive ? 'text-foreground' : 'text-muted group-hover:text-foreground'}`}>
                                            {hotspot.title}
                                        </h4>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex-none p-4 border-t border-border/10 bg-background/20">
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted uppercase">
                        <span>状态：在线</span>
                        <span>v.2.0.4</span>
                    </div>
                </div>
            </div>
        </aside>

        {isMobile && !isMenuOpen && !activeHotspot && (
             <button
                onClick={() => setIsMenuOpen(true)}
                className="absolute right-4 bottom-20 z-30 w-12 h-12 bg-background/80 backdrop-blur-md border border-border/20 rounded-full flex items-center justify-center text-foreground shadow-lg animate-in fade-in zoom-in"
            >
                <List size={20} />
            </button>
        )}

      </div>

      <div 
        className="absolute bottom-0 w-full p-4 md:p-6 pointer-events-none flex justify-end items-end z-30 mix-blend-difference opacity-50 md:opacity-100 transition-all duration-300"
        style={{ paddingRight: isMobile ? '1rem' : (isMenuOpen ? '340px' : '80px') }}
      >
         <div className="font-mono text-[10px] md:text-xs text-white/60 text-right">
            <div>镜头_ID: {scene.id}-XC9</div>
            <div>坐标: {activeHotspot ? `${activeHotspot.x.toFixed(2)} / ${activeHotspot.y.toFixed(2)}` : '扫描中...'}</div>
         </div>
      </div>
    </div>
  );
};

export default SceneViewer;
