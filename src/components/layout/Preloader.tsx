import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  assets: string[];
  title: string;
  onComplete: () => void;
}

const MIN_VISIBLE_MS = 1600;
const MAX_BLOCKING_MS = 12000;

const waitForImage = (src: string) => new Promise<void>((resolve) => {
  const image = new Image();
  image.onload = () => resolve();
  image.onerror = () => resolve();
  image.src = src;
});

const waitForFonts = () => {
  if (!('fonts' in document)) return Promise.resolve();
  return document.fonts.ready.then(() => undefined).catch(() => undefined);
};

const Preloader: React.FC<PreloaderProps> = ({ assets, title, onComplete }) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const imageLayerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressValueRef = useRef({ value: 0 });
  const completedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  const displayAssets = useMemo(() => assets.slice(0, 6), [assets]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const context = gsap.context(() => {
      gsap.set(rootRef.current, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(titleRef.current, { autoAlpha: 0, y: 24, filter: 'blur(10px)' });
      gsap.set('.preloader-image', { autoAlpha: 0, scale: 0.92, y: 18, rotate: 0 });

      if (reduceMotion) {
        gsap.set(titleRef.current, { autoAlpha: 1, y: 0, filter: 'blur(0px)' });
        return;
      }

      gsap.timeline()
        .to(titleRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.75,
          ease: 'power3.out',
        })
        .to('.preloader-image', {
          autoAlpha: 0.86,
          scale: 1,
          y: 0,
          rotate: (index) => [-5, 4, -3, 5, -4, 3][index] || 0,
          duration: 0.34,
          stagger: 0.12,
          ease: 'power3.out',
        }, 0.2)
        .to('.preloader-image', {
          autoAlpha: 0.12,
          scale: 1.05,
          duration: 0.35,
          stagger: 0.08,
          ease: 'power2.inOut',
        }, 0.74);
    }, rootRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    const totalUnits = Math.max(assets.length + 1, 1);
    let completedUnits = 0;
    let visualProgress = 0;
    let targetProgress = 12;
    let rafId = 0;

    const setTargetFromUnits = () => {
      targetProgress = 12 + Math.round((completedUnits / totalUnits) * 70);
    };

    const animateProgress = () => {
      if (cancelled) return;
      visualProgress += (targetProgress - visualProgress) * 0.12;
      const nextProgress = Math.min(99, Math.round(visualProgress));
      progressValueRef.current.value = nextProgress;
      setProgress(nextProgress);
      gsap.set(progressBarRef.current, { scaleX: nextProgress / 100 });
      rafId = requestAnimationFrame(animateProgress);
    };

    const completeUnit = () => {
      completedUnits += 1;
      setTargetFromUnits();
    };

    const finish = () => {
      if (cancelled || completedRef.current) return;
      completedRef.current = true;
      targetProgress = 100;

      gsap.to(progressValueRef.current, {
        value: 100,
        duration: 0.38,
        ease: 'power2.out',
        onUpdate: () => {
          const nextProgress = Math.round(progressValueRef.current.value);
          setProgress(nextProgress);
          gsap.set(progressBarRef.current, { scaleX: nextProgress / 100 });
        },
        onComplete: () => {
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          gsap.timeline({ onComplete })
            .to(titleRef.current, reduceMotion ? {
              autoAlpha: 0,
              duration: 0.18,
            } : {
              scale: 1.035,
              letterSpacing: '0.14em',
              duration: 0.26,
              ease: 'power2.out',
            })
            .to(rootRef.current, reduceMotion ? {
              autoAlpha: 0,
              duration: 0.2,
              ease: 'power1.out',
            } : {
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 1.08,
              ease: 'power2.inOut',
            });
        },
      });
    };

    animateProgress();

    const imageTasks = assets.map((asset) => waitForImage(asset).then(completeUnit));
    const fontTask = waitForFonts().then(completeUnit);
    const maxBlockingTask = new Promise<void>((resolve) => {
      window.setTimeout(resolve, MAX_BLOCKING_MS);
    });

    Promise.race([
      Promise.all([...imageTasks, fontTask]).then(() => undefined),
      maxBlockingTask,
    ]).then(() => {
      if (cancelled) return;
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(finish, remaining);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [assets, onComplete]);

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label={`正在加载${title}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black text-white"
      style={{ clipPath: 'inset(0% 0% 0% 0%)', contain: 'layout paint style' }}
    >
      <div ref={imageLayerRef} className="pointer-events-none fixed inset-0 flex items-center justify-center">
        {displayAssets.map((asset, index) => (
          <img
            key={`${asset}-${index}`}
            src={asset}
            alt=""
            aria-hidden="true"
            className="preloader-image absolute aspect-[9/12] w-[34vw] max-w-[220px] object-cover opacity-0 mix-blend-screen md:w-[12vw] md:max-w-[260px]"
            style={{
              transform: `translate(${[-34, 28, -8, 38, -42, 14][index] || 0}px, ${[-24, 18, 34, -30, 8, -12][index] || 0}px)`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex w-full flex-col items-center px-6">
        <div className="mb-5 font-mono text-xs uppercase tracking-[0.45em] text-white/45 md:text-sm">
          Portfolio Loading
        </div>
        <h1
          ref={titleRef}
          className="select-none text-center text-[22vw] font-black leading-none tracking-[0.08em] text-white mix-blend-difference drop-shadow-[0_0_28px_rgba(204,255,0,0.22)] md:text-[13vw]"
        >
          {title}
        </h1>
      </div>

      <div className="absolute bottom-8 left-6 right-6 z-20 md:left-10 md:right-10">
        <div className="mb-3 flex items-end justify-between font-mono text-xs uppercase tracking-[0.26em] text-white/60">
          <span>LOADING</span>
          <span>{String(progress).padStart(3, '0')}%</span>
        </div>
        <div className="h-px origin-left overflow-hidden bg-white/20">
          <div ref={progressBarRef} className="h-full origin-left scale-x-0 bg-[#CCFF00] shadow-[0_0_18px_rgba(204,255,0,0.85)]" />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
