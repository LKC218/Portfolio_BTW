
import React from 'react';
import { Scene, Collection } from '../types';
import { MoveRight, Plus, Crosshair, ArrowLeft } from 'lucide-react';

interface GalleryProps {
  scenes: Scene[];
  collection?: Collection; // Added collection prop for header info
  onSelect: (scene: Scene) => void;
  onHover?: (color: string | null) => void;
  onBack?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ scenes, collection, onSelect, onHover, onBack }) => {
  return (
    <div className="relative z-10 w-full h-screen overflow-hidden flex flex-col bg-transparent">
      
      {/* === GLOBAL HEADER (Fixed Grid Height) === */}
      <header className="flex-none h-20 md:h-24 flex items-center border-b border-border/10 bg-background/80 backdrop-blur-sm z-20 transition-colors">
        <div className="w-full px-6 md:px-8 flex justify-between items-center">
            
            {/* [LEFT] Title Section */}
            <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-sm animate-pulse"></div>
                    <span className="font-mono text-[9px] text-muted tracking-[0.2em] uppercase">Unity_READY</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none text-foreground">
                    {collection ? collection.title : 'GALLERY'} <span className="text-foreground/30 font-light">| {collection ? collection.id : 'DEMO'}</span>
                </h1>
            </div>
            
            {/* [RIGHT] Metadata & Back Button */}
            <div className="flex items-center gap-6">
                 {/* Metadata (Desktop Only) */}
                 <div className="hidden md:flex flex-col items-end text-right">
                     <div className="flex items-center gap-4 text-[9px] font-mono text-muted uppercase tracking-widest border-b border-border/10 pb-1 mb-1">
                        <span>GRID_X: 1920</span>
                        <span>GRID_Y: 1080</span>
                        <span>FPS: 60</span>
                     </div>
                     <p className="text-[10px] text-muted">选择数据扇区以加载</p>
                 </div>

                 {/* Back to Home Button */}
                 {onBack && (
                     <>
                        <div className="h-8 w-px bg-border/10 hidden md:block"></div>
                        <button 
                            onClick={onBack}
                            className="group flex items-center justify-center w-10 h-10 border border-border/10 bg-surface/5 hover:bg-foreground hover:text-background hover:border-transparent transition-all duration-300 text-foreground"
                            title="返回区域选择"
                        >
                            <ArrowLeft size={20} />
                        </button>
                     </>
                 )}
            </div>
        </div>
      </header>

      {/* === MAIN CONTENT GRID === */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 divide-y md:divide-y-0 md:divide-x divide-border/10 overflow-y-auto md:overflow-hidden scrollbar-hide">
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSelect(scene)}
            onMouseEnter={() => onHover && onHover(scene.color)}
            onMouseLeave={() => onHover && onHover(null)}
            className="group relative flex-none h-[280px] md:h-auto md:flex-1 hover:md:flex-[3] transition-[flex-grow] duration-500 ease-[cubic-bezier(0.2,0,0,1)] cursor-pointer overflow-hidden bg-surface shrink-0"
            style={{ 
                '--accent-color': scene.color 
            } as React.CSSProperties}
          >
            {/* --- BACKGROUND LAYERS --- */}
            
            {/* 1. Base Image */}
            <div className="absolute inset-0 w-full h-full bg-surface">
                <img
                    src={scene.mainImage}
                    alt={scene.title}
                    // Light Mode: Normal brightness/saturation (Clean look)
                    // Dark Mode: Low brightness/Grayscale (Cyberpunk look)
                    className="w-full h-full object-cover transition-all duration-700 
                               filter brightness-100 saturate-110 contrast-105 group-hover:scale-105
                               dark:grayscale dark:brightness-[0.3] dark:contrast-100 dark:group-hover:filter-none dark:group-hover:brightness-[0.5]"
                />
            </div>

            {/* 2. Gradient Overlay for Text Contrast */}
            {/* Light Mode: Subtle white fade at bottom for readability */}
            {/* Dark Mode: Stronger fade for dramatic effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-90 transition-opacity duration-500"></div>
            
            {/* 3. Grid Pattern Overlay (Visible on Hover) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.1)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            {/* 4. Active Border Highlight */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[--accent-color] transition-colors duration-300 z-30 pointer-events-none opacity-0 group-hover:opacity-100"></div>

            {/* --- CONTENT LAYOUT SYSTEM --- */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8">
                
                {/* [TOP SECTION] Header Grid */}
                <div className="flex justify-between items-start">
                    {/* Top Left: Sector ID */}
                    <div className="flex flex-col">
                        <span className="font-mono text-[9px] text-[--accent-color] uppercase tracking-widest mb-1 opacity-70">Sector</span>
                        <span className="font-mono text-2xl md:text-3xl font-bold text-foreground/90 leading-none tracking-tighter">{scene.id}</span>
                    </div>

                    {/* Top Right: Status Icon */}
                    <div className="opacity-30 group-hover:opacity-100 transition-opacity">
                        <Crosshair className="w-4 h-4 text-foreground group-hover:text-[--accent-color] animate-[spin_10s_linear_infinite]" />
                    </div>
                </div>

                {/* [BOTTOM SECTION] Aligned Content Info */}
                <div className="relative flex flex-col items-start transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    
                    {/* Decorative Divider Line */}
                    <div className="w-8 h-[2px] bg-[--accent-color] mb-3 transition-all duration-500 group-hover:w-full max-w-[60px] group-hover:max-w-[100px]"></div>

                    {/* Subtitle (English) - Always Visible */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] text-foreground/50 uppercase tracking-[0.2em]">{scene.subtitle}</span>
                    </div>
                    
                    {/* Main Title (Chinese) - Always Visible for stability */}
                    <h2 className="text-2xl md:text-4xl font-black text-foreground uppercase leading-[1.1] tracking-normal mb-0 md:max-w-xs break-words">
                        {scene.title}
                    </h2>

                    {/* Description Grid - Revealing smoothly on hover */}
                    <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 group-hover:mt-4 w-full">
                        <p className="text-xs md:text-sm text-muted font-medium leading-relaxed line-clamp-3 mb-4 max-w-sm">
                            {scene.description}
                        </p>
                        
                        <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-background uppercase tracking-wider px-3 py-1.5 bg-[--accent-color] hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                            <span>进入场景</span>
                            <MoveRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Touch Indicator */}
            <div className="md:hidden absolute right-6 bottom-6 z-20 pointer-events-none">
                 <div className="p-2 border border-border/20 rounded-full bg-background/40 backdrop-blur-md">
                     <Plus className="w-4 h-4 text-[--accent-color]" />
                 </div>
            </div>
            
          </div>
        ))}
      </div>
      
       {/* === FOOTER STATUS BAR === */}
       <div className="flex-none h-10 border-t border-border/10 bg-background flex items-center px-4 md:px-8 justify-between text-[9px] font-mono text-muted uppercase tracking-wider transition-colors">
         <div className="flex items-center gap-4">
             <span className="flex items-center gap-1">
                 <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                 ONLINE
             </span>
             <span className="hidden md:inline">SECURE_CONNECTION_ESTABLISHED</span>
         </div>
         <div className="flex items-center gap-4">
             <span>REC: {scenes.length}</span>
             <span>VER: 2.0.5</span>
         </div>
      </div>
    </div>
  );
};

export default Gallery;
