/**
 * SceneViewer 场景查看器组件
 * 
 * 功能说明：
 * - 展示场景主图和交互热点
 * - 支持热点悬停预览和点击详情
 * - 侧边栏菜单（可展开/收起）
 * - 响应式布局适配
 * - 支持减少动画模式
 */

import React, { useState, useRef, useEffect } from 'react';
import { Scene, Hotspot } from '../../types';
import { ArrowLeft, ChevronRight, ChevronLeft, Scan, List, X } from 'lucide-react';
import DetailCard from '../ui/DetailCard';
import HotspotPreview from './HotspotPreview';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useDeviceState } from '../../hooks/useDeviceState';

gsap.registerPlugin(useGSAP);

// ============================================
// 侧边栏动画配置
// ============================================

const SIDEBAR_ANIM = {
  widthCollapsed: 60,
  widthExpanded: 320,
  enter: { duration: 0.55, ease: 'back.out(1.2)' },
  exit: { duration: 0.3, ease: 'power3.in' },
  contentEnter: { duration: 0.3, delay: 0.18, ease: 'power2.out' },
  contentExit: { duration: 0.2, ease: 'power3.in' },
  collapsedFade: 0.22,
  listStaggerEnter: 0.045,
  listStaggerExit: 0.018,
  listDuration: 0.32,
  listEnterX: 0,
  listExitX: 6,
  contentEnterX: 0,
  contentExitX: 12,
  mobileEnter: { duration: 0.55, ease: 'back.out(1.2)' },
  mobileExit: { duration: 0.32, ease: 'power3.in' },
};

// ============================================
// 组件属性
// ============================================

interface SceneViewerProps {
  scene: Scene;  // 场景数据
  onBack: () => void;  // 返回回调
  onHotspotSelect?: (hotspot: Hotspot | null) => void;  // 热点选择回调
}

// ============================================
// SceneViewer 组件
// ============================================

const SceneViewer: React.FC<SceneViewerProps> = ({ scene, onBack, onHotspotSelect }) => {
  // 热点状态
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [activePreviewHotspot, setActivePreviewHotspot] = useState<Hotspot | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  // 菜单状态
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 设备状态
  const device = useDeviceState();
  const isMobile = device !== 'desktop';
  const isMobileLandscape = device === 'mobile-landscape';
  
  // 减少动画偏好
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // DOM 引用
  const containerRef = useRef<HTMLDivElement>(null);
  const previewUnmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);
  const collapsedBarRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const listItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const desktopTlRef = useRef<gsap.core.Timeline | null>(null);
  const mobileTlRef = useRef<gsap.core.Timeline | null>(null);

  // ============================================
  // 初始化
  // ============================================
  
  /** 处理热点选择 */
  const handleHotspotSelect = (h: Hotspot | null) => {
    setActiveHotspot(h);
    if (onHotspotSelect) {
      onHotspotSelect(h);
    }
  };

  /** 监听减少动画偏好 */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // ============================================
  // 预览控制
  // ============================================

  /** 打开预览 */
  const openPreview = (hotspot: Hotspot, clientX: number, clientY: number) => {
    if (isMobile || activeHotspot) return;

    if (previewUnmountTimerRef.current !== null) {
      clearTimeout(previewUnmountTimerRef.current);
      previewUnmountTimerRef.current = null;
    }

    setHoveredHotspot(hotspot);
    setActivePreviewHotspot(hotspot);
    setIsPreviewVisible(true);
  };

  /** 关闭预览 */
  const closePreview = () => {
    setHoveredHotspot(null);
    setIsPreviewVisible(false);

    if (previewUnmountTimerRef.current !== null) {
      clearTimeout(previewUnmountTimerRef.current);
    }

    // 延迟清除预览热点（等待动画完成）
    previewUnmountTimerRef.current = setTimeout(() => {
      setActivePreviewHotspot(null);
      previewUnmountTimerRef.current = null;
    }, 280);
  };

  // 当选择热点时关闭预览
  useEffect(() => {
    if (activeHotspot) {
      if (previewUnmountTimerRef.current !== null) {
        clearTimeout(previewUnmountTimerRef.current);
        previewUnmountTimerRef.current = null;
      }
      setIsPreviewVisible(false);
      setActivePreviewHotspot(null);
    }
  }, [activeHotspot]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (previewUnmountTimerRef.current !== null) {
        clearTimeout(previewUnmountTimerRef.current);
        previewUnmountTimerRef.current = null;
      }
    };
  }, []);

  // ============================================
  // 侧边栏 GSAP 动画
  // ============================================

  useGSAP(() => {
    if (prefersReducedMotion) {
      if (asideRef.current) {
        gsap.set(asideRef.current, {
          width: SIDEBAR_ANIM.widthCollapsed,
          xPercent: 0,
        });
      }
      if (collapsedBarRef.current) gsap.set(collapsedBarRef.current, { opacity: 1 });
      if (contentRef.current) gsap.set(contentRef.current, { opacity: 0 });
      return;
    }

    const items = listItemRefs.current.filter(Boolean) as HTMLElement[];

    desktopTlRef.current = null;
    mobileTlRef.current = null;

    // 移动端动画
    if (isMobile) {
      if (asideRef.current) {
        gsap.set(asideRef.current, { width: isMobileLandscape ? '62%' : '100%', xPercent: 100 });
      }
      if (collapsedBarRef.current) {
        gsap.set(collapsedBarRef.current, { opacity: 0 });
      }
      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 0, x: SIDEBAR_ANIM.contentExitX });
      }
      if (items.length) {
        gsap.set(items, { opacity: 0, x: SIDEBAR_ANIM.listExitX });
      }

      const mobileTl = gsap.timeline({ paused: true });
      mobileTl
        .to(asideRef.current, {
          xPercent: 0,
          duration: SIDEBAR_ANIM.mobileEnter.duration,
          ease: SIDEBAR_ANIM.mobileEnter.ease,
        }, 0)
        .to(collapsedBarRef.current, { opacity: 0, duration: SIDEBAR_ANIM.collapsedFade, ease: 'power2.out' }, 0)
        .to(contentRef.current, {
          opacity: 1,
          x: SIDEBAR_ANIM.contentEnterX,
          duration: SIDEBAR_ANIM.contentEnter.duration,
          ease: SIDEBAR_ANIM.contentEnter.ease,
        }, SIDEBAR_ANIM.contentEnter.delay)
        .to(items, {
          opacity: 1,
          x: SIDEBAR_ANIM.listEnterX,
          duration: SIDEBAR_ANIM.listDuration,
          stagger: SIDEBAR_ANIM.listStaggerEnter,
          ease: 'power2.out',
        }, SIDEBAR_ANIM.contentEnter.delay + 0.05)
        .addPause();

      mobileTl
        .to(items, {
          opacity: 0,
          x: SIDEBAR_ANIM.listExitX,
          duration: SIDEBAR_ANIM.listDuration * 0.55,
          stagger: SIDEBAR_ANIM.listStaggerExit,
          ease: SIDEBAR_ANIM.exit.ease,
        }, '>-0.05')
        .to(contentRef.current, {
          opacity: 0,
          x: SIDEBAR_ANIM.contentExitX,
          duration: SIDEBAR_ANIM.contentExit.duration,
          ease: SIDEBAR_ANIM.contentExit.ease,
        }, '<0.05')
        .to(collapsedBarRef.current, { opacity: 1, duration: 0.01, ease: 'none' }, '<')
        .to(asideRef.current, {
          xPercent: 100,
          duration: SIDEBAR_ANIM.mobileExit.duration,
          ease: SIDEBAR_ANIM.mobileExit.ease,
        }, '<0.02');

      mobileTlRef.current = mobileTl;
      return;
    }

    // 桌面端动画
    if (asideRef.current) {
      gsap.set(asideRef.current, { width: SIDEBAR_ANIM.widthCollapsed, xPercent: 0 });
    }
    if (collapsedBarRef.current) {
      gsap.set(collapsedBarRef.current, { opacity: 1 });
    }
    if (contentRef.current) {
      gsap.set(contentRef.current, { opacity: 0, x: SIDEBAR_ANIM.contentExitX });
    }
    if (items.length) {
      gsap.set(items, { opacity: 0, x: SIDEBAR_ANIM.listExitX });
    }

    const tl = gsap.timeline({ paused: true });
    tl
      .to(asideRef.current, {
        width: SIDEBAR_ANIM.widthExpanded,
        duration: SIDEBAR_ANIM.enter.duration,
        ease: SIDEBAR_ANIM.enter.ease,
      }, 0)
      .to(collapsedBarRef.current, { opacity: 0, duration: SIDEBAR_ANIM.collapsedFade, ease: 'power2.out' }, 0)
      .to(contentRef.current, {
        opacity: 1,
        x: SIDEBAR_ANIM.contentEnterX,
        duration: SIDEBAR_ANIM.contentEnter.duration,
        ease: SIDEBAR_ANIM.contentEnter.ease,
      }, SIDEBAR_ANIM.contentEnter.delay)
      .to(items, {
        opacity: 1,
        x: SIDEBAR_ANIM.listEnterX,
        duration: SIDEBAR_ANIM.listDuration,
        stagger: SIDEBAR_ANIM.listStaggerEnter,
        ease: 'power2.out',
      }, SIDEBAR_ANIM.contentEnter.delay + 0.05)
      .addPause();

    tl
      .to(items, {
        opacity: 0,
        x: SIDEBAR_ANIM.listExitX,
        duration: SIDEBAR_ANIM.listDuration * 0.55,
        stagger: SIDEBAR_ANIM.listStaggerExit,
        ease: SIDEBAR_ANIM.exit.ease,
      }, '>-0.05')
      .to(contentRef.current, {
        opacity: 0,
        x: SIDEBAR_ANIM.contentExitX,
        duration: SIDEBAR_ANIM.contentExit.duration,
        ease: SIDEBAR_ANIM.contentExit.ease,
      }, '<0.05')
      .to(asideRef.current, {
        width: SIDEBAR_ANIM.widthCollapsed,
        duration: SIDEBAR_ANIM.exit.duration,
        ease: SIDEBAR_ANIM.exit.ease,
      }, '<0.04')
      .to(collapsedBarRef.current, { opacity: 1, duration: SIDEBAR_ANIM.collapsedFade, ease: 'power2.in' }, `-=${SIDEBAR_ANIM.exit.duration * 0.6}`);

    desktopTlRef.current = tl;
  }, [prefersReducedMotion, isMobile, scene.id]);

  // 菜单状态变化时控制动画
  useEffect(() => {
    if (prefersReducedMotion) {
      const aside = asideRef.current;
      const collapsed = collapsedBarRef.current;
      const content = contentRef.current;
      const items = listItemRefs.current.filter(Boolean) as HTMLElement[];
      if (!aside) return;
      if (isMobile) {
        gsap.set(aside, { xPercent: isMenuOpen ? 0 : 100, width: isMobileLandscape ? '60%' : '100%' });
        gsap.set(collapsed, { opacity: 0 });
        gsap.set(content, { opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : SIDEBAR_ANIM.contentExitX });
        gsap.set(items, { opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : SIDEBAR_ANIM.listExitX });
      } else {
        gsap.set(aside, { width: isMenuOpen ? SIDEBAR_ANIM.widthExpanded : SIDEBAR_ANIM.widthCollapsed, xPercent: 0 });
        gsap.set(collapsed, { opacity: isMenuOpen ? 0 : 1 });
        gsap.set(content, { opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : SIDEBAR_ANIM.contentExitX });
        gsap.set(items, { opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : SIDEBAR_ANIM.listExitX });
      }
      if (content) content.style.pointerEvents = isMenuOpen ? 'auto' : 'none';
      if (collapsed) collapsed.style.pointerEvents = (isMobile || isMenuOpen) ? 'none' : 'auto';
      return;
    }
    const tl = isMobile ? mobileTlRef.current : desktopTlRef.current;
    if (contentRef.current) {
      contentRef.current.style.pointerEvents = isMenuOpen ? 'auto' : 'none';
    }
    if (collapsedBarRef.current) {
      collapsedBarRef.current.style.pointerEvents = (isMobile || isMenuOpen) ? 'none' : 'auto';
    }
    if (!tl) return;
    if (isMenuOpen) tl.play();
    else tl.reverse();
  }, [isMenuOpen, isMobile, prefersReducedMotion]);

  // ============================================
  // 渲染
  // ============================================
  return (
    <div className="fixed inset-0 z-20 bg-transparent flex flex-col animate-in fade-in duration-500 font-sans transition-colors">
      
      {/* 顶部栏 */}
      <div className="absolute top-0 left-0 right-0 z-40 p-4 md:p-6 flex items-center gap-4 md:gap-6 pointer-events-none">
        
        {/* 返回按钮 */}
        <button 
            onClick={onBack}
            className="pointer-events-auto flex-none flex items-center justify-center w-10 h-10 md:w-12 md:h-12 group bg-background/60 backdrop-blur-md border border-border/10 hover:bg-[--accent-color] hover:text-black hover:border-transparent transition-all duration-300 rounded-sm text-foreground"
            style={{ '--accent-color': scene.color } as React.CSSProperties}
            title="返回"
        >
            <ArrowLeft size={20} className="md:w-6 md:h-6" />
        </button>

        <div className="h-8 w-px bg-border/10 hidden md:block"></div>

        {/* 场景标题 */}
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

      {/* 主视口 */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden bg-transparent">
        
        {/* 背景图 */}
        <img 
            src={scene.mainImage} 
            alt={scene.title} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 
                ${activeHotspot 
                    ? 'scale-105 opacity-20 blur-[2px] grayscale'  // 分析模式
                    : 'scale-100 opacity-80'  // 视图模式
                }`}
        />
        
        {/* 装饰网格覆盖 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        
        {/* 暗角效果 */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(var(--background),0.8)_100%)]" />

        {/* 交互热点层 */}
        <div className="absolute inset-0 z-30 pointer-events-none group/hotspots">
            {scene.hotspots.map((hotspot) => {
                const isActive = activeHotspot?.id === hotspot.id;
                const isHovered = !isMobile && hoveredHotspot?.id === hotspot.id && !activeHotspot;
                const hotspotLeft = Number.isFinite(hotspot.x) ? `${hotspot.x}%` : '0%';
                const hotspotTop = Number.isFinite(hotspot.y) ? `${hotspot.y}%` : '0%';

                return (
                    <button
                        key={hotspot.id}
                        onMouseEnter={(event) => {
                            if (!isMobile) {
                              openPreview(hotspot, event.clientX, event.clientY);
                            }
                        }}
                        onMouseLeave={() => {
                            if (!isMobile) {
                              closePreview();
                            }
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            closePreview();
                            handleHotspotSelect(isActive ? null : hotspot);
                        }}
                        className={`absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 ${isMobile ? 'w-14 h-14' : 'w-14 h-14'} flex items-center justify-center group outline-none focus:outline-none transition-all duration-300 active:scale-90`}
                        style={{ left: hotspotLeft, top: hotspotTop }}
                        aria-label={`选择 ${hotspot.title}`}
                    >
                        {/* 激活状态脉冲 */}
                        {isActive && (
                            <div 
                                className="absolute inset-0 rounded-full border opacity-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" 
                                style={{ borderColor: scene.color }}
                            ></div>
                        )}

                        {/* 悬停边框 */}
                        {!isActive && (
                            <div className="absolute inset-0 rounded-full border border-current scale-50 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out text-white/50"></div>
                        )}

                        {/* 热点指示器 */}
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

                        {/* 热点标签 */}
                        <div className={`absolute left-1/2 top-full mt-3 -translate-x-1/2 pointer-events-none transition-all duration-300 ${!isActive && !isHovered ? 'opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0' : isActive ? 'opacity-0' : 'opacity-0'}`}>
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

            {/* 热点预览（桌面端） */}
            <HotspotPreview
              activePreviewHotspot={activePreviewHotspot}
              isPreviewVisible={isPreviewVisible}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
            />
        </div>

        {/* 瞄准器和详情卡片 */}
        {activeHotspot && (
            <div className="absolute inset-0 pointer-events-none z-30">
                {/* 瞄准器 */}
                <div 
                    className="absolute w-16 h-16 md:w-24 md:h-24 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out"
                    style={{ top: Number.isFinite(activeHotspot.y) ? `${activeHotspot.y}%` : '0%', left: Number.isFinite(activeHotspot.x) ? `${activeHotspot.x}%` : '0%' }}
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

                {/* 详情卡片 */}
                <div 
                    className={`absolute pointer-events-auto transition-all duration-500 z-50 ${isMobileLandscape ? 'right-0 top-0 bottom-0 w-[58%] max-w-[560px]' : isMobile ? 'inset-x-0 bottom-0' : 'max-w-sm'}`}
                    style={isMobile ? {} : {
                        top: `clamp(15%, ${Number.isFinite(activeHotspot.y) ? activeHotspot.y : 0}%, 50%)`, 
                        left: activeHotspot.x > 50 ? `auto` : `clamp(20px, ${(Number.isFinite(activeHotspot.x) ? activeHotspot.x : 0) + 8}%, 50%)`,
                        right: activeHotspot.x > 50 ? `clamp(340px, ${100 - (Number.isFinite(activeHotspot.x) ? activeHotspot.x : 0) + 8}%, 80%)` : `auto`,
                    }}
                >
                    <DetailCard 
                        hotspot={activeHotspot} 
                        onClose={() => handleHotspotSelect(null)} 
                        sceneTitle={scene.title}
                        accentColor={scene.color}
                        isMobile={isMobile}
                        isLandscape={isMobileLandscape}
                        onExpand={(expanded) => {
                            if (expanded) setIsMenuOpen(false);
                        }}
                    />
                </div>
            </div>
        )}

        {/* 侧边栏菜单 */}
        <aside 
            ref={asideRef}
            onMouseEnter={() => !isMobile && setIsMenuOpen(true)}
            onMouseLeave={() => !isMobile && setIsMenuOpen(false)}
            className="absolute top-0 right-0 h-full z-50 bg-background/90 md:bg-background/80 backdrop-blur-xl border-l border-border/10 flex flex-col shadow-2xl overflow-hidden"
        >
            {/* 桌面端收起状态 */}
            {!isMobile && (
                 <div 
                    ref={collapsedBarRef}
                    className="absolute inset-0 w-[60px] border-l border-border/10 bg-background/90 flex flex-col items-center pt-24 gap-4"
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
                                onClick={() => handleHotspotSelect(hotspot)}
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

            {/* 展开内容 */}
            <div ref={contentRef} className="flex flex-col h-full w-full overflow-hidden">
                 
                {/* 头部 */}
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

                {/* 热点列表 */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4">
                    <div className="flex flex-col gap-2 px-4">
                        {scene.hotspots.map((hotspot, idx) => {
                            const isActive = activeHotspot?.id === hotspot.id;
                            return (
                                <button
                                    key={hotspot.id}
                                    ref={(el) => { listItemRefs.current[idx] = el; }}
                                    onClick={() => {
                                        handleHotspotSelect(isActive ? null : hotspot);
                                        if (isMobile) setIsMenuOpen(false);
                                    }}
                                    className={`group relative flex items-center gap-4 w-full text-left border border-transparent transition-all duration-300 overflow-hidden active:scale-[0.985] ${isMobileLandscape ? 'p-2.5' : 'p-3'} ${isActive ? 'bg-surface/5 border-border/20' : 'hover:bg-surface/5 hover:border-border/10'}`}
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

                {/* 底部状态栏 */}
                <div className="flex-none p-4 border-t border-border/10 bg-background/20">
                    <div className="flex justify-between items-center text-[10px] font-mono text-muted uppercase">
                        <span>状态：在线</span>
                        <span>v.2.0.4</span>
                    </div>
                </div>
            </div>
        </aside>

        {/* 移动端菜单按钮 */}
        {isMobile && !isMenuOpen && !activeHotspot && (
             <button
                onClick={() => setIsMenuOpen(true)}
                className={`absolute right-4 z-30 w-12 h-12 bg-background/80 backdrop-blur-md border border-border/20 rounded-full flex items-center justify-center text-foreground shadow-lg animate-in fade-in zoom-in ${isMobileLandscape ? 'bottom-4' : 'bottom-20'}`}
            >
                <List size={20} />
            </button>
        )}

      </div>

      {/* 底部信息栏 */}
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