interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const iconSizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "w-10 h-10 sm:w-12 sm:h-12",
  md: "w-12 h-12 sm:w-14 sm:h-14",
  lg: "w-16 h-16 sm:w-20 sm:h-20",
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
        <img
          src="/Mekness Background Removed.png"
          alt="Mekness Limited logo"
          className="w-full h-full object-contain"
        />
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
