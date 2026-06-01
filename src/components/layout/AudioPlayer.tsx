import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Music, ChevronDown } from 'lucide-react';
import { BGM_CONFIG } from '../../constants';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [volume, setVolume] = useState(BGM_CONFIG.volume);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const userPausedRef = useRef(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const expandTimeoutRef = useRef<NodeJS.Timeout>();
  const isActiveRef = useRef(true);
  const attemptPlayRef = useRef<(() => void) | null>(null);

  // Initialize audio
  useEffect(() => {
    isActiveRef.current = true;
    
    const audio = new Audio(BGM_CONFIG.url);
    audioRef.current = audio;
    audio.loop = true;
    audio.volume = volume;

    const handleLoadedMetadata = () => {
      if (isActiveRef.current) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      if (isActiveRef.current) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleError = (e: Event | string) => {
      if (isActiveRef.current) {
        console.warn("Audio source error:", e);
        setHasError(true);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);

    // Auto-play strategy
    const attemptPlay = () => {
      if (!isActiveRef.current || !audio || userPausedRef.current) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isActiveRef.current) {
              setIsPlaying(true);
              setHasError(false);
            }
            document.removeEventListener('click', attemptPlay);
            document.removeEventListener('keydown', attemptPlay);
          })
          .catch((error) => {
            if (isActiveRef.current) {
              console.log("Auto-play blocked, waiting for interaction...", error);
            }
          });
      }
    };
    
    attemptPlayRef.current = attemptPlay;

    if (BGM_CONFIG.autoPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (isActiveRef.current) {
              setIsPlaying(true);
            }
          })
          .catch(() => {
            if (isActiveRef.current) {
              document.addEventListener('click', attemptPlay);
              document.addEventListener('keydown', attemptPlay);
            }
          });
      }
    }

    return () => {
      isActiveRef.current = false;
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      attemptPlayRef.current = null;
      
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
      audio.load();
      
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      userPausedRef.current = true;
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      userPausedRef.current = false;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((e) => {
          console.error("Audio play failed:", e);
          setHasError(true);
          setIsPlaying(false);
          if (e.name !== 'AbortError') {
            alert("无法播放音频。请检查 constants.ts 中的 BGM_CONFIG 路径是否正确，或浏览器设置。");
          }
        });
    }
  }, [isPlaying]);

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;
    const newTime = (clickPercent / 100) * duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(clickPercent);
  }, [duration]);

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  }, []);

  // Toggle expanded state
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  // Toggle hidden state
  const toggleHidden = useCallback(() => {
    setIsHidden(prev => !prev);
    if (isHidden) {
      setIsExpanded(false);
    }
  }, [isHidden]);

  // Format time (seconds to mm:ss)
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space to toggle play/pause (only when not typing in input)
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        togglePlay();
      }
      
      // Escape to hide player
      if (e.code === 'Escape') {
        setIsHidden(true);
        setIsExpanded(false);
      }
      
      // M to toggle mute
      if (e.code === 'KeyM' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setVolume(prev => prev > 0 ? 0 : BGM_CONFIG.volume);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlay]);

  // Auto-collapse after 3 seconds of no interaction
  useEffect(() => {
    if (isExpanded) {
      expandTimeoutRef.current = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
    }

    return () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    };
  }, [isExpanded]);

  // Reset timeout on interaction
  const handleInteraction = useCallback(() => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
  }, []);

  if (isHidden) {
    return (
      <button
        onClick={toggleHidden}
        className="fixed bottom-3 left-3 md:bottom-6 md:left-6 z-50 p-2 bg-surface/10 backdrop-blur-md border border-border/10 rounded-sm text-muted hover:text-foreground hover:border-border/30 transition-all duration-200"
        title="显示音频播放器"
      >
        <Music size={14} />
      </button>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-3 left-3 md:bottom-6 md:left-6 z-50 flex flex-col items-start"
      onMouseEnter={handleInteraction}
      onMouseLeave={handleInteraction}
    >
      {/* Expanded Player */}
      {isExpanded && (
        <div className="mb-2 w-64 bg-surface/90 backdrop-blur-lg border border-border/20 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-out animate-fadeIn">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="h-1.5 bg-border/20 cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-emerald-500 transition-all duration-100 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
            </div>
          </div>
          
          {/* Player Content */}
          <div className="p-3">
            {/* Time Display */}
            <div className="flex justify-between text-[10px] font-mono text-muted mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className={`p-2 rounded-full transition-all duration-200 ${
                  hasError 
                    ? 'bg-red-500/20 text-red-400' 
                    : isPlaying 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-surface/10 text-muted hover:text-foreground'
                }`}
                disabled={hasError}
              >
                {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              
              {/* Volume Control */}
              <div className="flex items-center gap-2 flex-1 mx-3">
                <button
                  onClick={() => setVolume(prev => prev > 0 ? 0 : BGM_CONFIG.volume)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  {volume > 0 ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-1 bg-border/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
                />
              </div>
              
              {/* Hide Button */}
              <button
                onClick={toggleHidden}
                className="p-1 text-muted hover:text-foreground transition-colors"
                title="隐藏播放器 (Esc)"
              >
                <ChevronDown size={14} />
              </button>
            </div>
            
            {/* Status */}
            {hasError && (
              <div className="mt-2 text-[10px] font-mono text-red-400 text-center">
                音频加载失败
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Minimized Button */}
      <button
        onClick={toggleExpanded}
        className={`group flex items-center gap-2 p-2 backdrop-blur-md border transition-all duration-300 rounded-sm shadow-lg ${
          hasError 
            ? 'bg-red-500/20 border-red-500 text-red-400' 
            : isPlaying 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-surface/10 border-border/10 text-muted hover:text-foreground hover:border-border/30'
        }`}
      >
        <div className="relative">
          {isExpanded ? <ChevronDown size={14} /> : <Music size={14} />}
          {isPlaying && !isExpanded && (
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></div>
          )}
        </div>
        
        {/* Text - Auto collapse to save space, expand on hover */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'w-0 opacity-0' : 'w-16 opacity-100'}`}>
          <div className="flex flex-col items-start leading-none whitespace-nowrap">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
              {isPlaying ? 'PLAYING' : 'PAUSED'}
            </span>
            {hasError && <span className="text-[8px] font-mono text-red-300">ERROR</span>}
          </div>
        </div>
        
        {/* Status Dot (Visible when collapsed) */}
        {!isExpanded && !hasError && (
          <div className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;