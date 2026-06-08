import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoProps {
  src: string;
  className?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
}

const ScrollVideo: React.FC<ScrollVideoProps> = ({
  src,
  className = '',
  title = '',
  subtitle = '',
  accentColor = '#00F0FF',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isReadyRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const titleEl = titleRef.current;
    if (!container || !video) return;

    // ---- 视频自动播放 + 循环 ----
    video.loop = true;
    video.muted = true;

    const handleCanPlay = () => {
      isReadyRef.current = true;
      setIsReady(true);
      video.play().catch(() => {});
    };
    video.addEventListener('canplay', handleCanPlay);

    // ---- IntersectionObserver：离屏暂停 ----
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isReadyRef.current) return;
        entry.isIntersecting ? video.play().catch(() => {}) : video.pause();
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // ---- GSAP：滚动缩放动画（小→大）----
    const ctx = gsap.context(() => {
      gsap.fromTo(
        video,
        {
          scale: 0.6,
          opacity: 0.5,
        },
        {
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top 90%',
            end: 'top 30%',
            scrub: 0.5,
          },
        }
      );

      // 标题淡入
      if (titleEl) {
        gsap.fromTo(
          titleEl,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top 60%',
              end: 'top 40%',
              scrub: 0.5,
            },
          }
        );
      }
    }, container);

    return () => {
      isReadyRef.current = false;
      ctx.revert();
      observer.disconnect();
      video.pause();
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* 背景辉光 */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}33 0%, transparent 70%)`,
        }}
      />

      {/* 视频元素 */}
      <video
        ref={videoRef}
        src={src}
        preload="auto"
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* 加载状态 */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/50">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: `${accentColor} transparent ${accentColor} ${accentColor}` }}
          />
        </div>
      )}

      {/* 标题覆盖层 */}
      {title && (
        <div
          ref={titleRef}
          className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-8 bg-gradient-to-t from-background/80 to-transparent opacity-0"
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="font-mono text-[9px] uppercase tracking-widest opacity-70"
              style={{ color: accentColor }}
            >
              {subtitle || 'VIDEO_REEL'}
            </span>
          </div>
          <h3 className="text-lg md:text-2xl font-black text-foreground uppercase tracking-tight">
            {title} <span className="text-foreground/30 font-light">// DEMO</span>
          </h3>
        </div>
      )}
    </div>
  );
};

export default ScrollVideo;
