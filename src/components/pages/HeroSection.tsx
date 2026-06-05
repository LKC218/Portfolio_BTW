/**
 * HeroSection 首页英雄区域组件
 * 
 * 功能说明：
 * - 大图轮播背景展示
 * - 响应式标题和时钟显示
 * - 标语（slogan）交互效果
 * - 点阵噪声背景动画
 * - 滚动视差效果
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { useDeviceState } from '../../hooks/useDeviceState';
import RollingClock from '../ui/RollingClock';

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(SplitText);

// ============================================
// 配置常量
// ============================================

/** Hero 区域配置 */
const HERO_CONFIG = {
  images: [
    '/assets/首页大图.jpg',
    '/assets/首页大图2.jpg',
    '/assets/首页大图3.jpg'
  ],
  accentColor: '#CCFF00', 
  bigText: 'Environment Art',
  slogan: '作品集 // LKC218',
  bottomLine: '>> - \\\\ SYSTEM_ROOT >> X: USERS >> 2026'
};

// 动画参数
const TILT_MAX_DEG = 12;
const TILT_PERSPECTIVE = 800;
const PARALLAX_FACTOR_LABEL = 3;
const PARALLAX_FACTOR_TITLE = 6;
const SLOGAN_TILT_MAX_DEG = 15;
const SLOGAN_TILT_PERSPECTIVE = 600;
const SLOGAN_PARALLAX_FACTOR = 4;
const SLOGAN_SHADOW_OFFSET = 8;
const BIGTEXT_ENTER_DURATION = 0.7;
const BIGTEXT_STAGGER = 0.04;
const BIGTEXT_EASE = 'power4.out';
const BIGTEXT_ENTER_DELAY = 0.3;

// 文本扰乱效果参数
const SCRAMBLE_CHARS = '/\\|_+-=<>:;.*#01X';
const SCRAMBLE_DURATION = 520;

// 点阵噪声参数
const DOT_GRID_SIZE = 20;
const DOT_NOISE_REFRESH_MS = 180;
const DOT_DEFAULT_ACTIVE_RATE = 0.02;
const DOT_HOVER_ACTIVE_RATE = 0.05;
const DOT_ASCII_CHARS = ['.', ':', '-', '0', '4', '6', '8', '9', 'A', '/', '\\', '+'];

// ============================================
// 类型定义
// ============================================

/** 点阵噪声单元格 */
interface DotNoiseCell {
  id: string;
  x: number;
  y: number;
  char: string;
  opacity: number;
  color: string;
}

/** HeroSection 组件属性 */
interface HeroSectionProps {
  collectionsCount: number;  // 作品集数量，用于状态栏显示
  isFullscreen: boolean;     // 是否全屏状态
  onToggleFullscreen: () => void;  // 切换全屏回调
}

// ============================================
// 工具函数
// ============================================

/**
 * 播放文本扰乱动画
 * 将文本从随机字符逐渐过渡到最终文本
 */
const playTextScramble = (element: HTMLElement | null, finalText: string, duration = SCRAMBLE_DURATION) => {
  if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const start = performance.now();
  const sourceText = finalText;

  const tick = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    const nextText = sourceText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        const revealThreshold = index / sourceText.length;
        if (progress > revealThreshold + Math.random() * 0.28) return char;
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join('');

    element.textContent = progress >= 1 ? sourceText : nextText;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

/**
 * 创建点阵噪声单元格
 * 生成随机分布的 ASCII 字符网格
 */
const createDotNoiseCells = (width: number, height: number, activeRate: number): DotNoiseCell[] => {
  const cols = Math.ceil(width / DOT_GRID_SIZE);
  const rows = Math.ceil(height / DOT_GRID_SIZE);
  const total = cols * rows;
  const activeCount = Math.max(1, Math.floor(total * activeRate));
  const used = new Set<number>();

  return Array.from({ length: activeCount }, (_, index) => {
    let cellIndex = Math.floor(Math.random() * total);
    while (used.has(cellIndex)) {
      cellIndex = Math.floor(Math.random() * total);
    }
    used.add(cellIndex);

    const col = cellIndex % cols;
    const row = Math.floor(cellIndex / cols);
    const isAccent = Math.random() < 0.15;

    return {
      id: `${index}-${cellIndex}`,
      x: col * DOT_GRID_SIZE,
      y: row * DOT_GRID_SIZE,
      char: DOT_ASCII_CHARS[Math.floor(Math.random() * DOT_ASCII_CHARS.length)],
      opacity: isAccent ? 0.14 + Math.random() * 0.04 : 0.08 + Math.random() * 0.05,
      color: isAccent ? '#CCFF00' : '#FFFFFF'
    };
  });
};

/**
 * 播放大文本进入动画
 * 字符从下方滑入并淡入
 */
const playBigTextAnimation = (chars: Element[]) => {
  gsap.killTweensOf(chars);
  gsap.set(chars, { yPercent: 120, opacity: 0 });
  gsap.to(chars, {
    yPercent: 0,
    opacity: 1,
    duration: BIGTEXT_ENTER_DURATION,
    stagger: BIGTEXT_STAGGER,
    ease: BIGTEXT_EASE
  });
};

// ============================================
// HeroSection 组件
// ============================================

const HeroSection: React.FC<HeroSectionProps> = ({ collectionsCount, isFullscreen, onToggleFullscreen }) => {
  // 设备状态
  const device = useDeviceState();
  const isMobile = device !== 'desktop';
  const isMobileLandscape = device === 'mobile-landscape';

  // 点阵噪声状态
  const [dotNoiseCells, setDotNoiseCells] = useState<DotNoiseCell[]>([]);
  const [isDotNoiseHovering, setIsDotNoiseHovering] = useState(false);

  // Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const pulseDotRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const statusTotalRef = useRef<HTMLDivElement>(null);
  const statusModeRef = useRef<HTMLDivElement>(null);
  const accessTextRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const liveTextRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const sloganTextRef = useRef<HTMLSpanElement>(null);
  const sloganShineRef = useRef<HTMLDivElement>(null);
  const bigTextRef = useRef<HTMLHeadingElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const continuousTlRef = useRef<gsap.core.Timeline | null>(null);
  const sliderTlRef = useRef<gsap.core.Timeline | null>(null);
  const bigTextCharsRef = useRef<Element[]>([]);
  const bigTextSplitRef = useRef<SplitText | null>(null);
  const prefersReducedRef = useRef(false);
  const dotOverlayRef = useRef<HTMLDivElement>(null);

  // 初始化减少动画偏好
  useEffect(() => {
    prefersReducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // 点阵噪声更新
  useEffect(() => {
    if (prefersReducedRef.current || !dotOverlayRef.current) return;

    const updateDotNoise = () => {
      if (!dotOverlayRef.current) return;
      const rect = dotOverlayRef.current.getBoundingClientRect();
      const activeRate = isDotNoiseHovering ? DOT_HOVER_ACTIVE_RATE : DOT_DEFAULT_ACTIVE_RATE;
      setDotNoiseCells(createDotNoiseCells(rect.width, rect.height, activeRate));
    };

    updateDotNoise();
    const intervalId = window.setInterval(updateDotNoise, DOT_NOISE_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [isDotNoiseHovering]);

  // 轮播图片（首尾重复实现无缝循环）
  const heroSliderImages = [...HERO_CONFIG.images, HERO_CONFIG.images[0]];

  // ============================================
  // GSAP 动画初始化
  // ============================================
  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    prefersReducedRef.current = prefersReduced;

    if (prefersReduced) return;

    // 入场动画时间线
    const entranceTl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    entranceTl
      .fromTo(glowRef.current, 
        { opacity: 0, scale: 0.85 }, 
        { opacity: 0.7, scale: 1, duration: 0.8 }
      )
      .fromTo(scanLineRef.current, 
        { scaleX: 0, transformOrigin: 'left center' }, 
        { scaleX: 1, duration: 0.6, ease: 'power4.out' }, 
        0.2
      )
      .fromTo(pulseDotRef.current, 
        { scale: 0 }, 
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 
        0.3
      )
      .fromTo(labelRef.current, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5 }, 
        0.4
      )
      .fromTo(titleRef.current, 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.6 }, 
        0.5
      )
      .fromTo(statusRef.current, 
        { y: 15, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5 }, 
        0.7
      );

    // 大文本字符动画
    if (bigTextRef.current) {
      const split = SplitText.create(bigTextRef.current, {
        type: 'chars',
        charsClass: 'bigtext-char'
      });
      bigTextSplitRef.current = split;
      bigTextCharsRef.current = split.chars;
      gsap.set(split.chars, { yPercent: 120, opacity: 0 });
      entranceTl.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: BIGTEXT_ENTER_DURATION,
        stagger: BIGTEXT_STAGGER,
        ease: BIGTEXT_EASE
      }, BIGTEXT_ENTER_DELAY);
    }

    // 持续动画（光晕和扫描线）
    const continuousTl = gsap.timeline({
      repeat: -1,
      defaults: { ease: 'none' }
    });

    continuousTl
      .fromTo(glowRef.current, 
        { backgroundPosition: '0% 50%' }, 
        { backgroundPosition: '200% 50%', duration: 14 }
      )
      .fromTo(scanLineRef.current, 
        { backgroundPosition: '0% 50%' }, 
        { backgroundPosition: '200% 50%', duration: 12 }, 
        0
      );

    continuousTlRef.current = continuousTl;

    // 标语初始倾斜
    if (sloganRef.current) {
      gsap.set(sloganRef.current, {
        skewX: -12,
        transformOrigin: 'bottom right',
        transformPerspective: SLOGAN_TILT_PERSPECTIVE
      });
    }
    if (sloganTextRef.current) {
      gsap.set(sloganTextRef.current, { skewX: 12 });
    }
    if (sloganShineRef.current) {
      gsap.set(sloganShineRef.current, { xPercent: -100 });
    }

    return () => {
      entranceTl.kill();
      continuousTl.kill();
      bigTextSplitRef.current?.revert();
      bigTextSplitRef.current = null;
      bigTextCharsRef.current = [];
    };
  }, { scope: headerRef });

  // 轮播动画
  useGSAP(() => {
    if (!sliderContainerRef.current || prefersReducedRef.current) return;

    const totalImages = heroSliderImages.length;
    const stayDuration = 4;
    const transitionDuration = 1.2;

    const sliderTl = gsap.timeline({ repeat: -1 });

    sliderTl.to({}, { duration: stayDuration });

    for (let i = 1; i < totalImages; i++) {
      sliderTl
        .call(() => playBigTextAnimation(bigTextCharsRef.current))
        .to(sliderContainerRef.current, {
          yPercent: -i * 100,
          duration: transitionDuration,
          ease: 'power3.inOut'
        })
        .to({}, { duration: stayDuration });
    }

    sliderTl.set(sliderContainerRef.current, { yPercent: 0 });

    sliderTlRef.current = sliderTl;

    return () => {
      sliderTl.kill();
    };
  });

  // ============================================
  // 交互处理函数
  // ============================================

  /** 鼠标移动时的倾斜效果 */
  const handleHeaderMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedRef.current || !titleGroupRef.current) return;

    const rect = titleGroupRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    const clampedX = Math.max(-1, Math.min(1, percentX));
    const clampedY = Math.max(-1, Math.min(1, percentY));

    gsap.to(titleGroupRef.current, {
      rotateY: clampedX * TILT_MAX_DEG,
      rotateX: -clampedY * TILT_MAX_DEG,
      transformPerspective: TILT_PERSPECTIVE,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    if (labelRef.current) {
      gsap.to(labelRef.current, {
        y: -clampedY * PARALLAX_FACTOR_LABEL,
        x: clampedX * PARALLAX_FACTOR_LABEL,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }

    if (titleRef.current) {
      gsap.to(titleRef.current, {
        y: -clampedY * PARALLAX_FACTOR_TITLE,
        x: clampedX * PARALLAX_FACTOR_TITLE,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  }, []);

  /** 鼠标进入时加速动画 */
  const handleHeaderEnter = useCallback(() => {
    if (!continuousTlRef.current) return;
    gsap.to(continuousTlRef.current, {
      timeScale: 2.5,
      duration: 0.4,
      ease: 'power2.out'
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.85,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  }, []);

  /** 鼠标离开时恢复动画 */
  const handleHeaderLeave = useCallback(() => {
    if (!continuousTlRef.current) return;
    gsap.to(continuousTlRef.current, {
      timeScale: 1,
      duration: 0.6,
      ease: 'power2.inOut'
    });
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        opacity: 0.7,
        duration: 0.4,
        ease: 'power2.inOut'
      });
    }
    if (!prefersReducedRef.current && titleGroupRef.current) {
      gsap.to(titleGroupRef.current, {
        rotateX: 0,
        rotateY: 0,
        transformPerspective: TILT_PERSPECTIVE,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    }
    if (!prefersReducedRef.current && labelRef.current) {
      gsap.to(labelRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    }
    if (!prefersReducedRef.current && titleRef.current) {
      gsap.to(titleRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto'
      });
    }
  }, []);

  /** 标语鼠标进入效果 */
  const handleSloganMouseEnter = useCallback(() => {
    if (sloganTextRef.current) {
      playTextScramble(sloganTextRef.current, `< ${HERO_CONFIG.slogan} >`);
    }

    if (prefersReducedRef.current || !sloganRef.current) return;

    gsap.killTweensOf(sloganRef.current);
    if (sloganTextRef.current) {
      gsap.killTweensOf(sloganTextRef.current);
    }

    gsap.to(sloganRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'back.out(2)',
      overwrite: true
    });

    if (sloganTextRef.current) {
      gsap.to(sloganTextRef.current, {
        letterSpacing: '0.35em',
        textShadow: '0 0 8px rgba(0,0,0,0.3)',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: true
      });
    }

    if (sloganShineRef.current) {
      gsap.fromTo(sloganShineRef.current, 
        { xPercent: -100 },
        { xPercent: 100, duration: 0.6, ease: 'power2.inOut', overwrite: true }
      );
    }
  }, []);

  /** 标语鼠标移动效果 */
  const handleSloganMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedRef.current || !sloganRef.current) return;

    const rect = sloganRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const percentX = (e.clientX - centerX) / (rect.width / 2);
    const percentY = (e.clientY - centerY) / (rect.height / 2);

    const clampedX = Math.max(-1, Math.min(1, percentX));
    const clampedY = Math.max(-1, Math.min(1, percentY));

    const shadowX = -clampedX * SLOGAN_SHADOW_OFFSET;
    const shadowY = clampedY * SLOGAN_SHADOW_OFFSET;

    gsap.to(sloganRef.current, {
      rotateY: clampedX * SLOGAN_TILT_MAX_DEG,
      rotateX: -clampedY * SLOGAN_TILT_MAX_DEG,
      skewX: -12,
      scale: 1.05,
      transformPerspective: SLOGAN_TILT_PERSPECTIVE,
      transformOrigin: 'bottom right',
      boxShadow: `${shadowX}px ${shadowY}px 20px rgba(204,255,0,0.4), ${shadowX * 2}px ${shadowY * 2}px 40px rgba(204,255,0,0.2)`,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true
    });

    if (sloganTextRef.current) {
      gsap.to(sloganTextRef.current, {
        y: -clampedY * SLOGAN_PARALLAX_FACTOR,
        x: clampedX * SLOGAN_PARALLAX_FACTOR,
        skewX: 12,
        letterSpacing: '0.35em',
        textShadow: '0 0 8px rgba(0,0,0,0.3)',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: true
      });
    }
  }, []);

  /** 标语鼠标离开效果 */
  const handleSloganMouseLeave = useCallback(() => {
    if (sloganTextRef.current) {
      sloganTextRef.current.textContent = `< ${HERO_CONFIG.slogan} >`;
    }

    if (sloganShineRef.current) {
      gsap.killTweensOf(sloganShineRef.current);
      gsap.set(sloganShineRef.current, { xPercent: -100 });
    }

    if (prefersReducedRef.current || !sloganRef.current) return;

    gsap.killTweensOf(sloganRef.current);
    if (sloganTextRef.current) {
      gsap.killTweensOf(sloganTextRef.current);
    }

    gsap.to(sloganRef.current, {
      rotateX: 0,
      rotateY: 0,
      skewX: -12,
      scale: 1,
      transformPerspective: SLOGAN_TILT_PERSPECTIVE,
      transformOrigin: 'bottom right',
      boxShadow: '0 0 0px rgba(204,255,0,0)',
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
      overwrite: true
    });

    if (sloganTextRef.current) {
      gsap.to(sloganTextRef.current, {
        x: 0,
        y: 0,
        skewX: 12,
        letterSpacing: '0.3em',
        textShadow: '0 0 0px rgba(0,0,0,0)',
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: true
      });
    }
  }, []);

  /** HUD 文本扰乱效果 */
  const handleHudScramble = useCallback((element: HTMLElement | null, text: string) => {
    playTextScramble(element, text, 420);
  }, []);

  // ============================================
  // 渲染
  // ============================================
  return (
    <div className={`relative w-full overflow-hidden border-b border-border/10 ${isMobileLandscape ? 'h-[70vh]' : 'h-[70vh] sm:h-[80vh] md:h-[90vh]'}`}>
      
      {/* 背景轮播 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          ref={sliderContainerRef}
          className="absolute inset-0"
        >
          {heroSliderImages.map((src, index) => (
            <div
              key={index}
              className="absolute left-0 w-full h-full overflow-hidden"
              style={{ top: `${index * 100}%` }}
            >
              <img 
                src={src} 
                alt={`Hero Background ${index + 1}`} 
                className="w-full h-full object-cover"
                style={{ transform: 'scale(1.05)' }}
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 opacity-90"></div>
        
        {/* 点阵噪声覆盖层 */}
        <div
          ref={dotOverlayRef}
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-auto overflow-hidden"
          onMouseEnter={() => setIsDotNoiseHovering(true)}
          onMouseLeave={() => setIsDotNoiseHovering(false)}
        >
          <div className="absolute inset-0 font-mono select-none pointer-events-none mix-blend-screen">
            {dotNoiseCells.map((cell) => (
              <span
                key={cell.id}
                className="absolute flex items-center justify-center transition-opacity duration-150"
                style={{
                  left: cell.x,
                  top: cell.y,
                  width: DOT_GRID_SIZE,
                  height: DOT_GRID_SIZE,
                  fontSize: '9px',
                  lineHeight: `${DOT_GRID_SIZE}px`,
                  color: cell.color,
                  opacity: cell.opacity,
                  textShadow: cell.color === '#CCFF00' ? '0 0 4px rgba(204,255,0,0.2)' : 'none'
                }}
              >
                {cell.char}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 大文本标题 */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden pointer-events-none z-10 opacity-30 mix-blend-overlay">
        <h1
          ref={bigTextRef}
          className="font-black text-white whitespace-nowrap tracking-tighter select-none pl-[5vw]"
          style={{ fontSize: 'clamp(40px, 8.5vw, 140px)', lineHeight: 1 }}
        >
          {HERO_CONFIG.bigText}
        </h1>
      </div>

      {/* 底部内容区域 */}
      <div className={`absolute inset-0 z-20 flex flex-col justify-end px-4 sm:px-6 md:px-12 pointer-events-none ${isMobileLandscape ? 'pb-5' : 'pb-8 sm:pb-12 md:pb-24'}`}>
        
        {/* 水平装饰线 */}
        <div className="absolute top-[60%] left-0 w-full h-[30px] sm:h-[40px] md:h-[80px] bg-gradient-to-r from-transparent via-[rgba(204,255,0,0.1)] to-transparent flex items-center overflow-hidden">
          <div className="w-full h-[1px] bg-[#CCFF00] opacity-50"></div>
        </div>

        <div className={`w-full max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-end justify-between ${isMobileLandscape ? 'flex-row items-end gap-4' : 'gap-4 sm:gap-8'}`}>
          
          {/* 左侧 HUD 信息 */}
          <div className={`font-mono text-[10px] md:text-xs text-white/70 tracking-widest space-y-2 ${isMobileLandscape ? 'hidden' : ''}`}>
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-[#CCFF00]"></div>
              <div className="h-px w-12 bg-white/30"></div>
              <div
                ref={accessTextRef}
                className="pointer-events-auto cursor-default"
                onMouseEnter={() => handleHudScramble(accessTextRef.current, '//.. ACCESS_GRANTED')}
              >
                //.. ACCESS_GRANTED
              </div>
            </div>
            <div
              ref={bottomLineRef}
              className="opacity-50 pointer-events-auto cursor-default"
              onMouseEnter={() => handleHudScramble(bottomLineRef.current, HERO_CONFIG.bottomLine)}
            >
              {HERO_CONFIG.bottomLine}
            </div>
          </div>

          {/* 右侧时钟和标语 */}
          <div className={`flex flex-col ${isMobileLandscape ? 'items-end text-right' : 'items-start md:items-end text-left md:text-right'}`}>
            
            {/* 滚动时钟 */}
            <div
              className={`max-w-full overflow-hidden ${isMobileLandscape ? 'text-[clamp(44px,9vw,72px)]' : 'text-[clamp(44px,12vw,180px)]'} leading-[0.85] font-black tracking-tighter drop-shadow-2xl font-mono`}
            >
              <RollingClock
                strokeWidth={isMobile ? '1px' : '2px'}
              />
            </div>
            
            {/* 标语 */}
            <div 
              ref={sloganRef}
              className={`mt-2 sm:mt-4 bg-[#CCFF00] text-black px-3 py-1.5 sm:px-4 sm:py-2 md:px-8 md:py-3 pointer-events-auto cursor-default relative overflow-hidden ${isMobileLandscape ? 'mt-1' : ''}`}
              onMouseEnter={handleSloganMouseEnter}
              onMouseMove={handleSloganMouseMove}
              onMouseLeave={handleSloganMouseLeave}
            >
              <div
                ref={sloganShineRef}
                aria-hidden="true"
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
                  width: '60%',
                }}
              />
              <span ref={sloganTextRef} className="block font-black text-sm sm:text-lg md:text-2xl uppercase tracking-widest relative z-20">
                &lt; {HERO_CONFIG.slogan} &gt;
              </span>
            </div>
            
            {/* 底部状态文本 */}
            <div
              ref={liveTextRef}
              className="mt-1 sm:mt-2 font-mono text-[10px] text-white/40 uppercase tracking-[0.5em] pointer-events-auto cursor-default"
              onMouseEnter={() => handleHudScramble(liveTextRef.current, 'LIVE // Personal Work')}
            >
              LIVE // Personal Work
            </div>
          </div>
        </div>
      </div>

      {/* 顶部 Header */}
      <div 
        ref={headerRef}
        className="absolute top-0 left-0 right-0 z-30 isolate"
        onMouseEnter={handleHeaderEnter}
        onMouseLeave={handleHeaderLeave}
        onMouseMove={handleHeaderMouseMove}
      >
        <div
          ref={glowRef}
          aria-hidden="true"
          className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
          style={{
            background: 'linear-gradient(110deg, transparent 25%, rgba(204,255,0,0.10) 40%, rgba(204,255,0,0.22) 50%, rgba(204,255,0,0.10) 60%, transparent 75%)',
            backgroundSize: '200% 100%',
            filter: 'blur(28px)',
          }}
        />
        <div className="relative bg-background/10 backdrop-blur-2xl backdrop-saturate-150 px-6 pt-3 pb-2 md:px-12 md:pt-4 md:pb-3 flex items-end justify-between">
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
          />
          <div
            ref={scanLineRef}
            aria-hidden="true"
            className="absolute left-0 right-0 bottom-0 h-px pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, transparent 30%, rgba(204,255,0,0.5) 45%, #CCFF00 50%, rgba(204,255,0,0.5) 55%, transparent 70%, transparent 100%)',
              backgroundSize: '200% 100%',
              boxShadow: '0 0 6px rgba(204,255,0,0.6), 0 0 12px rgba(204,255,0,0.3)',
            }}
          />
          <div 
            ref={titleGroupRef}
            className="space-y-2"
          >
            <div className="flex items-center gap-2">
              <span ref={pulseDotRef} className="w-2 h-2 bg-foreground animate-pulse drop-shadow-[0_0_6px_rgba(204,255,0,0.7)]"></span>
              <span ref={labelRef} className="font-mono text-[10px] text-muted tracking-[0.3em] uppercase [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">场景目录</span>
            </div>
            <div ref={titleRef}>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-foreground uppercase tracking-tighter leading-none [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
                作品集
              </h1>
            </div>
          </div>
          {isMobile ? (
            <button
              type="button"
              onClick={onToggleFullscreen}
              aria-label={isFullscreen ? '退出全屏' : '进入全屏'}
              className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-sm border bg-background/40 backdrop-blur-md text-foreground shadow-[0_0_16px_rgba(0,0,0,0.25)] transition-all duration-200 active:scale-95 ${isFullscreen ? 'border-[#CCFF00]/70 text-[#CCFF00]' : 'border-border/10'}`}
            >
              {isFullscreen ? '退出' : '全屏'}
            </button>
          ) : (
            <div ref={statusRef} className="hidden md:block text-right font-mono text-[10px] text-muted uppercase tracking-widest leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
              <div
                ref={statusTotalRef}
                className="pointer-events-auto cursor-default"
                onMouseEnter={() => handleHudScramble(statusTotalRef.current, `TOTAL_SECTORS: ${collectionsCount}`)}
              >
                TOTAL_SECTORS: {collectionsCount}
              </div>
              <div
                ref={statusModeRef}
                className="pointer-events-auto cursor-default"
                onMouseEnter={() => handleHudScramble(statusModeRef.current, 'SCROLL_MODE: PARALLAX_SYNC')}
              >
                SCROLL_MODE: PARALLAX_SYNC
              </div>
            </div>
          )}
        </div>
        <div className="h-px bg-border/10" />
      </div>
    </div>
  );
};

export default HeroSection;