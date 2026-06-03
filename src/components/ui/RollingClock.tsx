
import React, { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

const GRADIENT_STYLE: React.CSSProperties = {
  backgroundImage: 'linear-gradient(to bottom, white, rgba(255,255,255,0.6))',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

interface RollingDigitProps {
  value: string;
  strokeWidth?: string;
}

const STROKE_PAD_Y = 0.075;
const STROKE_PAD_X = 0.04;

const getTimeParts = () => {
  const now = new Date();
  return {
    h: String(now.getHours()).padStart(2, '0'),
    m: String(now.getMinutes()).padStart(2, '0'),
    s: String(now.getSeconds()).padStart(2, '0')
  };
};

const RollingDigit: React.FC<RollingDigitProps> = ({ value, strokeWidth = '2px' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentDigitRef = useRef<HTMLDivElement>(null);
  const prevValueRef = useRef<string>(value);

  const strokeStyle: React.CSSProperties = {
    ...GRADIENT_STYLE,
    WebkitTextStroke: `${strokeWidth} rgba(255,255,255,0.1)`,
  };

  useEffect(() => {
    if (!containerRef.current || !currentDigitRef.current) return;
    
    const prevValue = prevValueRef.current;
    if (prevValue === value) return;

    prevValueRef.current = value;

    const isNumber = /^\d$/.test(value) && /^\d$/.test(prevValue);
    
    if (!isNumber) {
      if (currentDigitRef.current) {
        currentDigitRef.current.textContent = value;
      }
      return;
    }

    const applyGradient = (el: HTMLDivElement) => {
      el.style.backgroundImage = GRADIENT_STYLE.backgroundImage as string;
      el.style.webkitBackgroundClip = 'text';
      el.style.backgroundClip = 'text';
      el.style.webkitTextFillColor = 'transparent';
      el.style.color = 'transparent';
      el.style.webkitTextStroke = `${strokeWidth} rgba(255,255,255,0.1)`;
    };

    const oldDigit = document.createElement('div');
    oldDigit.textContent = prevValue;
    oldDigit.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:transform,opacity;';
    applyGradient(oldDigit);
    
    const newDigit = document.createElement('div');
    newDigit.textContent = value;
    newDigit.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:transform,opacity;';
    applyGradient(newDigit);
    gsap.set(newDigit, { yPercent: 100, opacity: 0 });

    containerRef.current.appendChild(oldDigit);
    containerRef.current.appendChild(newDigit);

    if (currentDigitRef.current) {
      currentDigitRef.current.style.visibility = 'hidden';
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (currentDigitRef.current) {
          currentDigitRef.current.textContent = value;
          currentDigitRef.current.style.visibility = 'visible';
        }
        oldDigit.remove();
        newDigit.remove();
      }
    });

    tl.to(oldDigit, {
      yPercent: -100,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in'
    }, 0);

    tl.to(newDigit, {
      yPercent: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, 0.1);

    return () => {
      tl.kill();
    };
  }, [value, strokeWidth]);

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center justify-center overflow-hidden"
      style={{ 
        height: `${1 + STROKE_PAD_Y * 2}em`,
        minWidth: `${0.6 + STROKE_PAD_X * 2}em`,
        padding: `${STROKE_PAD_Y}em ${STROKE_PAD_X}em`,
        boxSizing: 'border-box',
      }}
    >
      <div 
        ref={currentDigitRef}
        style={strokeStyle}
        className="flex items-center justify-center"
      >
        {value}
      </div>
    </div>
  );
};

interface RollingClockProps {
  className?: string;
  strokeWidth?: string;
}

const RollingClock: React.FC<RollingClockProps> = ({ 
  className = '',
  strokeWidth = '2px'
}) => {
  const [time, setTime] = React.useState(getTimeParts);

  useEffect(() => {
    const update = () => {
      setTime(getTimeParts());
    };

    const intervalId = setInterval(update, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const digits = useMemo(() => [
    { char: time.h[0], key: 'h1' },
    { char: time.h[1], key: 'h2' },
    { char: ':', key: 'sep1', isSeparator: true },
    { char: time.m[0], key: 'm1' },
    { char: time.m[1], key: 'm2' },
    { char: ':', key: 'sep2', isSeparator: true },
    { char: time.s[0], key: 's1' },
    { char: time.s[1], key: 's2' }
  ], [time]);

  return (
    <div className={`inline-flex items-center leading-none ${className}`}>
      {digits.map(({ char, key, isSeparator }) => (
        isSeparator ? (
          <span 
            key={key}
            style={{ ...GRADIENT_STYLE, width: '0.3em' }}
            className="inline-flex items-center justify-center"
          >
            {char}
          </span>
        ) : (
          <RollingDigit 
            key={key}
            value={char}
            strokeWidth={strokeWidth}
          />
        )
      ))}
    </div>
  );
};

export default RollingClock;
