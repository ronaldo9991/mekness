import { motion } from "framer-motion";

interface AnimatedGridProps {
  className?: string;
  variant?: "default" | "cyber" | "hexagon";
}

export default function AnimatedGrid({ className = "", variant = "default" }: AnimatedGridProps) {
  const getGridClass = () => {
    switch (variant) {
      case "cyber":
        return "cyber-grid";
      case "hexagon":
        return "hexagon-pattern";
      default:
        return "web3-grid-bg";
    }
  };

  return (
    <div className={`absolute inset-0 ${getGridClass()} ${className}`}>
      {/* Radial gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-background"></div>
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent"></div>
      
      {/* Animated gradient orbs - Gold only */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-80 h-80 bg-primary/12 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

