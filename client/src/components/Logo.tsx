interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const iconSizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "w-9 h-9 sm:w-10 sm:h-10",
  md: "w-10 h-10 sm:w-12 sm:h-12",
  lg: "w-12 h-12 sm:w-14 sm:h-14",
};

const textSizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export default function Logo({
  className = "",
  showText = true,
  size = "md",
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`relative ${iconSizeMap[size]} group`}>
        <svg
          viewBox="0 0 200 200"
          role="img"
          aria-label="Mekness Limited logo"
          className="w-full h-full drop-shadow-[0_8px_24px_rgba(212,175,55,0.32)] transition-transform duration-500 group-hover:scale-105"
        >
          <defs>
            <radialGradient id="mekness-gold" cx="30%" cy="30%" r="85%">
              <stop offset="0%" stopColor="#F7E49C" />
              <stop offset="35%" stopColor="#E6C963" />
              <stop offset="75%" stopColor="#C08A1B" />
              <stop offset="100%" stopColor="#C9972E" />
            </radialGradient>
            <filter id="mekness-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M32 0h136a32 32 0 0 1 32 32v136c0 17.7-14.3 32-32 32H32C14.3 200 0 185.7 0 168V32C0 14.3 14.3 0 32 0Z"
            fill="url(#mekness-gold)"
            filter="url(#mekness-glow)"
          />
          <path
            d="M58 150V50h26l16 28 16-28h26v100h-26V96l-16 28-16-28v54Z"
            fill="#090909"
          />
          <text
            x="100"
            y="176"
            textAnchor="middle"
            fontFamily="'Inter', 'Segoe UI', sans-serif"
            fontSize="22"
            fontWeight="600"
            fill="#0A0A0A"
          >
            Mekness Limited
          </text>
        </svg>
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 animate-pulse-glow rounded-3xl" />
        </div>
      </div>
      {showText && (
        <span
          className={`font-serif font-bold ${textSizeMap[size]} text-foreground transition-opacity duration-300 group-hover:text-glow-gold`}
        >
          Mekness
        </span>
      )}
    </div>
  );
}
