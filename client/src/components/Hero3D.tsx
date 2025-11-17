import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Hero3D() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      canvasRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <div ref={canvasRef} className="relative transition-transform duration-300 ease-out" style={{ transformStyle: "preserve-3d" }}>
        {/* Floating cubes */}
        <motion.div
          className="absolute w-32 h-32 border-2 border-primary/30 rounded-lg"
          style={{ transform: "translateZ(50px)" }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-2 bg-primary/5 rounded-lg backdrop-blur-sm"></div>
        </motion.div>

        {/* Orbiting spheres */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full border-2 border-primary/40"
            style={{
              left: "50%",
              top: "50%",
              marginLeft: "-48px",
              marginTop: "-48px",
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: {
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 3 + i,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent"></div>
          </motion.div>
        ))}

        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-40 h-40 rounded-full bg-primary/10 blur-3xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
        </div>

        {/* Glowing lines */}
        <svg className="absolute inset-0 w-full h-full" style={{ transform: "translateZ(100px)" }}>
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${50 + Math.cos((i * Math.PI) / 2.5) * 40}%`}
              y2={`${50 + Math.sin((i * Math.PI) / 2.5) * 40}%`}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
