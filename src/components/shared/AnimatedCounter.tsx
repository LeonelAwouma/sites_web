'use client';

import { useState, useEffect, useRef } from 'react';
import { useOnScreen } from '@/hooks/use-on-screen';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ end, duration = 2000, className }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isVisible = useOnScreen(ref);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const startTime = Date.now();
      
      const animateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const currentCount = Math.floor(progress * end);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
            setCount(end);
        }
      };
      
      requestAnimationFrame(animateCount);
    }
  }, [end, duration, isVisible]);

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString('fr-FR')}
    </span>
  );
}
