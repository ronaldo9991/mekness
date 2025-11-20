import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, BarChart3, Signal } from "lucide-react";
import { useState } from "react";

export default function TradingPlatformsMockup() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative h-full flex items-center justify-center py-12 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Static decorative orbs - no animation */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/15 rounded-full blur-3xl opacity-30"></div>

      {/* Animated orbs only on hover */}
      {isHovered && (
        <>
          <motion.div
            className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
            initial={{ scale: 1, opacity: 0.3, x: 0, y: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/15 rounded-full blur-3xl"
            initial={{ scale: 1, opacity: 0.2, x: 0, y: 0 }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2],
              x: [0, -30, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Static geometric shape */}
      <div className="absolute top-20 right-0 w-24 h-24 border-2 border-primary/20 rounded-lg"></div>

      {/* Animated geometric shape only on hover */}
      {isHovered && (
        <motion.div
          className="absolute top-20 right-0 w-24 h-24 border-2 border-primary/30 rounded-lg"
          initial={{ rotate: 0, scale: 1 }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      {/* Phone Mockup - More Realistic */}
      <motion.div
        className="relative w-[320px] h-[650px] z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ y: 0 }}
          animate={isHovered ? {
            y: [0, -15, 0],
          } : { y: 0 }}
          transition={{
            duration: 5,
            repeat: isHovered ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
        {/* Phone Frame - Ultra Realistic */}
        <div className="relative w-full h-full rounded-[48px] bg-gradient-to-b from-gray-950 via-gray-900 to-black p-3 shadow-2xl">
          {/* Outer bezel shine */}
          <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-gray-700/20 via-transparent to-transparent"></div>
          
          {/* Screen container */}
          <div className="relative w-full h-full rounded-[36px] bg-black overflow-hidden border border-gray-800 shadow-inner">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-b-3xl z-30 flex items-center justify-center gap-2">
              <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
            </div>
            
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between z-20 pt-2">
              <span className="text-[11px] text-gray-400 font-medium">9:41</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3 text-gray-400" />
                <Activity className="w-3 h-3 text-gray-400" />
                <div className="w-5 h-2.5 border border-gray-400 rounded-sm relative">
                  <div className="absolute inset-0.5 bg-gray-400 rounded-[1px]"></div>
                </div>
              </div>
            </div>
          
            {/* Screen Content */}
            <div className="relative w-full h-full bg-gradient-to-b from-gray-950 to-black overflow-hidden pt-12">
              {/* Trading Header */}
              <div className="px-4 pb-3 border-b border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-0.5">Equity</div>
                    <div className="text-2xl font-bold text-primary">$3,500.00</div>
                  </div>
                  <motion.div 
                    className="flex items-center gap-1 bg-chart-2/20 px-2 py-1 rounded"
                    animate={isHovered ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                  >
                    <TrendingUp className="w-3 h-3 text-chart-2" />
                    <span className="text-xs text-chart-2 font-semibold">+2.4%</span>
                  </motion.div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">EUR/USD</span>
                    <span className="text-[10px] text-muted-foreground">1.02012</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-[9px] px-2 py-1 bg-primary text-primary-foreground rounded font-semibold">M1</span>
                    <span className="text-[9px] px-2 py-1 text-muted-foreground">M5</span>
                    <span className="text-[9px] px-2 py-1 text-muted-foreground">M15</span>
                    <span className="text-[9px] px-2 py-1 text-muted-foreground">M30</span>
                    <span className="text-[9px] px-2 py-1 text-muted-foreground">H1</span>
                  </div>
                </div>
              </div>

              {/* Chart Area - More Realistic */}
              <div className="relative h-[440px] px-3 py-4">
              {/* Price indicators with glow */}
              <div className="absolute top-8 right-6 z-10 space-y-2">
                <motion.div 
                  className="bg-chart-2 text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-lg"
                  animate={isHovered ? { opacity: [0.8, 1, 0.8] } : { opacity: 1 }}
                  transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
                >
                  Ask 1.02012
                </motion.div>
                <motion.div 
                  className="bg-destructive text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-lg"
                  animate={isHovered ? { opacity: [0.8, 1, 0.8] } : { opacity: 1 }}
                  transition={{ duration: 2, repeat: isHovered ? Infinity : 0, delay: 1 }}
                >
                  Bid 1.00983
                </motion.div>
              </div>

              {/* Enhanced Candlestick Chart */}
              <svg className="w-full h-full" viewBox="0 0 290 400"  preserveAspectRatio="xMidYMid meet">
                {/* Grid lines - More detailed */}
                {[...Array(9)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="20"
                    y1={i * 45 + 20}
                    x2="270"
                    y2={i * 45 + 20}
                    stroke="rgba(212, 175, 55, 0.08)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                ))}
                {[...Array(10)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 28 + 20}
                    y1="20"
                    x2={i * 28 + 20}
                    y2="380"
                    stroke="rgba(212, 175, 55, 0.08)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                ))}

                {/* More realistic Candlesticks with wicks */}
                {[
                  { x: 35, open: 220, close: 180, high: 170, low: 230, type: 'up' },
                  { x: 60, open: 180, close: 150, high: 140, low: 190, type: 'up' },
                  { x: 85, open: 150, close: 130, high: 120, low: 160, type: 'up' },
                  { x: 110, open: 130, close: 155, high: 125, low: 165, type: 'down' },
                  { x: 135, open: 155, close: 175, high: 150, low: 185, type: 'down' },
                  { x: 160, open: 175, close: 140, high: 130, low: 180, type: 'up' },
                  { x: 185, open: 140, close: 115, high: 105, low: 150, type: 'up' },
                  { x: 210, open: 115, close: 100, high: 90, low: 120, type: 'up' },
                  { x: 235, open: 100, close: 90, high: 80, low: 105, type: 'up' },
                  { x: 260, open: 90, close: 85, high: 75, low: 95, type: 'up' },
                ].map((candle, i) => (
                  <motion.g key={i}>
                    {/* High-Low Wick */}
                    <motion.line
                      x1={candle.x}
                      y1={candle.high}
                      x2={candle.x}
                      y2={candle.low}
                      stroke={candle.type === 'up' ? '#10B981' : '#EF4444'}
                      strokeWidth="1.5"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    />
                    {/* Open-Close Body */}
                    <motion.rect
                      x={candle.x - 8}
                      y={Math.min(candle.open, candle.close)}
                      width="16"
                      height={Math.abs(candle.open - candle.close) || 2}
                      fill={candle.type === 'up' ? '#10B981' : '#EF4444'}
                      opacity={candle.type === 'up' ? 0.9 : 1}
                      stroke={candle.type === 'up' ? '#10B981' : '#EF4444'}
                      strokeWidth="0.5"
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: candle.type === 'up' ? 0.9 : 1 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    />
                  </motion.g>
                ))}

                {/* Animated Trend line with glow */}
                <motion.path
                  d="M 35 200 L 60 175 L 85 155 L 110 145 L 135 165 L 160 142 L 185 122 L 210 107 L 235 95 L 260 87"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.7)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2.5, delay: 0.8 }}
                />
                
                {/* Glow filter for trend line */}
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>

              {/* Price axis - More detailed */}
              <div className="absolute right-1 top-6 bottom-20 w-14 flex flex-col justify-between text-[9px] text-muted-foreground font-mono">
                <span className="bg-background/50 px-1 rounded">1.030</span>
                <span className="bg-background/50 px-1 rounded">1.025</span>
                <span className="bg-chart-2/30 px-1 rounded text-chart-2 font-semibold">1.020</span>
                <span className="bg-background/50 px-1 rounded">1.015</span>
                <span className="bg-destructive/30 px-1 rounded text-destructive font-semibold">1.010</span>
                <span className="bg-background/50 px-1 rounded">1.005</span>
                <span className="bg-background/50 px-1 rounded">1.000</span>
                <span className="bg-background/50 px-1 rounded">0.995</span>
                <span className="bg-background/50 px-1 rounded">0.990</span>
              </div>

              {/* Time axis */}
              <div className="absolute bottom-2 left-6 right-16 flex justify-between text-[8px] text-muted-foreground font-mono">
                <span>14:00</span>
                <span>15:00</span>
                <span>16:00</span>
                <span>17:00</span>
                <span>18:00</span>
              </div>
            </div>

            {/* Bottom Trading Panel - Enhanced */}
            <div className="absolute bottom-0 left-0 right-0 glass-morphism border-t border-primary/30 p-4">
              {/* Top controls */}
              <div className="flex items-center justify-between mb-3">
                <button className="text-[10px] text-primary font-medium flex items-center gap-1">
                  <span className="text-primary">+</span> PENDING ORDER
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">LOTS</span>
                  <div className="flex items-center gap-1 bg-accent/50 rounded-lg p-1">
                    <button className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs text-primary hover:bg-primary/30 transition-colors">−</button>
                    <span className="text-sm font-bold w-12 text-center text-foreground">0.50</span>
                    <button className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-xs text-primary hover:bg-primary/30 transition-colors">+</button>
                  </div>
                </div>
              </div>
              
              {/* Trading buttons - Enhanced */}
              <div className="flex gap-2">
                <motion.button 
                  className="flex-1 bg-gradient-to-br from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-white py-3 rounded-lg text-sm font-bold transition-all shadow-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">SELL</span>
                  <div className="text-xs font-normal opacity-80">1.07366</div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                </motion.button>
                
                <motion.button 
                  className="flex-1 bg-gradient-to-br from-chart-2 to-chart-2/80 hover:from-chart-2/90 hover:to-chart-2/70 text-white py-3 rounded-lg text-sm font-bold transition-all shadow-lg relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">BUY</span>
                  <div className="text-xs font-normal opacity-80">1.07376</div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors"></div>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        </div>
        
        {/* Phone reflection - More realistic */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[300px] h-12 bg-primary/20 blur-2xl rounded-full"></div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[280px] h-6 bg-primary/30 blur-xl rounded-full"></div>
        </motion.div>

        {/* Floating data points around phone */}
        <motion.div
          className="absolute top-10 -left-16 glass-morphism px-3 py-2 rounded-lg border border-primary/20"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          animate={isHovered ? { y: [0, -10, 0] } : { y: 0 }}
          transition={isHovered ? { 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.6, delay: 1 },
            x: { duration: 0.6, delay: 1 }
          } : { 
            opacity: { duration: 0.6, delay: 1 },
            x: { duration: 0.6, delay: 1 }
          }}
        >
          <div className="text-[10px] text-muted-foreground">Volume</div>
          <div className="text-sm font-bold text-primary">$5.2B</div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 -right-16 glass-morphism px-3 py-2 rounded-lg border border-primary/20"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          animate={isHovered ? { y: [0, 10, 0] } : { y: 0 }}
          transition={isHovered ? { 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.6, delay: 1.2 },
            x: { duration: 0.6, delay: 1.2 }
          } : { 
            opacity: { duration: 0.6, delay: 1.2 },
            x: { duration: 0.6, delay: 1.2 }
          }}
        >
          <div className="text-[10px] text-muted-foreground">Spread</div>
          <div className="text-sm font-bold text-primary">0.1 pips</div>
        </motion.div>

        <motion.div
          className="absolute top-48 -right-12 glass-morphism px-3 py-2 rounded-lg border border-chart-2/30"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          animate={isHovered ? { y: [0, -8, 0] } : { y: 0 }}
          transition={isHovered ? { 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.6, delay: 1.4 },
            x: { duration: 0.6, delay: 1.4 }
          } : { 
            opacity: { duration: 0.6, delay: 1.4 },
            x: { duration: 0.6, delay: 1.4 }
          }}
        >
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-chart-2" />
            <div className="text-xs font-bold text-chart-2">+0.12%</div>
          </div>
        </motion.div>

        {/* Static decorative wireframe elements */}
        <div className="absolute -top-8 left-10 w-16 h-16 border border-primary/30 rounded-full"></div>
        <div className="absolute bottom-16 -left-8 w-20 h-20 border-2 border-primary/20 rounded-lg"></div>

        {/* Animated wireframe elements only on hover */}
        {isHovered && (
          <>
            <motion.div
              className="absolute -top-8 left-10 w-16 h-16 border border-primary/40 rounded-full"
              initial={{ rotate: 0, scale: 1 }}
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-16 -left-8 w-20 h-20 border-2 border-primary/30 rounded-lg"
              initial={{ rotate: 0 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}

