/**
 * HotspotPreview 热点预览组件
 * 
 * 功能说明：
 * - 鼠标悬停时显示热点详情预览卡片
 * - 跟随鼠标移动并带有平滑插值动画
 * - 支持减少动画模式
 * - 自动限制在视口范围内
 */

import React, { useState, useRef, useEffect } from 'react';
import { Hotspot } from '../../types';

// ============================================
// 组件属性
// ============================================

interface HotspotPreviewProps {
  activePreviewHotspot: Hotspot | null;  // 当前预览的热点
  isPreviewVisible: boolean;              // 是否显示预览
  isMobile: boolean;                      // 是否移动设备
  prefersReducedMotion: boolean;          // 是否减少动画
}

// ============================================
// HotspotPreview 组件
// ============================================

const HotspotPreview: React.FC<HotspotPreviewProps> = ({
  activePreviewHotspot,
  isPreviewVisible,
  isMobile,
  prefersReducedMotion
}) => {
  // DOM 引用
  const previewElRef = useRef<HTMLDivElement | null>(null);
  
  // 鼠标位置跟踪
  const previewTargetRef = useRef({ x: 0, y: 0 });
  const previewCurrentRef = useRef({ x: 0, y: 0 });
  const previewLastXRef = useRef(0);
  const previewFrameRef = useRef<number | null>(null);

  // ============================================
  // 鼠标移动监听
  // ============================================
  useEffect(() => {
    if (isMobile) return;

    const onPointerMove = (event: PointerEvent) => {
      previewTargetRef.current.x = event.clientX;
      previewTargetRef.current.y = event.clientY;

      // 减少动画模式：直接设置位置
      if (prefersReducedMotion) {
        previewCurrentRef.current.x = event.clientX;
        previewCurrentRef.current.y = event.clientY;
        previewLastXRef.current = event.clientX;

        const el = previewElRef.current;
        if (el) {
          el.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -100%)`;
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [isMobile, prefersReducedMotion]);

  // ============================================
  // 平滑跟随动画
  // ============================================
  useEffect(() => {
    if (isMobile || prefersReducedMotion) {
      if (previewFrameRef.current !== null) {
        cancelAnimationFrame(previewFrameRef.current);
        previewFrameRef.current = null;
      }
      return;
    }

    const tick = () => {
      const target = previewTargetRef.current;
      const current = previewCurrentRef.current;

      // 线性插值平滑跟随
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;

      // 视口边界限制
      const viewportWidth = window.innerWidth || 0;
      const viewportHeight = window.innerHeight || 0;
      const safeX = Math.max(160, Math.min(viewportWidth - 120, current.x));
      const safeY = Math.max(220, Math.min(viewportHeight - 120, current.y));

      // 基于水平速度的旋转效果
      const velocityX = safeX - previewLastXRef.current;
      const rotation = Math.max(-6, Math.min(6, velocityX * 0.08));
      previewLastXRef.current = safeX;

      const el = previewElRef.current;
      if (el) {
        el.style.transform = `translate(${safeX}px, ${safeY}px) translate(-50%, -100%) rotate(${rotation}deg)`;
      }

      previewFrameRef.current = requestAnimationFrame(tick);
    };

    previewFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (previewFrameRef.current !== null) {
        cancelAnimationFrame(previewFrameRef.current);
        previewFrameRef.current = null;
      }
    };
  }, [isMobile, prefersReducedMotion]);

  // ============================================
  // 清理定时器
  // ============================================
  useEffect(() => {
    return () => {
      if (previewFrameRef.current !== null) {
        cancelAnimationFrame(previewFrameRef.current);
        previewFrameRef.current = null;
      }
    };
  }, []);

  // ============================================
  // 渲染（仅桌面端显示）
  // ============================================
  if (isMobile || !activePreviewHotspot) {
    return null;
  }

  return (
    <div
      ref={previewElRef}
      className={`pointer-events-none fixed left-0 top-0 z-[60] origin-bottom ${
        isPreviewVisible
          ? 'transition-[clip-path,opacity] duration-[380ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-100 clip-path-[inset(0%_0%_0%_0%)]'
          : 'transition-[clip-path,opacity] duration-[240ms] ease-[cubic-bezier(0.45,0,1,1)] opacity-0 clip-path-[inset(10%_10%_10%_10%)]'
      }`}
      style={{ willChange: 'transform, opacity, clip-path' }}
    >
      {/* 预览卡片 */}
      <div className={`relative mb-5 w-64 overflow-hidden rounded-xl border border-white/10 bg-black/80 p-1 shadow-2xl backdrop-blur-xl transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isPreviewVisible ? 'scale-100 translate-y-0' : 'scale-[0.96] translate-y-2'}`}>
        {/* 预览图片 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
          <img
            src={activePreviewHotspot.detailImage}
            alt={activePreviewHotspot.title}
            className={`h-full w-full object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isPreviewVisible ? 'scale-100' : 'scale-105'}`}
            loading="eager"
          />
          {/* 渐变遮罩 */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        </div>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-white/90 truncate">
            {activePreviewHotspot.title}
          </span>
          <span className="ml-3 flex-none text-[10px] font-mono text-white/50">PREVIEW</span>
        </div>
      </div>
      {/* 连接线 */}
      <div className={`mx-auto h-4 w-px bg-gradient-to-b from-white/40 to-transparent transition-opacity duration-200 ease-linear ${isPreviewVisible ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
};

export default HotspotPreview;