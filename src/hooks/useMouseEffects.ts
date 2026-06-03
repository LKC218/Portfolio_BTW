import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

export const PARALLAX_STRENGTH = {
  FAR: 8,
  MID: 15,
  NEAR: 25,
} as const;

export type ParallaxStrength = keyof typeof PARALLAX_STRENGTH;

export interface NormalizedPointer {
  x: number;
  y: number;
}

export interface UseMouseEffectsResult {
  isSupported: boolean;
  pointer: NormalizedPointer;
  parallaxTo: (target: gsap.TweenTarget, strength: ParallaxStrength) => void;
}

const QUICKTO_DURATION = 0.45;
const QUICKTO_EASE = 'power3.out';

export function useMouseEffects(): UseMouseEffectsResult {
  const [isSupported, setIsSupported] = useState(false);
  const [pointer, setPointer] = useState<NormalizedPointer>({ x: 0, y: 0 });
  const settersCacheRef = useRef<
    Map<gsap.TweenTarget, { xTo: gsap.QuickToFunc; yTo: gsap.QuickToFunc }>
  >(new Map());

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const handleMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setPointer({ x, y });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  const parallaxTo = (target: gsap.TweenTarget, strength: ParallaxStrength) => {
    const factor = PARALLAX_STRENGTH[strength];
    let cached = settersCacheRef.current.get(target);
    if (!cached) {
      const xTo = gsap.quickTo(target, 'x', {
        duration: QUICKTO_DURATION,
        ease: QUICKTO_EASE,
      });
      const yTo = gsap.quickTo(target, 'y', {
        duration: QUICKTO_DURATION,
        ease: QUICKTO_EASE,
      });
      cached = { xTo, yTo };
      settersCacheRef.current.set(target, cached);
    }
    cached.xTo(pointer.x * factor);
    cached.yTo(pointer.y * factor);
  };

  return { isSupported, pointer, parallaxTo };
}
