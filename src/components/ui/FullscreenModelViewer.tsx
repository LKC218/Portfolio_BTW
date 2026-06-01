import React from 'react';
import { X, Maximize } from 'lucide-react';
import ModelViewer from './ModelViewer';

interface FullscreenModelViewerProps {
  title: string;
  description: string;
  accentColor: string;
  modelUrl?: string;
  onClose: () => void;
  isMobile?: boolean;
}

const FullscreenModelViewer: React.FC<FullscreenModelViewerProps> = ({
  title,
  description,
  accentColor,
  modelUrl,
  onClose,
  isMobile = false,
}) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-8 animate-in fade-in duration-300">
      <style>{`
        @keyframes fs-reveal-swipe {
          0% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-md"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      </div>

      {/* Modal Container */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full md:max-w-[92vw] md:max-h-[92vh] bg-surface md:border border-border/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">

        {/* Wipe Transitions */}
        <div
          className="absolute inset-0 z-[60] bg-foreground pointer-events-none animate-[fs-reveal-swipe_0.4s_cubic-bezier(0.87,0,0.13,1)_forwards]"
          style={{ transformOrigin: 'right' }}
        />
        <div
          className="absolute inset-0 z-[55] pointer-events-none animate-[fs-reveal-swipe_0.6s_cubic-bezier(0.87,0,0.13,1)_forwards]"
          style={{
            backgroundColor: accentColor,
            transformOrigin: 'right',
            animationDelay: '0.05s',
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2.5 bg-surface/60 hover:bg-foreground hover:text-background border border-border/10 text-foreground transition-all rounded-full opacity-0 animate-in fade-in fill-mode-forwards delay-500"
        >
          <X size={20} />
        </button>

        {/* 3D Viewport (Full Area) */}
        <div className="flex-1 relative bg-black/80 min-h-[50vh] md:min-h-0">
          <ModelViewer accentColor={accentColor} modelUrl={modelUrl} showHud={true} hudPadding="48px" />

          {/* Top-Left Badge */}
          <div className="absolute top-5 left-5 z-10 flex items-center gap-2 px-3 py-1.5 bg-surface/80 backdrop-blur-md border border-border/10">
            <Maximize size={12} style={{ color: accentColor }} />
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest">全屏_3D_视图</span>
          </div>
        </div>

        {/* Info Panel */}
        <div
          className={`${
            isMobile
              ? 'w-full max-h-[55vh] overflow-y-auto'
              : 'w-[340px]'
          } flex-none bg-surface border-l border-border/10 flex flex-col relative overflow-hidden shrink-0 animate-in slide-in-from-right duration-700 fade-in fill-mode-forwards`}
          style={{ animationDelay: '0.2s' }}
        >
          {isMobile && <div className="sticky top-0 flex-none pt-3 pb-1 flex justify-center bg-surface z-10">
            <div className="w-10 h-1 bg-border/20 rounded-full" />
          </div>}

          <div className="flex-1 flex flex-col justify-between p-8 md:p-10 pt-6 md:pt-10">
            <div className="relative z-10 space-y-8">
              {/* Header Tag */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
                <span className="font-mono text-xs text-muted uppercase tracking-[0.2em]">3D_模型_查看器</span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter leading-none">
                  {title}
                </h2>
                <div className="h-px w-20 bg-gradient-to-r from-foreground/50 to-transparent mt-4" />
              </div>

              {/* Description */}
              <div>
                <h3
                  className="text-[10px] font-mono uppercase mb-3 tracking-widest"
                  style={{ color: accentColor }}
                >
                  描述
                </h3>
                <p className="text-sm text-muted leading-relaxed border-l border-border/20 pl-4">
                  {description}
                </p>
              </div>

              {/* Controls Guide */}
              <div className="p-4 border border-border/10 bg-background/20 space-y-3">
                <div className="font-mono text-[9px] text-muted uppercase tracking-widest">操作指南</div>
                <div className="space-y-2 text-[11px] text-foreground/50 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full flex-none" style={{ backgroundColor: accentColor, opacity: 0.4 }} />
                    <span>左键拖拽 → 旋转模型</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-1 h-1 rounded-full flex-none" style={{ backgroundColor: accentColor, opacity: 0.4 }} />
                    <span>滚轮 → 缩放视图</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="mt-10 w-full py-3.5 bg-foreground text-background font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-[--accent-color] hover:text-background hover:shadow-xl hover:scale-[1.01] active:scale-[0.97] active:brightness-90 transition-all duration-300"
              style={{ '--accent-color': accentColor } as React.CSSProperties}
            >
              关闭查看器
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullscreenModelViewer;
