import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  assets: string[];
  title: string;
  onComplete: () => void;
}

const MIN_VISIBLE_MS = 3200;
const MAX_BLOCKING_MS = 12000;
const ACCENT_COLOR = '#FF1D12';

const CARD_LAYOUT = [
  { x: -30, y: -8, rotate: -12, scale: 1.06, z: 1 },
  { x: -10, y: -20, rotate: 9, scale: 0.98, z: 3 },
  { x: 15, y: 16, rotate: -7, scale: 1, z: 2 },
  { x: 0, y: 6, rotate: 4, scale: 1.04, z: 4 },
];

const BOARD_LAYOUT = [
  { x: -18, y: -8, rotate: -13, scale: 1.12, color: '#F2EDE6', z: 0 },
  { x: 14, y: -2, rotate: 10, scale: 1.08, color: '#D71913', z: 1 },
  { x: 2, y: 10, rotate: -4, scale: 1.04, color: '#F2EDE6', z: 2 },
];

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
  const stackRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const progressValueRef = useRef({ value: 0 });
  const completedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  const displayAssets = useMemo(() => assets.slice(0, 4), [assets]);
  const titleCharacters = useMemo(() => Array.from(title), [title]);

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
      gsap.set(stackRef.current, { xPercent: -50, yPercent: -50, x: 0, y: 0, rotate: 0 });
      gsap.set(titleRef.current, { autoAlpha: 1 });
      gsap.set('.preloader-title-char', { yPercent: 105, autoAlpha: 1 });
      gsap.set('.preloader-board', {
        autoAlpha: 0,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 28,
        scale: 0,
        rotate: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set('.preloader-card', {
        autoAlpha: 0,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 34,
        scale: 0,
        rotate: 0,
        transformOrigin: '50% 50%',
      });
      gsap.set('.preloader-counter', { autoAlpha: 0, y: 20 });
      gsap.set('.preloader-meta', { autoAlpha: 0, y: 14 });
      gsap.set('.preloader-line', { scaleX: 0, transformOrigin: 'left center' });
      gsap.set('.preloader-dot', { autoAlpha: 0, scale: 0 });

      if (reduceMotion) {
        gsap.set('.preloader-title-char', { yPercent: 0 });
        gsap.set('.preloader-board', {
          autoAlpha: 1,
          xPercent: -50,
          yPercent: -50,
          x: (index) => `${BOARD_LAYOUT[index]?.x || 0}%`,
          y: (index) => `${BOARD_LAYOUT[index]?.y || 0}%`,
          scale: (index) => BOARD_LAYOUT[index]?.scale || 1,
          rotate: (index) => BOARD_LAYOUT[index]?.rotate || 0,
        });
        gsap.set('.preloader-card', {
          autoAlpha: 1,
          x: (index) => `${CARD_LAYOUT[index]?.x || 0}%`,
          y: (index) => `${CARD_LAYOUT[index]?.y || 0}%`,
          scale: (index) => CARD_LAYOUT[index]?.scale || 1,
          rotate: (index) => CARD_LAYOUT[index]?.rotate || 0,
        });
        gsap.set('.preloader-counter', { autoAlpha: 1, y: 0 });
        gsap.set('.preloader-meta', { autoAlpha: 1, y: 0 });
        gsap.set('.preloader-line', { scaleX: 1 });
        gsap.set('.preloader-dot', { autoAlpha: 1, scale: 1 });
        return;
      }

      gsap.timeline({ defaults: { force3D: true } })
        .to('.preloader-board', {
          autoAlpha: 1,
          x: (index) => `${BOARD_LAYOUT[index]?.x || 0}%`,
          y: (index) => `${BOARD_LAYOUT[index]?.y || 0}%`,
          scale: (index) => BOARD_LAYOUT[index]?.scale || 1,
          rotate: (index) => BOARD_LAYOUT[index]?.rotate || 0,
          duration: 0.56,
          stagger: { each: 0.06, from: 'start' },
          ease: 'back.out(1.55)',
        }, 0.04)
        .to('.preloader-card', {
          autoAlpha: 1,
          x: (index) => `${CARD_LAYOUT[index]?.x || 0}%`,
          y: (index) => `${CARD_LAYOUT[index]?.y || 0}%`,
          scale: (index) => CARD_LAYOUT[index]?.scale || 1,
          rotate: (index) => CARD_LAYOUT[index]?.rotate || 0,
          duration: 0.72,
          stagger: { each: 0.1, from: 'start' },
          ease: 'back.out(1.42)',
        }, 0.08)
        .to('.preloader-title-char', {
          yPercent: 0,
          duration: 0.82,
          stagger: { each: 0.035, from: 'random' },
          ease: 'power4.out',
        }, 0.34)
        .to('.preloader-counter', {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: 'power2.out',
        }, 0.62)
        .to('.preloader-dot', {
          autoAlpha: 1,
          scale: 1,
          duration: 0.26,
          ease: 'back.out(2.2)',
        }, 0.78)
        .to('.preloader-line', {
          scaleX: 1,
          duration: 0.72,
          ease: 'power3.out',
        }, 0.92)
        .to('.preloader-meta', {
          autoAlpha: 1,
          y: 0,
          duration: 0.46,
          ease: 'power2.out',
        }, 1.06);

      gsap.to(stackRef.current, {
        y: -8,
        rotate: 0.25,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to('.preloader-dot', {
        autoAlpha: 0.54,
        scale: 0.88,
        duration: 0.82,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();
    const totalUnits = Math.max(assets.length + 1, 1);
    let completedUnits = 0;
    let visualProgress = 0;
    let targetProgress = 10;
    let rafId = 0;

    const setTargetFromUnits = () => {
      targetProgress = 10 + Math.round((completedUnits / totalUnits) * 83);
    };

    const animateProgress = () => {
      if (cancelled) return;
      visualProgress += (targetProgress - visualProgress) * 0.1;
      const nextProgress = Math.min(99, Math.round(visualProgress));
      progressValueRef.current.value = nextProgress;
      setProgress(nextProgress);
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
        duration: 0.44,
        ease: 'power2.out',
        onUpdate: () => {
          setProgress(Math.round(progressValueRef.current.value));
        },
        onComplete: () => {
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          gsap.timeline({ onComplete })
            .to('.preloader-counter', reduceMotion ? {
              autoAlpha: 0,
              duration: 0.14,
            } : {
              yPercent: -110,
              autoAlpha: 0,
              duration: 0.5,
              ease: 'circ.inOut',
            })
            .to('.preloader-meta', {
              autoAlpha: 0,
              y: -16,
              duration: reduceMotion ? 0.14 : 0.3,
              ease: 'power2.inOut',
            }, '<')
            .to('.preloader-line', {
              scaleX: 0,
              duration: reduceMotion ? 0.14 : 0.36,
              ease: 'power2.inOut',
            }, '<')
            .to('.preloader-title-char', reduceMotion ? {
              autoAlpha: 0,
              duration: 0.16,
            } : {
              yPercent: -110,
              duration: 0.88,
              stagger: { each: 0.03, from: 'random' },
              ease: 'expo.inOut',
            }, '<18%')
            .to('.preloader-card', reduceMotion ? {
              autoAlpha: 0,
              duration: 0.16,
            } : {
              x: (index) => `${(CARD_LAYOUT[index]?.x || 0) * 0.32}%`,
              y: (index) => `${(CARD_LAYOUT[index]?.y || 0) * 0.32}%`,
              scale: 0,
              rotate: (index) => (CARD_LAYOUT[index]?.rotate || 0) * -1.25,
              duration: 0.64,
              stagger: { each: 0.08, from: 'end' },
              ease: 'expo.inOut',
            }, '<')
            .to('.preloader-board', reduceMotion ? {
              autoAlpha: 0,
              duration: 0.16,
            } : {
              x: 0,
              y: 0,
              scale: 0,
              rotate: (index) => (BOARD_LAYOUT[index]?.rotate || 0) * -1.1,
              duration: 0.52,
              stagger: { each: 0.05, from: 'end' },
              ease: 'expo.inOut',
            }, '<12%')
            .to('.preloader-dot', { autoAlpha: 0, scale: 0, duration: reduceMotion ? 0.14 : 0.22 }, '<')
            .to(rootRef.current, reduceMotion ? {
              autoAlpha: 0,
              duration: 0.2,
              ease: 'power1.out',
            } : {
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 1.18,
              ease: 'power2.inOut',
            }, '<30%');
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
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black text-[#F2EDE6]"
      style={{ clipPath: 'inset(0% 0% 0% 0%)', contain: 'layout paint style' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.045),transparent_34%)]" />

      <div className="pointer-events-none relative z-40 flex items-center justify-center overflow-visible px-3 text-center">
        <div className="overflow-hidden py-[0.24em] -my-[0.24em]">
          <h1
            ref={titleRef}
            aria-label={title}
            className="flex max-w-[94vw] select-none items-center justify-center overflow-visible whitespace-nowrap text-[19vw] font-black uppercase leading-[0.92] tracking-[-0.065em] text-[#F2EDE6] mix-blend-difference drop-shadow-[0_0_24px_rgba(242,237,230,0.16)] md:max-w-none md:text-[10.75vw]"
          >
            {titleCharacters.map((character, index) => (
              <span key={`${character}-${index}`} className="preloader-title-char inline-block will-change-transform" aria-hidden="true">
                {character === ' ' ? '\u00A0' : character}
              </span>
            ))}
          </h1>
        </div>
      </div>

      <div className="preloader-line absolute bottom-[17%] left-1/2 z-40 h-px w-[min(52vw,560px)] -translate-x-1/2 bg-[#F2EDE6]/22 mix-blend-difference" />
      <div className="preloader-meta absolute bottom-[calc(17%-1.45rem)] left-1/2 z-40 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.38em] text-[#F2EDE6]/38 mix-blend-difference md:text-[11px]">
        Beyond The World / Environment Art
      </div>

      <div
        ref={stackRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-30 aspect-[9/12] w-[54vw] max-w-[220px] md:w-[16vw] md:max-w-[270px]"
        aria-hidden="true"
      >
        {BOARD_LAYOUT.map((board, index) => (
          <div
            key={`board-${index}`}
            className="preloader-board absolute left-1/2 top-1/2 h-full w-full shadow-[0_22px_70px_rgba(0,0,0,0.42)]"
            style={{ backgroundColor: board.color, zIndex: board.z }}
          />
        ))}
        {displayAssets.map((asset, index) => {
          const layout = CARD_LAYOUT[index] || CARD_LAYOUT[0];
          return (
            <img
              key={`${asset}-${index}`}
              src={asset}
              alt=""
              aria-hidden="true"
              className="preloader-card absolute left-1/2 top-1/2 h-full w-full object-cover shadow-[0_22px_70px_rgba(0,0,0,0.52)]"
              style={{ zIndex: layout.z + BOARD_LAYOUT.length }}
            />
          );
        })}
      </div>

      <div className="preloader-counter absolute right-[8vw] top-[33%] z-50 font-mono text-3xl font-black tracking-[-0.06em] text-[#F2EDE6] mix-blend-difference md:right-[clamp(3rem,13vw,13rem)] md:top-[calc(50%-6.6rem)] md:text-4xl">
        {String(progress).padStart(3, '0')}
      </div>

      <div
        className="preloader-dot absolute left-[37vw] top-[56%] z-50 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(255,29,18,0.85)] md:left-[calc(50%-9.4rem)] md:top-[calc(50%+3.25rem)]"
        style={{ backgroundColor: ACCENT_COLOR }}
      />
    </div>
  );
};

export default Preloader;
