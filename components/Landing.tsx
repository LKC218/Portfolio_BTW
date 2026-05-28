import React, { useEffect, useState } from 'react';
import { ArrowRight, Power } from 'lucide-react';

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative z-20 w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decor text */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none select-none overflow-hidden">
        <div className="absolute top-10 left-10 font-mono text-[10px] text-white/30 tracking-widest animate-pulse">
            SYSTEM_BOOT_SEQUENCE...
        </div>
        <div className="absolute bottom-10 right-10 font-mono text-[10px] text-white/30 tracking-widest text-right">
            AUTH_REQUIRED<br/>SECURE_CHANNEL
        </div>
      </div>

      {/* Main Content Container */}
      <div className={`flex flex-col items-center text-center transition-all duration-1000 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Logo / Icon Area */}
        <div className="mb-8 relative group cursor-pointer" onClick={onEnter}>
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="w-24 h-24 border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center relative overflow-hidden group-hover:border-white/50 transition-colors duration-300">
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 animate-[ping_2s_infinite]"></div>
                <Power size={48} className="text-white/80 group-hover:text-white transition-colors" />
                
                {/* Rotating Ring */}
                <div className="absolute inset-0 border border-dashed border-white/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            </div>
        </div>

        {/* Typography */}
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase mb-4 mix-blend-difference">
            NEO<span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">-VISION</span>
        </h1>
        
        <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12 bg-white/30"></div>
            <span className="font-mono text-xs md:text-sm text-gray-400 tracking-[0.3em] uppercase">沉浸式视觉档案系统</span>
            <div className="h-px w-12 bg-white/30"></div>
        </div>

        {/* Enter Button */}
        <button 
            onClick={onEnter}
            className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs md:text-sm overflow-hidden transition-all hover:bg-[#00F0FF] hover:scale-105 active:scale-95"
        >
            <span className="relative z-10 flex items-center gap-3">
                初始化系统
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            
            {/* Button Glitch Effect Layer */}
            <div className="absolute inset-0 bg-white mix-blend-difference opacity-0 group-hover:opacity-20 animate-[pulse_0.2s_infinite]"></div>
        </button>

        {/* Footer Status */}
        <div className="mt-16 font-mono text-[9px] text-gray-600 uppercase tracking-wider flex flex-col gap-1 items-center">
            <span>Server Status: Online</span>
            <span>Latency: 12ms</span>
        </div>
      </div>
    </div>
  );
};

export default Landing;