import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { COUNTUP_DURATION_MS } from '@/lib/constants';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUpNumber({
  value,
  duration = COUNTUP_DURATION_MS,
  decimals = 0,
  className,
}: CountUpNumberProps) {
  const [displayed, setDisplayed] = useState(0);
  const prevValueRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : true;

    const from = prevValueRef.current;
    const to = value;

    if (prefersReducedMotion) {
      prevValueRef.current = to;
      setDisplayed(to);
      return;
    }

    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easedT = easeOut(t);
      const current = from + (to - from) * easedT;
      setDisplayed(current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevValueRef.current = to;
        setDisplayed(to);
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value, duration]);

  const formatted = displayed.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  return (
    <span className={cn('tabular-nums', className)}>
      {formatted}
    </span>
  );
}
