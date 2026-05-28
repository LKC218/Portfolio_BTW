
import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggleTheme }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div className="fixed bottom-14 left-3 md:bottom-20 md:left-6 z-50 flex flex-col items-start gap-1">
        <button
            onClick={toggleTheme}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group flex items-center gap-2 p-2 backdrop-blur-md border transition-all duration-300 rounded-sm shadow-lg
                bg-surface/10 border-border/10 text-muted hover:text-foreground hover:border-border/30 hover:bg-surface/20
            `}
            title="切换主题"
        >
            <div className="relative">
                {isDark ? <Moon size={14} /> : <Sun size={14} />}
            </div>
            
            {/* Text - Auto collapse to save space, expand on hover */}
            <div className={`overflow-hidden transition-all duration-300 ease-out ${isHovered ? 'w-16 opacity-100' : 'w-0 opacity-0'}`}>
                <div className="flex flex-col items-start leading-none whitespace-nowrap">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
                        {isDark ? 'DARK' : 'LIGHT'}
                    </span>
                </div>
            </div>
        </button>
    </div>
  );
};

export default ThemeToggle;
