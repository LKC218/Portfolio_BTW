/**
 * HomeSelection 首页作品集选择组件
 * 
 * 功能说明：
 * - 展示所有作品集卡片
 * - 支持分组显示和滚动视差效果
 * - 响应式布局适配
 * - 集成 HeroSection 展示大图轮播
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Collection } from '../../types';
import { ArrowRight, Square, Maximize2, Minimize2 } from 'lucide-react';
import { useDeviceState } from '../../hooks/useDeviceState';
import HeroSection from './HeroSection';
import ScrollVideo from '../ui/ScrollVideo';

// ============================================
// 常量配置
// ============================================

/** 每组显示的作品集数量 */
const ITEMS_PER_GROUP = 3;

/** 滚动文本重复次数 */
const SCROLL_TEXT_REPEAT = 12;

// ============================================
// 组件属性
// ============================================

interface HomeSelectionProps {
  collections: Collection[];  // 作品集列表
  onSelect: (collection: Collection) => void;  // 选择作品集回调
  onHover?: (color: string | null) => void;    // 悬停颜色变化回调
}

// ============================================
// HomeSelection 组件
// ============================================

const HomeSelection: React.FC<HomeSelectionProps> = ({ collections, onSelect, onHover }) => {
  // 设备状态
  const device = useDeviceState();
  const isMobile = device !== 'desktop';
  const isMobileLandscape = device === 'mobile-landscape';
  
  // 全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // 滚动位置（用于视差效果）
  const [scrollTop, setScrollTop] = useState(0);

  // ============================================
  // 全屏状态监听
  // ============================================
  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    syncFullscreenState();
    document.addEventListener('fullscreenchange', syncFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreenState);
    };
  }, []);

  // ============================================
  // 窗口滚动监听（方案A：整页自然滚动）
  // ============================================
  useEffect(() => {
    const handleWindowScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, []);

  /** 切换全屏状态 */
  const handleToggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn('全屏切换失败', error);
    }
  }, []);

  // ============================================
  // 数据处理
  // ============================================
  
  /** 将作品集分组 */
  const chunkedCollections = [];
  for (let i = 0; i < collections.length; i += ITEMS_PER_GROUP) {
    chunkedCollections.push(collections.slice(i, i + ITEMS_PER_GROUP));
  }

  // ============================================
  // 渲染
  // ============================================
  return (
    <div className="relative z-10 w-full bg-transparent">
        
        {/* Hero 区域 */}
        <HeroSection 
          collectionsCount={collections.length}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
        />

        {/* 作品集卡片区域 */}
        <div className="w-full pb-20 bg-background">
            <div className="flex flex-col">

                {/* 作品集分组展示 */}
                {chunkedCollections.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                        
                        {/* 作品集卡片网格 */}
                        <div className={`w-full max-w-[1920px] mx-auto px-4 md:px-12 ${isMobileLandscape ? 'py-4' : 'py-6 sm:py-8 md:py-16'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 lg:gap-12">
                                {group.map((item, index) => (
                                    <div 
                                        key={item.id}
                                        role="button"
                                        tabIndex={0}
                                        data-cursor
                                        onClick={() => onSelect(item)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                onSelect(item);
                                            }
                                        }}
                                        onMouseEnter={() => onHover && onHover(item.color)}
                                        onMouseLeave={() => onHover && onHover(null)}
                                        className={`group relative flex flex-col bg-surface border border-border/10 overflow-hidden cursor-pointer transition-all duration-500 hover:border-border/30 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isMobileLandscape ? 'h-[240px]' : 'h-[320px] sm:h-[400px] md:h-[600px]'}`}
                                        style={{ 
                                            '--accent-color': item.color, 
                                        } as React.CSSProperties}
                                    >
                                        {/* 卡片背景图 */}
                                        <div className="absolute inset-0 z-0 bg-surface">
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
                                                        opacity-40 grayscale group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-60"
                                            />
                                            {/* 扫描线效果 */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] opacity-20 pointer-events-none"></div>
                                            
                                            {/* 渐变遮罩 */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-80 md:opacity-60 z-10"></div>
                                        </div>

                                        {/* 卡片内容 */}
                                        <div className="relative z-20 flex-1 p-4 sm:p-6 md:p-10 flex flex-col justify-end">
                                            {/* ID 标签 */}
                                            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                                                <div className="h-px w-8 bg-[--accent-color] transition-all duration-500 group-hover:w-16"></div>
                                                <span className="font-mono text-xs md:text-sm font-bold text-foreground/50 group-hover:text-[--accent-color] transition-colors">
                                                    {item.id}
                                                </span>
                                            </div>

                                            {/* 悬停时的旋转方块 */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110 pointer-events-none">
                                                <Square size={64} strokeWidth={0.5} className="text-[--accent-color] animate-[spin_12s_linear_infinite]" />
                                            </div>

                                            {/* 标题和描述 */}
                                            <div className="transform transition-transform duration-700 group-hover:-translate-y-2 md:group-hover:-translate-y-6 w-full">
                                                <h3 className="font-mono text-[10px] text-[--accent-color] uppercase tracking-[0.3em] mb-3 opacity-80">
                                                    {item.subtitle}
                                                </h3>
                                                <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground uppercase leading-[0.9] tracking-tighter mb-2 sm:mb-4">
                                                    {item.title}
                                                </h2>
                                                <p className="text-sm text-muted line-clamp-2 opacity-80 max-w-[90%] font-light leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                            
                                            {/* 访问按钮 */}
                                            <div className="relative mt-4 sm:mt-6 md:absolute md:bottom-10 md:right-10 opacity-100 md:opacity-0 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 md:delay-100 z-30">
                                                <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-foreground border-b border-foreground/30 pb-1 group-hover:border-[--accent-color] group-hover:text-[--accent-color] transition-colors">
                                                    <span>ACCESS DATA</span>
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* 顶部装饰线 */}
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-[--accent-color] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] origin-left z-30"></div>
                                        {/* 底部装饰线 */}
                                        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-[--accent-color] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] origin-right z-30"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 第一组卡片下方：滚动缩放视频区域 */}
                        {groupIndex === 0 && (
                            <ScrollVideo
                                 src={`${import.meta.env.BASE_URL}assets/Video/font-distortion.mp4`}
                                 className="w-full"
                                 title="扰动字体效果"
                                 subtitle="VIDEO_REEL"
                                 accentColor="#00F0FF"
                             />
                        )}

                        {/* 滚动视差文本 */}
                        <div className={`w-full border-y border-border/5 bg-surface/5 backdrop-blur-[2px] overflow-hidden select-none pointer-events-none ${isMobileLandscape ? 'py-3 mb-2' : 'py-4 sm:py-8 md:py-16 mb-4 md:mb-8'}`}>
                            <div 
                                className="flex items-center w-fit will-change-transform"
                                style={{ 
                                    transform: groupIndex % 2 === 0
                                        ? `translateX(-${scrollTop * 0.5}px)`
                                        : `translateX(${ -1000 + (scrollTop * 0.4) }px)`
                                }}
                            >
                                {[...Array(SCROLL_TEXT_REPEAT)].map((_, i) => (
                                    <div key={i} className="flex items-center shrink-0">
                                        <span className="text-4xl sm:text-6xl md:text-[10rem] font-black text-foreground/20 font-mono tracking-tighter leading-none mx-4 sm:mx-8 md:mx-20">
                                           Environment_Art <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/40 to-transparent">///</span> Collection_0{groupIndex + 1}
                                        </span>
                                        <span className="text-2xl sm:text-4xl md:text-8xl text-[--accent-color] opacity-40 font-light" style={{ '--accent-color': group[0]?.color || '#fff' } as React.CSSProperties}>
                                            +
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </React.Fragment>
                ))}

                {/* 底部结束标记 */}
                <div className="w-full py-12 sm:py-20 text-center">
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