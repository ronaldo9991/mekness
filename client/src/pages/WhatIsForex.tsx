import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import ParticleField from "@/components/ParticleField";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Globe, TrendingUp, DollarSign, Clock, Users, Shield,
  Zap, BarChart3, ArrowRight, Check, LineChart
} from "lucide-react";
import { Link } from "wouter";
import CountingNumber from "@/components/CountingNumber";

export default function WhatIsForex() {
  const stats = [
    { value: 5.5, label: "Trillion USD", prefix: "$", suffix: "T", description: "Daily Trading Volume" },
    { value: 100, label: "Products", suffix: "+", description: "Investment Options" },
    { value: 24, label: "Hours Trading", suffix: "/7", description: "Market Accessibility" },
    { value: 100, label: "Leverage", prefix: "1:", description: "Trading Power" },
  ];

  const keyFeatures = [
    {
      icon: Globe,
      title: "World's Largest Financial Market",
      description: "Forex is the largest and most liquid financial market globally, with over $5.5 trillion traded daily. Connect with millions of traders worldwide and access unprecedented opportunities.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
    },
    {
      icon: Clock,
      title: "24/7 Market Access",
      description: "Unlike stock markets, forex operates 24 hours a day, 5 days a week across different time zones. Trade whenever it suits you - morning, afternoon, or night.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    },
    {
      icon: TrendingUp,
      title: "Trade Both Directions",
      description: "Profit from both rising and falling markets. Go long (buy) when you expect prices to rise, or go short (sell) when you anticipate a decline. Maximum flexibility for any market condition.",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80"
    },
    {
      icon: Zap,
      title: "High Liquidity & Fast Execution",
      description: "Execute trades in milliseconds with tight spreads. The forex market's high liquidity ensures your orders are filled quickly at the best available prices.",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80"
    },
  ];

  const currencyPairs = [
    { name: "EUR/USD", description: "Euro vs US Dollar", type: "Major", volume: "Highest" },
    { name: "GBP/USD", description: "British Pound vs US Dollar", type: "Major", volume: "High" },
    { name: "USD/JPY", description: "US Dollar vs Japanese Yen", type: "Major", volume: "High" },
    { name: "AUD/USD", description: "Australian Dollar vs US Dollar", type: "Major", volume: "Medium" },
    { name: "EUR/GBP", description: "Euro vs British Pound", type: "Cross", volume: "Medium" },
    { name: "USD/TRY", description: "US Dollar vs Turkish Lira", type: "Exotic", volume: "Lower" },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Currency Pairs",
      description: "Forex trading involves buying one currency while simultaneously selling another. Currencies are quoted in pairs like EUR/USD (Euro/US Dollar).",
      icon: DollarSign
    },
    {
      step: "2",
      title: "Price Movement",
      description: "When you believe the first currency (base) will strengthen against the second (quote), you buy. If you expect it to weaken, you sell.",
      icon: TrendingUp
    },
    {
      step: "3",
      title: "Leverage Trading",
      description: "Use leverage up to 1:100 to control larger positions with a smaller initial investment. This amplifies both potential profits and risks.",
      icon: Zap
    },
    {
      step: "4",
      title: "Profit & Loss",
      description: "Your profit or loss is determined by the difference between your entry and exit prices, multiplied by your position size and leverage.",
      icon: BarChart3
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center overflow-hidden pt-36 sm:pt-48 pb-20">
        <AnimatedGrid variant="cyber" />
        <ParticleField count={100} className="opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1920&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center mt-8"
          >
            <div className="inline-block mb-10">
              <div className="px-6 py-2.5 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm neon-gold">
                <span className="text-primary font-semibold">The World's Largest Financial Market</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-12 leading-tight">
              What is
              <span className="block mt-6 text-gradient-animated text-glow-gold inline-block pb-2">Forex Trading?</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              Foreign Exchange (Forex/FX) is the global marketplace for trading currencies. Discover how <span className="text-primary font-bold">$5.5 trillion</span> moves through this market every single day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="neon-gold magnetic-hover shadow-[0_6px_20px_0_rgba(212,175,55,0.42)]">
                  Start Trading Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="neon-border-animate">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gradient-gold text-glow-gold mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block pb-1">
                  {stat.prefix}
                  <CountingNumber 
                    target={stat.value} 
                    duration={2500}
                    decimals={stat.value < 10 ? 1 : 0}
                  />
                  {stat.suffix}
                </div>
                <div className="text-base sm:text-lg font-semibold text-foreground mb-2">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* What is Forex - Detailed Explanation */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Understanding <span className="text-gradient-gold text-glow-gold inline-block pb-1">Forex Markets</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Forex, short for "foreign exchange," is the process of converting one currency into another for various purposes such as commerce, trading, or tourism.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card className="p-8 glass-morphism-strong border-primary/20 h-full shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500">
                <h3 className="text-2xl font-bold mb-6 text-gradient-gold text-glow-gold inline-block pb-1">The Forex Market</h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    The foreign exchange market is where currencies are traded. It's the largest and most liquid financial market in the world, with an average daily trading volume exceeding <span className="text-primary font-semibold">$5.5 trillion</span>.
                  </p>
                  <p>
                    Unlike stocks or commodities, forex doesn't have a centralized exchange. Instead, currencies trade electronically over-the-counter (OTC) through computer networks between traders worldwide.
                  </p>
                  <p>
                    The forex market operates 24 hours a day, 5 days a week across major financial centers in London, New York, Tokyo, Zurich, Frankfurt, Hong Kong, Singapore, Paris, and Sydney.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500"
            >
              <motion.img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80" 
                alt="Global forex trading"
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-lg font-semibold">Global currency trading connects markets across continents</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Key Features of <span className="text-gradient-gold text-glow-gold inline-block pb-1">Forex Trading</span>
            </h2>
          </motion.div>

          <div className="space-y-12">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <motion.div 
                  className={index % 2 === 1 ? 'lg:order-2' : ''}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 glass-morphism-strong border-primary/20 h-full shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <feature.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gradient-gold text-glow-gold inline-block pb-1">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.5 }}
                  className={`relative h-[350px] rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                >
                  <motion.img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Currency Pairs */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Popular Currency <span className="text-gradient-gold text-glow-gold inline-block pb-1">Pairs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trade the world's most liquid currency pairs with tight spreads and fast execution
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currencyPairs.map((pair, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                <Card className="p-6 glass-morphism-strong border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-2xl font-bold text-gradient-gold text-glow-gold inline-block pb-1">{pair.name}</div>
                    <div className="px-3 py-1 bg-primary/10 rounded-full text-xs font-semibold text-primary">
                      {pair.type}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{pair.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Trading Volume:</span>
                    <span className="text-foreground font-semibold">{pair.volume}</span>
                  </div>
                </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              How Forex <span className="text-gradient-gold text-glow-gold inline-block pb-1">Trading Works</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding the fundamentals of forex trading
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card className="p-8 glass-morphism-strong border-primary/20 shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500 h-full">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                      {item.step}
                    </div>
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gradient-gold text-glow-gold inline-block pb-1">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-morphism-strong border-primary/20 p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1920&q=80')] bg-cover bg-center opacity-5"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start <span className="text-gradient-gold text-glow-gold inline-block pb-1">Trading Forex</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of traders worldwide. Open your account today and access the world's largest financial market.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="neon-gold magnetic-hover shadow-[0_6px_20px_0_rgba(212,175,55,0.42)]">
                      Open Live Account
                    </Button>
                  </Link>
                  <Link href="/forex">
                    <Button variant="outline" size="lg">
                      Explore More
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-muted-foreground/60 mt-6">
                  Risk Warning: Trading involves risk. Your capital is at risk.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

