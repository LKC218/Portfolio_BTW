
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Hotspot } from '../../types';
import { X, ScanLine, Maximize2, Box } from 'lucide-react';
import ModelViewer from './ModelViewer';
import FullscreenModelViewer from './FullscreenModelViewer';

interface DetailCardProps {
  hotspot: Hotspot;
  onClose: () => void;
  sceneTitle: string;
  accentColor: string;
  isMobile?: boolean;
  isLandscape?: boolean;
  onExpand?: (expanded: boolean) => void;
}

const DetailCard: React.FC<DetailCardProps> = ({ hotspot, onClose, sceneTitle, accentColor, isMobile = false, isLandscape = false, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreenViewer, setIsFullscreenViewer] = useState(false);

  const handleExpand = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onExpand) {
      onExpand(expanded);
    }
  };

  // Dynamic classes based on Mobile vs Desktop
  // Mobile: Bottom Sheet style with rounded top corners
  // Desktop: Floating card style
  const containerClasses = isLandscape
    ? "w-full h-full bg-surface/90 border-l border-border/20 backdrop-blur-xl shadow-2xl overflow-y-auto scrollbar-hide animate-in slide-in-from-right duration-300"
    : isMobile
    ? "w-full bg-surface border-t border-border/20 rounded-t-xl shadow-[0_-5px_20px_rgba(0,0,0,0.9)] max-h-[72dvh] overflow-y-auto animate-in slide-in-from-bottom duration-300"
    : "w-80 bg-surface/90 border border-border/20 backdrop-blur-xl shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide animate-in zoom-in-95 duration-300";

  return (
    <>
      <div 
          className={`relative overflow-hidden group ${containerClasses}`}
          style={{ 
              borderColor: (!isMobile && !isLandscape) ? accentColor : undefined,
              borderTopColor: isMobile ? accentColor : undefined,
              borderLeftColor: isLandscape ? accentColor : undefined,
              boxShadow: (!isMobile && !isLandscape) ? `0 0 30px ${accentColor}15` : undefined
          }}
      >
        {/* Mobile Drag Handle Indicator */}
        {isMobile && !isLandscape && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-border/20 rounded-full mt-2 z-20"></div>
        )}

        {/* Decorative scanning line animation */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(transparent_0%,#fff_50%,transparent_100%)] bg-[length:100%_200%] animate-[scan_3s_linear_infinite]" />

        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/10 bg-surface/5 relative z-10 sticky top-0 backdrop-blur-md">
          <div className="flex items-center gap-2">
              <ScanLine size={14} style={{ color: accentColor }} />
              <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  细节_区块_{hotspot.id}
              </span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface/10 rounded transition-colors text-muted hover:text-foreground">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col md:flex-col">
            {/* Image Thumbnail - Aspect Video */}
            <div 
                className="relative w-full aspect-video shrink-0 overflow-hidden border-b border-border/10 cursor-zoom-in group/image"
                onClick={() => handleExpand(true)}
            >
              <img 
                  src={hotspot.detailImage} 
                  alt={hotspot.title} 
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover/image:scale-110"
              />
              
              {/* Zoom Overlay Hint */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/20 rounded-full backdrop-blur-sm">
                      <Maximize2 size={14} className="text-white" />
                      <span className="text-[10px] font-mono text-white uppercase tracking-wider">展开视图</span>
                  </div>
              </div>

              {/* Tech Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90 pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-4 w-full pointer-events-none">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-foreground drop-shadow-md flex items-end gap-2">
                      {hotspot.title}
                  </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 relative z-10 pb-8 md:pb-5">
              <p className="text-sm text-muted leading-relaxed font-light border-l-2 border-border/10 pl-3">
                {hotspot.description}
              </p>
            </div>
        </div>

        {/* Footer Decor (Hidden on mobile to save vertical space) */}
        {!isMobile && (
            <div className="bg-background/50 p-2 border-t border-border/5 flex justify-between items-center text-[10px] text-muted font-mono sticky bottom-0 backdrop-blur-md">
            <span>网格: {hotspot.x.toFixed(2)} / {hotspot.y.toFixed(2)}</span>
            <span>安全连接</span>
            </div>
        )}
      </div>

      {/* Full Screen Expanded View Modal (Portal to escape parent stacking context) */}
      {isExpanded && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-background/95 backdrop-blur-md"
                onClick={() => handleExpand(false)}
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            </div>

            {/* Modal Content */}
            <div className={`relative z-10 overflow-hidden ${isLandscape ? 'flex flex-row w-full h-full' : 'flex flex-col md:flex-row w-full h-full md:max-w-6xl md:h-auto md:max-h-[90vh] bg-surface md:border border-border/10 shadow-[0_0_100px_rgba(0,0,0,0.8)]'}`}>
                 
                 {/* === TRANSITION WIPES === */}
                 <div 
                    className="absolute inset-0 z-[60] bg-foreground pointer-events-none animate-[reveal-swipe_0.4s_cubic-bezier(0.87,0,0.13,1)_forwards]"
                    style={{ transformOrigin: 'right' }}
                 />
                 <div 
                    className="absolute inset-0 z-[55] bg-[--accent-color] pointer-events-none animate-[reveal-swipe_0.6s_cubic-bezier(0.87,0,0.13,1)_forwards]"
                    style={{ 
                        '--accent-color': accentColor, 
                        transformOrigin: 'right',
                        animationDelay: '0.05s'
                    } as React.CSSProperties}
                 />

                 {/* Close Button */}
                 <button 
                    onClick={() => handleExpand(false)}
                    className="absolute top-5 right-5 z-20 min-w-11 min-h-11 p-2 bg-surface/50 hover:bg-[--accent-color] hover:text-background border border-border/10 text-foreground transition-all rounded-full opacity-0 animate-in fade-in fill-mode-forwards delay-500 flex items-center justify-center"
                    style={{ '--accent-color': accentColor } as React.CSSProperties}
                 >
                    <X size={24} />
                 </button>

                 {/* Large Image / 3D Viewport */}
                 <div className={`flex-1 min-h-0 relative bg-black flex items-center justify-center overflow-hidden group/modal-img ${isLandscape ? '' : 'min-h-[42dvh] md:min-h-[520px]'}`}>
                    <>
                        <ModelViewer accentColor={accentColor} modelUrl={hotspot.modelUrl} showHud={true} hudPadding="48px" />
                        <button
                            onClick={() => setIsFullscreenViewer(true)}
                            className="absolute top-5 right-16 z-20 p-2 bg-surface/50 hover:bg-[--accent-color] hover:text-background border border-border/10 text-foreground transition-all rounded-full"
                            style={{ '--accent-color': accentColor } as React.CSSProperties}
                            title="放大查看"
                        >
                            <Maximize2 size={18} />
                        </button>
                    </>
                 </div>

                 {/* Info Panel */}
                 <div className={`${isLandscape ? 'w-[40%]' : 'w-full md:w-96'} flex-none bg-surface border-l border-border/10 p-4 md:p-8 flex flex-col justify-center relative overflow-hidden shrink-0 animate-in slide-in-from-right duration-700 fade-in fill-mode-forwards`} style={{ animationDelay: '0.2s' }}>
                      {isMobile && !isLandscape && <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-border/10 rounded-full" />}
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }}></span>
                            <span className="font-mono text-xs text-muted uppercase tracking-[0.2em]">3D_模型_视图</span>
                            <Box size={12} style={{ color: accentColor }} />
                        </div>

                        <h2 className={`${isLandscape ? 'text-lg' : 'text-2xl md:text-3xl'} font-black text-foreground uppercase tracking-tighter mb-2 leading-none`}>
                            {hotspot.title}
                        </h2>
                        
                        <div className={`h-px w-20 bg-gradient-to-r from-foreground/50 to-transparent ${isLandscape ? 'mb-3' : 'mb-6'}`}></div>

                        <div className={`${isLandscape ? 'space-y-3' : 'space-y-6'}`}>
                            <div>
                                <h3 className="text-[10px] font-mono text-[--accent-color] uppercase mb-2 tracking-widest" style={{ color: accentColor }}>描述</h3>
                                <p className="text-sm text-muted leading-relaxed border-l border-border/20 pl-4">
                                    {hotspot.description}
                                </p>
                            </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleExpand(false)}
                        className={`${isLandscape ? 'mt-4' : 'mt-8'} w-full py-3 bg-foreground text-background font-bold uppercase tracking-wider text-xs shadow-lg hover:bg-[--accent-color] hover:shadow-xl hover:scale-[1.01] active:scale-[0.97] active:brightness-90 transition-all duration-300`}
                        style={{ '--accent-color': accentColor } as React.CSSProperties}
                      >
                          关闭视图
                      </button>
                 </div>
            </div>
        </div>,
        document.body
      )}

      {/* Fullscreen 3D Model Viewer (Portal to escape parent stacking context) */}
      {isFullscreenViewer && createPortal(
          <FullscreenModelViewer
              title={hotspot.title}
              description={hotspot.description}
              accentColor={accentColor}
              modelUrl={hotspot.modelUrl}
              onClose={() => setIsFullscreenViewer(false)}
              isMobile={isMobile}
          />,
          document.body
      )}
    </>
  );
};

export default DetailCard;
