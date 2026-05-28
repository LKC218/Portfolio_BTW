
import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { BGM_CONFIG } from '../../constants';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Initialize Audio
    const audio = new Audio(BGM_CONFIG.url);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = BGM_CONFIG.volume;

    // Listener for loading errors (e.g. 404, format not supported)
    const handleError = (e: Event | string) => {
        console.warn("Audio source error:", e);
        setHasError(true);
        setIsPlaying(false);
    };

    audio.addEventListener('error', handleError);

    // Strategy to ensure "Default ON":
    // 1. Try to play immediately.
    // 2. If blocked, attach a one-time click listener to the document to resume playback.
    const attemptPlay = () => {
        if (!audio) return;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    setIsPlaying(true);
                    setHasError(false);
                    // Cleanup interaction listeners once successful
                    document.removeEventListener('click', attemptPlay);
                    document.removeEventListener('keydown', attemptPlay);
                })
                .catch((error) => {
                    console.log("Auto-play blocked, waiting for interaction...", error);
                    // If still blocked, keep listeners active for next interaction
                });
        }
    };

    if (BGM_CONFIG.autoPlay) {
        // First attempt
        const playPromise = audio.play();
        if (playPromise !== undefined) {
             playPromise
                .then(() => {
                    setIsPlaying(true);
                })
                .catch(() => {
                    // Fallback: wait for ANY user interaction (e.g. clicking "Enter System" on Landing)
                    document.addEventListener('click', attemptPlay);
                    document.addEventListener('keydown', attemptPlay);
                });
        }
    }

    return () => {
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
            setIsPlaying(true);
            setHasError(false);
        })
        .catch((e) => {
            console.error("Audio play failed:", e);
            setHasError(true);
            setIsPlaying(false);
            // Alert user only if it looks like a real error (not just user abort)
            if(e.name !== 'AbortError') {
               alert("无法播放音频。请检查 constants.ts 中的 BGM_CONFIG 路径是否正确，或浏览器设置。");
            }
        });
    }
  };

  return (
    <div className="fixed bottom-3 left-3 md:bottom-6 md:left-6 z-50 flex flex-col items-start gap-1">
      {/* Visualizer (Only visible when playing) - Scaled down */}
      <div className={`flex items-end justify-start gap-[2px] h-3 md:h-6 overflow-hidden transition-opacity duration-500 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}>
         {[...Array(4)].map((_, i) => (
             <div 
                key={i} 
                className="w-0.5 md:w-1 bg-emerald-400 animate-[bounce_1s_infinite]" 
                style={{ 
                    animationDuration: `${0.4 + i * 0.1}s`,
                    animationDelay: `${i * 0.05}s`,
                    height: '100%'
                }}
             ></div>
         ))}
      </div>

      {/* Control Button - Compact & Expandable */}
      <button
        onClick={togglePlay}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group flex items-center gap-2 p-2 backdrop-blur-md border transition-all duration-300 rounded-sm shadow-lg
            ${hasError 
                ? 'bg-red-500/20 border-red-500 text-red-400' 
                : isPlaying 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                    : 'bg-surface/10 border-border/10 text-muted hover:text-foreground hover:border-border/30'
            }
        `}
      >
        <div className="relative">
             {isPlaying ? <Volume2 size={14} /> : <VolumeX size={14} />}
             {isPlaying && (
                 <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></div>
             )}
        </div>
        
        {/* Text - Auto collapse to save space, expand on hover */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${isHovered ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}>
            <div className="flex flex-col items-start leading-none whitespace-nowrap">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
                    {isPlaying ? 'AUDIO' : 'MUTE'}
                </span>
                {hasError && <span className="text-[8px] font-mono text-red-300">ERROR</span>}
            </div>
        </div>
        
        {/* Status Dot (Visible when collapsed) */}
        {!isHovered && !hasError && (
             <div className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
