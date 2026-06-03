
import React, { useRef } from 'react';
import { Scene, Collection } from '../../types';
import { MoveRight, Plus, Crosshair, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useDeviceState } from '../../hooks/useDeviceState';

gsap.registerPlugin(useGSAP);

const ANIM_CARD_STAGGER = 0.12;
const ANIM_CARD_CLIP_DURATION = 0.6;
const ANIM_IMG_SETTLE_DURATION = 0.8;
const ANIM_TEXT_SLIDE_DURATION = 0.4;
const ANIM_EASE_CLIP = 'power4.out';
const ANIM_EASE_SETTLE = 'power2.out';
const ANIM_EASE_TEXT = 'power3.out';

interface GalleryProps {
  scenes: Scene[];
  collection?: Collection;
  onSelect: (scene: Scene) => void;
  onHover?: (color: string | null) => void;
  onBack?: () => void;
}

const Gallery: React.FC<GalleryProps> = ({ scenes, collection, onSelect, onHover, onBack }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const headerPulseRef = useRef<HTMLDivElement>(null);
  const headerTitleRef = useRef<HTMLDivElement>(null);
  const headerMetaRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const device = useDeviceState();
  const isMobile = device !== 'desktop';
  const isMobileLandscape = device === 'mobile-landscape';
  const isMobilePortrait = device === 'mobile-portrait';

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({
      defaults: { ease: ANIM_EASE_TEXT },
      onComplete: () => {
        const root = containerRef.current;
        if (!root) return;
        root.querySelectorAll('.gallery-card').forEach(el => gsap.set(el, { clearProps: 'clipPath' }));
        root.querySelectorAll('.card-img').forEach(el => gsap.set(el, { clearProps: 'transform,opacity' }));
        root.querySelectorAll('.card-gradient').forEach(el => gsap.set(el, { clearProps: 'opacity' }));
        root.querySelectorAll('.card-sector-label,.card-sector-id').forEach(el => gsap.set(el, { clearProps: 'transform,opacity' }));
        root.querySelectorAll('.card-crosshair-wrap').forEach(el => gsap.set(el, { clearProps: 'transform,opacity' }));
        root.querySelectorAll('.card-divider').forEach(el => gsap.set(el, { clearProps: 'transform' }));
        root.querySelectorAll('.card-subtitle').forEach(el => gsap.set(el, { clearProps: 'opacity' }));
        root.querySelectorAll('.card-title').forEach(el => gsap.set(el, { clearProps: 'transform,opacity' }));
        if (headerRef.current) gsap.set(headerRef.current, { clearProps: 'clipPath' });
        if (headerPulseRef.current) gsap.set(headerPulseRef.current, { clearProps: 'transform' });
        if (headerTitleRef.current) gsap.set(headerTitleRef.current, { clearProps: 'transform,opacity' });
        if (headerMetaRef.current) gsap.set(headerMetaRef.current, { clearProps: 'transform,opacity' });
        if (footerRef.current) gsap.set(footerRef.current, { clearProps: 'clipPath' });
      }
    });

    tl.fromTo(headerRef.current,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 0.5, ease: ANIM_EASE_CLIP }
    )
    .fromTo(headerPulseRef.current,
      { scale: 0 },
      { scale: 1, duration: 0.3, ease: 'back.out(2)' },
      0.15
    )
    .fromTo(headerTitleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: ANIM_TEXT_SLIDE_DURATION },
      0.1
    )
    .fromTo(headerMetaRef.current,
      { x: 10, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3 },
      0.25
    );

    const cards = gsap.utils.toArray<HTMLElement>('.gallery-card', containerRef.current);
    cards.forEach((card, i) => {
      const d = 0.3 + i * ANIM_CARD_STAGGER;

      tl.fromTo(card,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: ANIM_CARD_CLIP_DURATION, ease: ANIM_EASE_CLIP },
        d
      );

      const img = card.querySelector('.card-img') as HTMLElement;
      if (img) tl.fromTo(img,
        { scale: 1.15, opacity: 0 },
        { scale: 1, opacity: 1, duration: ANIM_IMG_SETTLE_DURATION, ease: ANIM_EASE_SETTLE },
        d + 0.1
      );

      const gradient = card.querySelector('.card-gradient') as HTMLElement;
      if (gradient) tl.fromTo(gradient,
        { opacity: 0 },
        { opacity: 0.9, duration: 0.4 },
        d + 0.2
      );

      const sectorLabel = card.querySelector('.card-sector-label') as HTMLElement;
      if (sectorLabel) tl.fromTo(sectorLabel,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 0.7, duration: 0.3, ease: ANIM_EASE_TEXT },
        d + 0.25
      );

      const sectorId = card.querySelector('.card-sector-id') as HTMLElement;
      if (sectorId) tl.fromTo(sectorId,
        { y: -15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: ANIM_EASE_TEXT },
        d + 0.3
      );

      const crosshair = card.querySelector('.card-crosshair-wrap') as HTMLElement;
      if (crosshair) tl.fromTo(crosshair,
        { rotation: -90, opacity: 0 },
        { rotation: 0, opacity: 0.3, duration: 0.5, ease: ANIM_EASE_SETTLE },
        d + 0.3
      );

      const divider = card.querySelector('.card-divider') as HTMLElement;
      if (divider) tl.fromTo(divider,
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.3, ease: 'power4.out' },
        d + 0.35
      );

      const subtitle = card.querySelector('.card-subtitle') as HTMLElement;
      if (subtitle) tl.fromTo(subtitle,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
        d + 0.4
      );

      const title = card.querySelector('.card-title') as HTMLElement;
      if (title) tl.fromTo(title,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: ANIM_TEXT_SLIDE_DURATION, ease: ANIM_EASE_TEXT },
        d + 0.3
      );
    });

    const footerDelay = Math.max(0.3 + cards.length * ANIM_CARD_STAGGER + 0.3, 1.2);
    tl.fromTo(footerRef.current,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.4, ease: ANIM_EASE_CLIP },
      footerDelay
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative z-10 w-full h-screen overflow-hidden flex flex-col bg-transparent">

      <header ref={headerRef} className={`flex-none flex items-center border-b border-border/10 bg-background/80 backdrop-blur-sm z-20 transition-colors ${isMobileLandscape ? 'h-14' : 'h-16 md:h-24'}`}>
        <div className="w-full px-4 md:px-8 flex justify-between items-center">

            <div ref={headerTitleRef} className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                    <div ref={headerPulseRef} className="w-1.5 h-1.5 bg-red-500 rounded-sm animate-pulse"></div>
                    <span className="font-mono text-[9px] text-muted tracking-[0.2em] uppercase">Unity_READY</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none text-foreground">
                    {collection ? collection.title : 'GALLERY'} <span className="text-foreground/30 font-light">| {collection ? collection.id : 'DEMO'}</span>
                </h1>
            </div>

            <div ref={headerMetaRef} className="flex items-center gap-6">
                 <div className="hidden md:flex flex-col items-end text-right">
                     <div className="flex items-center gap-4 text-[9px] font-mono text-muted uppercase tracking-widest border-b border-border/10 pb-1 mb-1">
                        <span>GRID_X: 1920</span>
                        <span>GRID_Y: 1080</span>
                        <span>FPS: 60</span>
                     </div>
                     <p className="text-[10px] text-muted">选择数据扇区以加载</p>
                 </div>

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

      <div className={`flex-1 flex flex-col md:flex-row min-h-0 divide-y md:divide-y-0 md:divide-x divide-border/10 overflow-y-auto md:overflow-hidden scrollbar-hide ${isMobileLandscape ? 'flex-row divide-y-0 divide-x overflow-hidden' : ''}`}>
        {scenes.map((scene) => (
          <div
            key={scene.id}
            onClick={() => onSelect(scene)}
            onMouseEnter={() => onHover && onHover(scene.color)}
            onMouseLeave={() => onHover && onHover(null)}
            className={`gallery-card group relative flex-none md:h-auto md:flex-1 hover:md:flex-[3] transition-[flex-grow,transform,border-color] duration-300 md:duration-500 ease-[cubic-bezier(0.2,0,0,1)] cursor-pointer overflow-hidden bg-surface shrink-0 active:scale-[0.985] active:border-[--accent-color] ${isMobileLandscape ? 'h-auto flex-1 min-w-0' : isMobilePortrait ? 'h-[220px] sm:h-[260px]' : 'h-[240px] sm:h-[280px]'}`}
            style={{ '--accent-color': scene.color } as React.CSSProperties}
          >
            <div className="absolute inset-0 w-full h-full bg-surface">
                <img
                    src={scene.mainImage}
                    alt={scene.title}
                    className="card-img w-full h-full object-cover transition-all duration-700
                               filter grayscale brightness-[0.42] contrast-100 md:brightness-[0.3] group-hover:scale-105 group-hover:filter-none group-hover:brightness-[0.5] active:scale-105 active:filter-none active:brightness-[0.55]"
                />
            </div>

            <div className="card-gradient absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-90 transition-opacity duration-500"></div>

            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[--accent-color] transition-colors duration-300 z-30 pointer-events-none opacity-0 group-hover:opacity-100"></div>

            <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8">

                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="card-sector-label font-mono text-[9px] text-[--accent-color] uppercase tracking-widest mb-1 opacity-70">Sector</span>
                        <span className="card-sector-id font-mono text-2xl md:text-3xl font-bold text-foreground/90 leading-none tracking-tighter">{scene.id}</span>
                    </div>

                    <div className="card-crosshair-wrap opacity-30 group-hover:opacity-100 transition-opacity">
                        <Crosshair className="w-4 h-4 text-foreground group-hover:text-[--accent-color] animate-[spin_10s_linear_infinite]" />
                    </div>
                </div>

                <div className="relative flex flex-col items-start transform transition-transform duration-500 ease-out group-hover:-translate-y-2">

                    <div className="card-divider w-8 h-[2px] bg-[--accent-color] mb-3 transition-all duration-500 group-hover:w-full max-w-[60px] group-hover:max-w-[100px]"></div>

                    <div className="flex items-center gap-2 mb-1">
                        <span className="card-subtitle font-mono text-[9px] text-foreground/50 uppercase tracking-[0.2em]">{scene.subtitle}</span>
                    </div>

                    <h2 className="card-title text-xl sm:text-2xl md:text-4xl font-black text-foreground uppercase leading-[1.1] tracking-normal mb-0 md:max-w-xs break-words">
                        {scene.title}
                    </h2>

                    <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 opacity-0 group-hover:max-h-48 group-hover:opacity-100 group-hover:mt-4 w-full">
                        <p className="text-[11px] md:text-sm text-muted font-medium leading-relaxed line-clamp-2 md:line-clamp-3 mb-3 md:mb-4 max-w-sm">
                            {scene.description}
                        </p>

                        <div className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-background uppercase tracking-wider px-3 py-1.5 bg-[--accent-color] hover:bg-foreground hover:text-background transition-colors cursor-pointer">
                            <span>进入场景</span>
                            <MoveRight className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>

            {isMobile && (
            <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 z-20 pointer-events-none">
                 <div className="p-2 border border-border/20 rounded-full bg-background/40 backdrop-blur-md">
                     <Plus className="w-4 h-4 text-[--accent-color]" />
                 </div>
            </div>
            )}

          </div>
        ))}
      </div>

       <div ref={footerRef} className="flex-none h-10 border-t border-border/10 bg-background flex items-center px-4 md:px-8 justify-between text-[9px] font-mono text-muted uppercase tracking-wider transition-colors">
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
