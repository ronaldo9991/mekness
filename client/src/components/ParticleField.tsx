import { motion } from "framer-motion";
import { useMemo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

export default function ParticleField({ count = 50, className = "" }: ParticleFieldProps) {
  const particles = useMemo(() => {
    const colors = [
      "rgba(212, 175, 55, 0.6)",  // Gold
      "rgba(212, 175, 55, 0.5)",  // Gold lighter
      "rgba(212, 175, 55, 0.4)",  // Gold lightest
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    })) as Particle[];
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Connection lines between nearby particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {particles.slice(0, 20).map((particle, i) => {
          const nextParticle = particles[(i + 1) % 20];
          return (
            <motion.line
              key={`line-${i}`}
              x1={`${particle.x}%`}
              y1={`${particle.y}%`}
              x2={`${nextParticle.x}%`}
              y2={`${nextParticle.y}%`}
              stroke="rgba(212, 175, 55, 0.1)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

