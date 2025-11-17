import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const tickerData = [
  { pair: "EUR/USD", price: "1.0834", change: "+0.12%", up: true },
  { pair: "GBP/USD", price: "1.2654", change: "+0.08%", up: true },
  { pair: "USD/JPY", price: "149.82", change: "-0.15%", up: false },
  { pair: "XAU/USD", price: "2356.32", change: "+0.45%", up: true },
  { pair: "AUD/USD", price: "0.6543", change: "-0.22%", up: false },
  { pair: "USD/CHF", price: "0.8832", change: "+0.05%", up: true },
];

export default function LiveTicker() {
  const duplicatedData = [...tickerData, ...tickerData, ...tickerData];
  
  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-y border-primary/30">
      <motion.div
        className="flex gap-8 py-3"
        animate={{
          x: [0, -100 * tickerData.length],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        {duplicatedData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 whitespace-nowrap"
            data-testid={`ticker-item-${index}`}
          >
            <span className="font-semibold text-primary">{item.pair}</span>
            <span className="text-foreground font-mono">{item.price}</span>
            <span
              className={`flex items-center gap-1 text-sm ${
                item.up ? "text-chart-2" : "text-destructive"
              }`}
            >
              {item.up ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {item.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
