
import React, { useState, useEffect } from 'react';
import { Collection } from '../../types';
import { ArrowRight, Square } from 'lucide-react';

interface HomeSelectionProps {
  collections: Collection[];
  onSelect: (collection: Collection) => void;
  onHover?: (color: string | null) => void;
}

// ============================================================================
// [配置区域] 顶部 Hero 图片与文案配置
// ============================================================================
const HERO_CONFIG = {
  image: '/assets/首页大图.jpg', 
  
  // 视觉主题色 (荧光绿)
  accentColor: '#CCFF00', 
  
  // 大标题 (背景虚字)
  bigText: 'Environment Art',
  
  // 标语
  slogan: '作品集 // LKC218',
  
  // 底部命令行文字
  bottomLine: '>> - \\\\ SYSTEM_ROOT >> X: USERS >> 2026'
};

const ITEMS_PER_GROUP = 3;

const formatTime = (date: Date): string => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const HomeSelection: React.FC<HomeSelectionProps> = ({ collections, onSelect, onHover }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [currentTime, setCurrentTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Helper to chunk array into groups of 3
  const chunkedCollections = [];
  for (let i = 0; i < collections.length; i += ITEMS_PER_GROUP) {
    chunkedCollections.push(collections.slice(i, i + ITEMS_PER_GROUP));
  }

  return (
    <div className="relative z-10 w-full h-screen flex flex-col bg-transparent overflow-hidden">
        
        {/* Header - Fixed or Sticky could be an option, but let's keep it clean at top */}
        <div className="flex-none px-6 pt-8 pb-4 md:px-12 md:pt-12 md:pb-8 flex items-end justify-between border-b border-border/10 bg-background/80 backdrop-blur-md z-30">
             <div className="space-y-2">
                 <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-foreground animate-pulse"></span>
                     <span className="font-mono text-[10px] text-muted tracking-[0.3em] uppercase">场景目录</span>
                 </div>
                 <h1 className="text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-none">
                     作品集 <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted">集合</span>
                 </h1>
             </div>
             <div className="hidden md:block text-right font-mono text-[10px] text-muted uppercase tracking-widest leading-relaxed">
                 <div>TOTAL_SECTORS: {collections.length}</div>
                 <div>SCROLL_MODE: PARALLAX_SYNC</div>
             </div>
        </div>

        {/* Main Scrollable Area */}
        <div 
            className="flex-1 w-full overflow-y-auto scrollbar-hide pb-20 bg-background"
            onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        >
            <div className="flex flex-col">

                {/* ================================================================================ */}
                {/* [NEW] HERO SECTION (Endfield Style) */}
                {/* ================================================================================ */}
                <div className="relative w-full h-[85vh] md:h-[90vh] shrink-0 overflow-hidden border-b border-border/10">
                    
                    {/* 1. Background Image Layer */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src={HERO_CONFIG.image} 
                            alt="Hero Background" 
                            className="w-full h-full object-cover transition-transform duration-100 ease-out"
                            style={{ 
                                // Simple Parallax Effect
                                transform: `translateY(${scrollTop * 0.3}px) scale(1.05)` 
                            }}
                        />
                        {/* Overlay to ensure text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 opacity-90"></div>
                        
                        {/* Dot Pattern Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                    </div>

                    {/* 2. Middle Layer: Giant Background Typography (Faded) */}
                    {/* Simulated "Behind the character" text effect */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden pointer-events-none z-10 opacity-30 mix-blend-overlay">
                         <h1 className="text-[15vw] leading-none font-black text-white whitespace-nowrap tracking-tighter select-none pl-[5vw]">
                             {HERO_CONFIG.bigText}
                         </h1>
                    </div>

                    {/* 3. Foreground Content Layer */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end pb-12 md:pb-24 px-6 md:px-12 pointer-events-none">
                        
                        {/* The Accent Stripe Decoration */}
                        <div className="absolute top-[60%] left-0 w-full h-[40px] md:h-[80px] bg-gradient-to-r from-transparent via-[rgba(204,255,0,0.1)] to-transparent flex items-center overflow-hidden">
                             <div className="w-full h-[1px] bg-[#CCFF00] opacity-50"></div>
                        </div>

                        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
                             
                             {/* Left Bottom: System Info (The command line style text) */}
                             <div className="font-mono text-[10px] md:text-xs text-white/70 tracking-widest space-y-2">
                                 <div className="flex items-center gap-4">
                                     <div className="w-3 h-3 bg-[#CCFF00]"></div> {/* Accent Square */}
                                     <div className="h-px w-12 bg-white/30"></div>
                                     <div>//.. ACCESS_GRANTED</div>
                                 </div>
                                 <div className="opacity-50">
                                     {HERO_CONFIG.bottomLine}
                                 </div>
                             </div>

                             {/* Right Bottom: Clock & Title (The main visual anchor) */}
                             <div className="flex flex-col items-start md:items-end text-left md:text-right">
                                 
                                 {/* Real-time Clock */}
                                 <div className="text-[100px] md:text-[200px] leading-[0.85] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-2xl font-mono"
                                      style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
                                     {currentTime}
                                 </div>
                                 
                                 {/* Highlight Bar with Text */}
                                 <div className="mt-4 bg-[#CCFF00] text-black px-4 md:px-8 py-2 md:py-3 transform -skew-x-12 origin-bottom-right">
                                     <span className="block transform skew-x-12 font-black text-lg md:text-2xl uppercase tracking-widest">
                                         &lt; {HERO_CONFIG.slogan} &gt;
                                     </span>
                                 </div>
                                 
                                 {/* Version / Release Text */}
                                 <div className="mt-2 font-mono text-[10px] text-white/40 uppercase tracking-[0.5em]">
                                     LIVE // Personal Work
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
                {/* ================================================================================ */}
                {/* END HERO SECTION */}
                {/* ================================================================================ */}


                {chunkedCollections.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                        
                        {/* 1. The Grid Group */}
                        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 py-8 md:py-16">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
                                {group.map((item, index) => (
                                    <div 
                                        key={item.id}
                                        onClick={() => onSelect(item)}
                                        onMouseEnter={() => onHover && onHover(item.color)}
                                        onMouseLeave={() => onHover && onHover(null)}
                                        className="group relative flex flex-col h-[400px] md:h-[600px] bg-surface border border-border/10 overflow-hidden cursor-pointer transition-all duration-500 hover:border-border/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                                        style={{ 
                                            '--accent-color': item.color, 
                                        } as React.CSSProperties}
                                    >
                                        {/* Background Image with Zoom Effect */}
                                        <div className="absolute inset-0 z-0 bg-surface">
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                // Light Mode: High opacity, no grayscale for clean look
                                                // Dark Mode: Lower opacity, grayscale for ambient look
                                                className="w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
                                                        opacity-90 grayscale-0 group-hover:scale-105 group-hover:opacity-100
                                                        dark:opacity-40 dark:grayscale dark:group-hover:grayscale-0 dark:group-hover:opacity-60"
                                            />
                                            {/* Scanline Overlay */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-10 dark:opacity-20 pointer-events-none"></div>
                                            
                                            {/* Gradient Bottom */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-80 md:opacity-60 z-10"></div>
                                        </div>

                                        {/* Content Layer */}
                                        <div className="relative z-20 flex-1 p-6 md:p-10 flex flex-col justify-end">
                                            {/* Top Floating ID */}
                                            <div className="absolute top-6 left-6 flex items-center gap-2">
                                                <div className="h-px w-8 bg-[--accent-color] transition-all duration-500 group-hover:w-16"></div>
                                                <span className="font-mono text-xs md:text-sm font-bold text-foreground/50 group-hover:text-[--accent-color] transition-colors">
                                                    {item.id}
                                                </span>
                                            </div>

                                            {/* Center Icon (Decoration) */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110 pointer-events-none">
                                                <Square size={64} strokeWidth={0.5} className="text-[--accent-color] animate-[spin_12s_linear_infinite]" />
                                            </div>

                                            {/* Text Content */}
                                            <div className="transform transition-transform duration-700 md:group-hover:-translate-y-6 w-full">
                                                <h3 className="font-mono text-[10px] text-[--accent-color] uppercase tracking-[0.3em] mb-3 opacity-80">
                                                    {item.subtitle}
                                                </h3>
                                                <h2 className="text-3xl md:text-5xl font-black text-foreground uppercase leading-[0.9] tracking-tighter mb-4">
                                                    {item.title}
                                                </h2>
                                                <p className="text-sm text-muted line-clamp-2 md:line-clamp-3 opacity-80 max-w-[90%] font-light leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                            
                                            {/* Action Button */}
                                            <div className="relative mt-6 md:absolute md:bottom-10 md:right-10 opacity-100 md:opacity-0 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 md:delay-100 z-30">
                                                <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-foreground border-b border-foreground/30 pb-1 group-hover:border-[--accent-color] group-hover:text-[--accent-color] transition-colors">
                                                    <span>ACCESS DATA</span>
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Hover Border Effects */}
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-[--accent-color] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] origin-left z-30"></div>
                                        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-[--accent-color] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] origin-right z-30"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Scroll-Driven Marquee Divider (Between groups) */}
                        <div className="w-full py-8 md:py-16 border-y border-border/5 bg-surface/5 backdrop-blur-[2px] overflow-hidden select-none pointer-events-none mb-4 md:mb-8">
                            <div 
                                className="flex items-center w-fit will-change-transform"
                                style={{ 
                                    // Odd lines move Left, Even lines move Right (for interesting visual rhythm)
                                    // Using scroll position directly creates the "drag" effect.
                                    transform: groupIndex % 2 === 0
                                        ? `translateX(-${scrollTop * 0.5}px)` // Move Left on Scroll Down
                                        : `translateX(${ -1000 + (scrollTop * 0.4) }px)` // Move Right on Scroll Down (start from offset)
                                }}
                            >
                                {/* Highly duplicated text to prevent running out of content during long scrolls */}
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="flex items-center shrink-0">
                                        <span className="text-6xl md:text-[10rem] font-black text-foreground/20 font-mono tracking-tighter leading-none mx-8 md:mx-20">
                                           Environment_Art <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/40 to-transparent">///</span> Collection_0{groupIndex + 1}
                                        </span>
                                        <span className="text-4xl md:text-8xl text-[--accent-color] opacity-40 font-light" style={{ '--accent-color': group[0]?.color || '#fff' } as React.CSSProperties}>
                                            +
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </React.Fragment>
                ))}

                {/* Footer Space */}
                <div className="w-full py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                        <div className="w-px h-16 bg-foreground"></div>
                        <span className="font-mono text-xs uppercase tracking-widest">End</span>
                        <div className="w-2 h-2 bg-foreground rounded-full"></div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};

export default HomeSelection;
