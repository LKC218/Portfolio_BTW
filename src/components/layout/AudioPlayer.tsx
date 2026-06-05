/**
 * AudioPlayer 音频播放器组件
 * 
 * 功能说明：
 * - 背景音乐播放控制（播放/暂停/音量调节）
 * - 进度条显示和拖拽跳转
 * - 页面可见性自动暂停/恢复
 * - 键盘快捷键支持（空格：播放/暂停，M：静音，ESC：隐藏）
 * - 响应式布局适配
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Music, ChevronDown } from 'lucide-react';
import { BGM_CONFIG } from '../../constants';
import { useDeviceState } from '../../hooks/useDeviceState';

const AudioPlayer: React.FC = () => {
  // 设备状态检测
  const device = useDeviceState();
  const isMobile = device !== 'desktop';
  const isMobileLandscape = device === 'mobile-landscape';

  // 播放器状态
  const [isPlaying, setIsPlaying] = useState(false);        // 是否正在播放
  const [isExpanded, setIsExpanded] = useState(false);       // 是否展开控制面板
  const [isHidden, setIsHidden] = useState(false);           // 是否完全隐藏播放器
  const [volume, setVolume] = useState(BGM_CONFIG.volume);   // 当前音量 (0-1)
  const [progress, setProgress] = useState(0);               // 播放进度 (0-100)
  const [duration, setDuration] = useState(0);               // 音频总时长（秒）
  const [currentTime, setCurrentTime] = useState(0);         // 当前播放时间（秒）
  const [hasError, setHasError] = useState(false);           // 是否发生错误

  // Refs 用于在异步回调中访问最新状态
  const hasErrorRef = useRef(false);           // 错误状态的 ref 版本
  const isPlayingRef = useRef(false);          // 播放状态的 ref 版本
  const userPausedRef = useRef(false);         // 用户是否主动暂停
  const wasPlayingBeforeHiddenRef = useRef(false);  // 页面隐藏前是否在播放
  
  // DOM 元素引用
  const audioRef = useRef<HTMLAudioElement | null>(null);    // 音频元素
  const containerRef = useRef<HTMLDivElement>(null);         // 容器元素
  const progressRef = useRef<HTMLDivElement>(null);          // 进度条元素
  const expandTimeoutRef = useRef<NodeJS.Timeout>(undefined); // 自动收起定时器
  const isActiveRef = useRef(true);                          // 组件是否挂载
  const attemptPlayRef = useRef<(() => void) | null>(null);  // 尝试播放的回调

  // ============================================
  // 初始化音频和自动播放逻辑
  // ============================================
  useEffect(() => {
    isActiveRef.current = true;
    
    // 创建音频实例
    const audio = new Audio(BGM_CONFIG.url);
    audioRef.current = audio;
    audio.loop = true;      // 循环播放
    audio.volume = volume;

    // 元数据加载完成回调
    const handleLoadedMetadata = () => {
      if (isActiveRef.current) {
        setDuration(audio.duration);
      }
    };

    // 播放时间更新回调
    const handleTimeUpdate = () => {
      if (isActiveRef.current) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    // 音频加载错误回调
    const handleError = (e: Event | string) => {
      if (isActiveRef.current) {
        console.warn("音频源错误:", e);
        setHasError(true);
        setIsPlaying(false);
      }
    };

    // 注册事件监听器
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);

    // 自动播放尝试函数
    // 浏览器通常会阻止自动播放，需要用户交互后才能播放
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
            // 播放成功后移除交互监听器
            document.removeEventListener('click', attemptPlay);
            document.removeEventListener('keydown', attemptPlay);
          })
          .catch((error) => {
            if (isActiveRef.current) {
              console.log("自动播放被阻止，等待用户交互...", error);
            }
          });
      }
    };
    
    attemptPlayRef.current = attemptPlay;

    // 如果配置了自动播放，尝试立即播放
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
            // 自动播放失败，注册用户交互监听器
            if (isActiveRef.current) {
              document.addEventListener('click', attemptPlay);
              document.addEventListener('keydown', attemptPlay);
            }
          });
      }
    }

    // 清理函数
    return () => {
      isActiveRef.current = false;
      document.removeEventListener('click', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      attemptPlayRef.current = null;
      
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.pause();
      
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, []);

  // 同步播放状态到 ref
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // 同步错误状态到 ref
  useEffect(() => {
    hasErrorRef.current = hasError;
  }, [hasError]);

  // 音量变化时更新音频音量
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ============================================
  // 页面可见性变化处理
  // 页面隐藏时暂停，恢复时继续播放
  // ============================================
  useEffect(() => {
    // 页面关闭/离开时暂停
    const pauseForPageExit = () => {
      wasPlayingBeforeHiddenRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    };

    // 页面可见性变化处理
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      // 页面隐藏时：记录播放状态并暂停
      if (document.hidden) {
        wasPlayingBeforeHiddenRef.current = isPlayingRef.current;
        if (isPlayingRef.current) {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      // 页面恢复时：如果之前在播放且用户未主动暂停，则恢复播放
      if (!wasPlayingBeforeHiddenRef.current || userPausedRef.current || hasErrorRef.current) return;

      audio.play()
        .then(() => {
          if (isActiveRef.current) {
            setIsPlaying(true);
            setHasError(false);
          }
        })
        .catch((e) => {
          if (isActiveRef.current && e.name !== 'AbortError') {
            console.error("音频恢复播放失败:", e);
            setHasError(true);
            setIsPlaying(false);
          }
        })
        .finally(() => {
          wasPlayingBeforeHiddenRef.current = false;
        });
    };

    // 注册事件监听器
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', pauseForPageExit);
    window.addEventListener('beforeunload', pauseForPageExit);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', pauseForPageExit);
      window.removeEventListener('beforeunload', pauseForPageExit);
    };
  }, []);

  // ============================================
  // 点击外部区域收起控制面板
  // ============================================
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

  // ============================================
  // 播放控制函数
  // ============================================
  
  /** 切换播放/暂停状态 */
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // 暂停播放
      userPausedRef.current = true;
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // 开始播放
      userPausedRef.current = false;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((e) => {
          console.error("音频播放失败:", e);
          setHasError(true);
          setIsPlaying(false);
          if (e.name !== 'AbortError') {
            alert("无法播放音频。请检查 constants.ts 中的 BGM_CONFIG 路径是否正确，或浏览器设置。");
          }
        });
    }
  }, [isPlaying]);

  /** 处理进度条点击跳转 */
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;
    const newTime = (clickPercent / 100) * duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(clickPercent);
  }, [duration]);

  /** 处理音量滑块变化 */
  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  }, []);

  /** 切换控制面板展开/收起 */
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  /** 切换播放器显示/隐藏 */
  const toggleHidden = useCallback(() => {
    setIsHidden(prev => !prev);
    if (isHidden) {
      setIsExpanded(false);
    }
  }, [isHidden]);

  /** 格式化时间（秒 -> mm:ss） */
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // ============================================
  // 键盘快捷键
  // ============================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 空格键：播放/暂停（仅在非输入元素时生效）
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        togglePlay();
      }
      
      // ESC键：隐藏播放器
      if (e.code === 'Escape') {
        setIsHidden(true);
        setIsExpanded(false);
      }
      
      // M键：切换静音
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

  // ============================================
  // 自动收起控制面板（3秒无操作）
  // ============================================
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

  /** 重置自动收起定时器（用户交互时调用） */
  const handleInteraction = useCallback(() => {
    if (expandTimeoutRef.current) {
      clearTimeout(expandTimeoutRef.current);
    }
  }, []);

  // ============================================
  // 渲染：隐藏状态
  // ============================================
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

  // ============================================
  // 渲染：正常状态
  // ============================================
  return (
    <div 
      ref={containerRef}
      className="fixed bottom-3 left-3 md:bottom-6 md:left-6 z-50 flex flex-col items-start"
      onMouseEnter={handleInteraction}
      onMouseLeave={handleInteraction}
    >
      {/* 展开的控制面板 */}
      {isExpanded && (
        <div className={`mb-2 bg-surface/90 backdrop-blur-lg border border-border/20 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-out animate-fadeIn ${isMobile ? 'w-[min(16rem,calc(100vw-1.5rem))]' : 'w-64'}`}>
          {/* 进度条 */}
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
          
          {/* 控制面板内容 */}
          <div className="p-3">
            {/* 时间显示 */}
            <div className="flex justify-between text-[10px] font-mono text-muted mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            
            {/* 控制按钮 */}
            <div className="flex items-center justify-between">
              {/* 播放/暂停按钮 */}
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
              
              {/* 音量控制 */}
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
              
              {/* 隐藏按钮 */}
              <button
                onClick={toggleHidden}
                className="p-1 text-muted hover:text-foreground transition-colors"
                title="隐藏播放器 (Esc)"
              >
                <ChevronDown size={14} />
              </button>
            </div>
            
            {/* 错误状态提示 */}
            {hasError && (
              <div className="mt-2 text-[10px] font-mono text-red-400 text-center">
                音频加载失败
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 最小化按钮 */}
      <button
        onClick={toggleExpanded}
        className={`group flex items-center gap-2 p-2 backdrop-blur-md border transition-all duration-300 rounded-sm shadow-lg active:scale-95 ${
          hasError 
            ? 'bg-red-500/20 border-red-500 text-red-400' 
            : isPlaying 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-surface/10 border-border/10 text-muted hover:text-foreground hover:border-border/30'
        }`}
      >
        <div className="relative">
          {isExpanded ? <ChevronDown size={14} /> : <Music size={14} />}
          {/* 播放中脉冲动画 */}
          {isPlaying && !isExpanded && (
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping"></div>
          )}
        </div>
        
        {/* 状态文字（收起时显示） */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'w-0 opacity-0' : 'w-16 opacity-100'}`}>
          <div className="flex flex-col items-start leading-none whitespace-nowrap">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
              {isPlaying ? 'PLAYING' : 'PAUSED'}
            </span>
            {hasError && <span className="text-[8px] font-mono text-red-300">ERROR</span>}
          </div>
        </div>
        
        {/* 状态指示点（收起时显示） */}
        {!isExpanded && !hasError && (
          <div className={`w-1 h-1 rounded-full ${isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;