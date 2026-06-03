import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMouseEffects } from '../../hooks/useMouseEffects';

const CURSOR_COLOR = '#ccff00';
const CURSOR_BOX_SIZE = 36;
const CURSOR_BORDER_RADIUS = '2px';
const CURSOR_OFFSET = CURSOR_BOX_SIZE / 2;

const CURSOR_INNER_SIZE = 10;
const CURSOR_INNER_COLOR = '#000000';
const CURSOR_INNER_RADIUS = '1px';

const CURSOR_SCALE_IDLE = 12 / CURSOR_BOX_SIZE;
const CURSOR_SCALE_HOVER = 48 / CURSOR_BOX_SIZE;
const CURSOR_SCALE_PRESSED = 24 / CURSOR_BOX_SIZE;

const FOLLOW_DURATION = 0.35;
const FOLLOW_EASE = 'power3.out';
const SCALE_DURATION = 0.2;
const SCALE_EASE = 'power2.out';
const OPACITY_DURATION = 0.2;

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-hover], [data-cursor]';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const isHoveringRef = useRef(false);
  const isPressedRef = useRef(false);
  const isInsideRef = useRef(false);
  const { isSupported } = useMouseEffects();

  useEffect(() => {
    if (!isSupported) return;
    const dot = dotRef.current;
    if (!dot) return;

    gsap.set(dot, {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      scale: CURSOR_SCALE_IDLE,
      opacity: 0,
    });

    if (innerRef.current) {
      gsap.set(innerRef.current, { scale: 0 });
    }

    const xTo = gsap.quickTo(dot, 'x', {
      duration: FOLLOW_DURATION,
      ease: FOLLOW_EASE,
    });
    const yTo = gsap.quickTo(dot, 'y', {
      duration: FOLLOW_DURATION,
      ease: FOLLOW_EASE,
    });

    const setVisualState = () => {
      let targetScale: number;
      let innerScale: number;
      if (isPressedRef.current && isHoveringRef.current) {
        targetScale = CURSOR_SCALE_PRESSED;
        innerScale = 1;
      } else if (isHoveringRef.current) {
        targetScale = CURSOR_SCALE_HOVER;
        innerScale = 1;
      } else {
        targetScale = CURSOR_SCALE_IDLE;
        innerScale = 0;
      }
      gsap.to(dot, {
        scale: targetScale,
        duration: SCALE_DURATION,
        ease: SCALE_EASE,
        overwrite: 'auto',
      });
      if (innerRef.current) {
        gsap.to(innerRef.current, {
          scale: innerScale,
          duration: SCALE_DURATION,
          ease: SCALE_EASE,
          overwrite: 'auto',
        });
      }
    };

    const refreshHoverStateFromTarget = (target: Element | null) => {
      const inside = !!(target && target.closest(INTERACTIVE_SELECTOR));
      if (inside !== isHoveringRef.current) {
        isHoveringRef.current = inside;
        setVisualState();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!isInsideRef.current) {
        isInsideRef.current = true;
        gsap.to(dot, { opacity: 1, duration: OPACITY_DURATION, ease: 'power2.out' });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      refreshHoverStateFromTarget(e.target as Element | null);
    };

    const handleMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as Element | null;
      refreshHoverStateFromTarget(related);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const insideInteractive = !!(target && target.closest(INTERACTIVE_SELECTOR));
      if (!insideInteractive) return;
      isPressedRef.current = true;
      setVisualState();
    };

    const handleMouseUp = () => {
      if (!isPressedRef.current) return;
      isPressedRef.current = false;
      setVisualState();
    };

    const handleDocLeave = () => {
      isInsideRef.current = false;
      gsap.to(dot, { opacity: 0, duration: OPACITY_DURATION, ease: 'power2.out' });
    };

    const handleDocEnter = () => {
      isInsideRef.current = true;
      gsap.to(dot, { opacity: 1, duration: OPACITY_DURATION, ease: 'power2.out' });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleDocLeave);
    document.addEventListener('mouseenter', handleDocEnter);

    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleDocLeave);
      document.removeEventListener('mouseenter', handleDocEnter);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [isSupported]);

  if (!isSupported) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: CURSOR_BOX_SIZE,
        height: CURSOR_BOX_SIZE,
        borderRadius: CURSOR_BORDER_RADIUS,
        backgroundColor: CURSOR_COLOR,
        pointerEvents: 'none',
        zIndex: 300,
        marginLeft: -CURSOR_OFFSET,
        marginTop: -CURSOR_OFFSET,
        willChange: 'transform, opacity',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.15)',
      }}
    >
      <span
        ref={innerRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: CURSOR_INNER_SIZE,
          height: CURSOR_INNER_SIZE,
          marginLeft: -CURSOR_INNER_SIZE / 2,
          marginTop: -CURSOR_INNER_SIZE / 2,
          borderRadius: CURSOR_INNER_RADIUS,
          backgroundColor: CURSOR_INNER_COLOR,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default CustomCursor;
