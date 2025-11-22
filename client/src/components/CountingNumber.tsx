import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface CountingNumberProps {
  target: number;
  duration?: number;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function CountingNumber({ 
  target, 
  duration = 2000, 
  suffix = "", 
  className = "",
  decimals = 0
}: CountingNumberProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      let startTime: number | null = null;
      const startValue = 0;
      
      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = startValue + (target - startValue) * easeOutQuart;
        
        setCount(currentCount);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, target, duration]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <span ref={ref} className={className}>
      {formatNumber(count || 0)}{suffix}
    </span>
  );
}

