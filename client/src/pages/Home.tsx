import PublicHeader from "@/components/PublicHeader";
import HeroSection from "@/components/HeroSection";
import FeatureCards from "@/components/FeatureCards";
import LiveTicker from "@/components/LiveTicker";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, TrendingUp, Zap, Globe, Award, Users, 
  BarChart3, Lock, Smartphone, Headphones, CheckCircle2,
  ArrowRight, Sparkles, Cpu, Network
} from "lucide-react";
import { Link } from "wouter";
import ProductsShowcase from "@/components/ProductsShowcase";
import CorporateServices from "@/components/CorporateServices";
import PromoCards from "@/components/PromoCards";
import PartnershipCards from "@/components/PartnershipCards";
import TradingPlatformsMockup from "@/components/TradingPlatformsMockup";
import AccountTypesWithSpreads from "@/components/AccountTypesWithSpreads";
import DownloadsSection from "@/components/DownloadsSection";
import { useMemo } from "react";

// Trading Chart Component - Direct Display
function TradingChart() {
  const candles = useMemo(() => [
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
  ], []);

  return (
    <div className="relative w-full max-w-[560px] rounded-2xl overflow-visible" style={{ border: 'none' }}>
      {/* Trading Interface Content */}
      <div className="relative w-full bg-gradient-to-b from-gray-950 to-black overflow-hidden rounded-2xl" style={{ border: 'none', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)' }}>
        {/* Trading Header */}
        <div className="px-4 py-3 border-b border-primary/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">EUR/USD</span>
              <span className="text-xs text-muted-foreground">1.0834</span>
              <span className="w-1.5 h-1.5 bg-primary/60 rounded-full"></span>
            </div>
            <div className="flex items-center gap-1 bg-chart-2/20 px-2 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 text-chart-2" />
              <span className="text-xs text-chart-2 font-semibold">+0.12%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Spread: <span className="text-primary font-semibold">0.1 pips</span></div>
            <div className="flex gap-1">
              <span className="text-[9px] px-1.5 py-0.5 bg-primary text-primary-foreground rounded font-semibold">M1</span>
              <span className="text-[9px] px-1.5 py-0.5 text-muted-foreground">M5</span>
              <span className="text-[9px] px-1.5 py-0.5 text-muted-foreground">M15</span>
              <span className="text-[9px] px-1.5 py-0.5 text-muted-foreground">H1</span>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative px-3 py-4" style={{ minHeight: '320px' }}>
              {/* Price indicators */}
              <div className="absolute top-4 right-6 z-10 space-y-1.5">
                <div className="bg-chart-2 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">
                  Ask 1.0834
                </div>
                <div className="bg-destructive text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">
                  Bid 1.0732
                </div>
              </div>

              {/* Enhanced Candlestick Chart */}
              <svg className="w-full h-full" viewBox="0 0 290 220" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {[...Array(9)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="20"
                    y1={i * 25 + 20}
                    x2="270"
                    y2={i * 25 + 20}
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
                    y2="200"
                    stroke="rgba(212, 175, 55, 0.08)"
                    strokeWidth="0.5"
                    strokeDasharray="2,2"
                  />
                ))}

                {/* Candlesticks */}
                {candles.map((candle, i) => (
                  <g key={i}>
                    {/* High-Low Wick */}
                    <line
                      x1={candle.x}
                      y1={candle.high}
                      x2={candle.x}
                      y2={candle.low}
                      stroke={candle.type === 'up' ? '#10B981' : '#EF4444'}
                      strokeWidth="1.5"
                    />
                    {/* Open-Close Body */}
                    <rect
                      x={candle.x - 8}
                      y={Math.min(candle.open, candle.close)}
                      width="16"
                      height={Math.abs(candle.open - candle.close) || 2}
                      fill={candle.type === 'up' ? '#10B981' : '#EF4444'}
                      opacity={candle.type === 'up' ? 0.9 : 1}
                      stroke={candle.type === 'up' ? '#10B981' : '#EF4444'}
                      strokeWidth="0.5"
                    />
                  </g>
                ))}

                {/* Trend line */}
                <path
                  d="M 35 200 L 60 175 L 85 155 L 110 145 L 135 165 L 160 142 L 185 122 L 210 107 L 235 95 L 260 87"
                  fill="none"
                  stroke="rgba(212, 175, 55, 0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              {/* Price axis */}
              <div className="absolute right-2 top-4 bottom-8 w-14 flex flex-col justify-between text-[9px] text-muted-foreground font-mono">
                <span className="bg-background/50 px-1 rounded">1.030</span>
                <span className="bg-background/50 px-1 rounded">1.025</span>
                <span className="bg-chart-2/30 px-1 rounded text-chart-2 font-semibold">1.020</span>
                <span className="bg-background/50 px-1 rounded">1.015</span>
                <span className="bg-destructive/30 px-1 rounded text-destructive font-semibold">1.010</span>
                <span className="bg-background/50 px-1 rounded">1.005</span>
                <span className="bg-background/50 px-1 rounded">1.000</span>
              </div>

              {/* Time axis */}
              <div className="absolute bottom-2 left-6 right-16 flex justify-between text-[9px] text-muted-foreground font-mono">
                <span>14:00</span>
                <span>15:00</span>
                <span>16:00</span>
                <span>17:00</span>
                <span>18:00</span>
              </div>
            </div>

        {/* Bottom Trading Panel */}
        <div className="mt-4 glass-morphism border-t border-primary/30 p-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-muted-foreground">Execution: </span>
                <span className="text-primary font-semibold">0.03s</span>
              </div>
              <div>
                <span className="text-muted-foreground">Leverage: </span>
                <span className="text-primary font-semibold">1:500</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-chart-2 text-white px-4 py-2 rounded text-sm font-bold hover:bg-chart-2/90 transition-colors shadow-sm">
                BUY
              </button>
              <button className="bg-destructive text-white px-4 py-2 rounded text-sm font-bold hover:bg-destructive/90 transition-colors shadow-sm">
                SELL
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom glow effect - visible from below like the image */}
      <div className="absolute -bottom-4 left-0 right-0 h-16 bg-gradient-to-t from-primary/25 via-primary/15 to-transparent blur-3xl rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-8 bg-gradient-to-t from-primary/20 via-primary/10 to-transparent blur-2xl rounded-full pointer-events-none"></div>
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[75%] h-6 bg-gradient-to-t from-primary/15 to-transparent blur-xl rounded-full pointer-events-none"></div>
    </div>
  );
}

export default function Home() {
  const stats = useMemo(() => [
    { value: "100K+", label: "Active Traders" },
    { value: "$5B+", label: "Monthly Volume" },
    { value: "0.1", label: "Pip Spreads" },
    { value: "24/7", label: "Support" },
  ], []);

  const platforms = useMemo(() => [
    { name: "MetaTrader 5", description: "Advanced trading platform" },
    { name: "WebTrader", description: "Trade from any browser" },
    { name: "Mobile Apps", description: "iOS & Android" },
    { name: "API Trading", description: "Algorithmic trading" },
  ], []);

  const whyChoose = useMemo(() => [
    {
      icon: Shield,
      title: "Regulated & Secure",
      description: "Licensed by FCA and CySEC with segregated client funds and negative balance protection.",
    },
    {
      icon: Zap,
      title: "Ultra-Fast Execution",
      description: "Order execution in milliseconds with no requotes. Average execution time under 0.03 seconds.",
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access 100+ currency pairs, commodities, indices, and cryptocurrencies from one account.",
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Best Forex Broker 2024. Recognized for excellence in trading technology and customer service.",
    },
    {
      icon: BarChart3,
      title: "Advanced Tools",
      description: "Professional charting, technical indicators, and algorithmic trading capabilities.",
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description: "SSL encryption, 2FA authentication, and PCI DSS compliance for your peace of mind.",
    },
  ], []);

  const accountTypes = useMemo(() => [
    {
      name: "Startup",
      minDeposit: "$100",
      spread: "From 1.2 pips",
      leverage: "Up to 1:100",
      features: ["Free VPS", "24/5 Support", "Educational Resources"],
    },
    {
      name: "Standard",
      minDeposit: "$500",
      spread: "From 0.8 pips",
      leverage: "Up to 1:200",
      features: ["Priority Support", "Advanced Analytics", "Free Signals"],
      popular: true,
    },
    {
      name: "Pro",
      minDeposit: "$2,000",
      spread: "From 0.3 pips",
      leverage: "Up to 1:500",
      features: ["Dedicated Manager", "API Access", "Premium Tools"],
    },
    {
      name: "VIP",
      minDeposit: "$10,000",
      spread: "From 0.1 pips",
      leverage: "Up to 1:500",
      features: ["Personal Analyst", "Custom Solutions", "Exclusive Events"],
    },
  ], []);

  const testimonials = useMemo(() => [
    {
      name: "Sarah Mitchell",
      role: "Professional Trader",
      content: "The execution speed is incredible. I've been trading for 10 years and Mekness has the best platform I've used.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Forex Investor",
      content: "Customer support is outstanding. They resolved my query within minutes. Highly recommended!",
      rating: 5,
    },
    {
      name: "Maria Rodriguez",
      role: "Day Trader",
      content: "Ultra-low spreads and no hidden fees. Finally found a broker I can trust with my capital.",
      rating: 5,
    },
  ], []);

  return (
    <div className="min-h-screen">
      <PublicHeader />
      
      {/* Enhanced Hero */}
      <div className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Multi-layer background system */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5"></div>
        
        {/* Accent gradient orbs - Light effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Trusted by 100,000+ Traders Worldwide</span>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
                style={{ lineHeight: '1.2' }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Trade Beyond Borders.{" "}
                   <span className="text-gradient-gold text-glow-gold">Trade Mekness.</span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-muted-foreground max-w-lg"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Experience next-generation forex trading with ultra-low spreads from 0.1 pips, 
                lightning-fast execution, and institutional-grade security.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <Link href="/signup">
                  <Button size="lg" className="gap-2 text-lg px-8 magnetic-hover neon-gold" data-testid="button-open-live-account">
                    Open Live Account
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/signup?demo=true">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8 magnetic-hover neon-border-animate" data-testid="button-try-demo">
                    Try Demo Free
                    <TrendingUp className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Rating Section - HIDDEN */}
              {/* <motion.div
                className="flex items-center gap-6 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <CheckCircle2 key={i} className="w-4 h-4 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">Rated 5.0 by 10,000+ traders</p>
                </div>
              </motion.div> */}
            </motion.div>

            <motion.div
              className="relative h-full hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {/* Trading Chart - Direct Display */}
              <TradingChart />
            </motion.div>
          </div>
        </div>
      </div>

      <LiveTicker />

      <PromoCards />

      {/* Stats Section - HIDDEN */}
      {/* <div className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div> */}

      {/* <FeatureCards /> */}

      {/* Trading Platforms - WebTrader Web3 Style */}
      <div className="pt-12 md:pt-16 pb-16 md:pb-24 px-4 relative overflow-hidden">
        {/* Advanced Background effects */}
        <div className="absolute inset-0 cyber-grid opacity-15"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-black/20 to-background"></div>
        
        {/* Floating geometric decorations */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-primary/10 rounded-lg"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 border-2 border-primary/10 rounded-full"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Gradient orbs for depth */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          {/* Title - Centered with enhanced styling */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BarChart3 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Multi-Platform Trading</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
                  <span className="text-gradient-gold text-glow-gold">Advanced</span> Trading Platforms
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Trade on desktop, web, or mobile with our cutting-edge platforms. 
              <span className="text-primary"> Experience lightning-fast execution anywhere, anytime.</span>
            </p>
          </motion.div>

          {/* Two Column Layout with better spacing */}
          <div className="grid gap-12 lg:gap-16 lg:grid-cols-[1fr,1.2fr] items-center">
            {/* Left Side - Platform Cards - Bigger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {platforms.map((platform, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  <Card className="p-8 text-center glass-morphism-strong card-hover-3d h-full group border-primary/20 relative overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-l-2 border-t-2 border-primary/30 rounded-tl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-r-2 border-b-2 border-primary/30 rounded-br-lg"></div>
                    
                    {/* Icon with enhanced glow */}
                    <div className="relative">
                      <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 neon-gold group-hover:animate-pulse-glow transition-all duration-300 relative">
                        {index === 0 && <Cpu className="w-12 h-12 text-primary transition-colors duration-300" />}
                        {index === 1 && <Globe className="w-12 h-12 text-primary transition-colors duration-300" />}
                        {index === 2 && <Smartphone className="w-12 h-12 text-primary transition-colors duration-300" />}
                        {index === 3 && <Network className="w-12 h-12 text-primary transition-colors duration-300" />}
                      </div>
                      {/* Glow ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-primary/20 rounded-2xl group-hover:scale-110 transition-transform duration-300"></div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-all duration-300">{platform.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{platform.description}</p>
                    
                    {/* Hover scan effect */}
                    <div className="absolute inset-0 scanline-effect"></div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Right Side - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <TradingPlatformsMockup />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Why Choose Mekness */}
      <div className="pt-12 md:pt-16 pb-20 md:pb-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-gradient-gold text-glow-gold inline-block pb-2">Mekness</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the world's most advanced forex trading platform trusted by professionals worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 border-card-border glass-morphism card-hover-3d scanline-effect h-full group">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 neon-gold group-hover:animate-pulse-glow transition-all duration-300">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-all duration-300">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <PartnershipCards />

      <AccountTypesWithSpreads />

      <DownloadsSection />

      {/* Testimonials */}
      <div className="py-16 md:py-24 px-4 bg-accent/30">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="text-gradient-gold text-glow-gold inline-block pb-2">Traders Say</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trusted by thousands of traders worldwide.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 glass-morphism card-hover-3d h-full group">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <CheckCircle2 key={i} className="w-5 h-5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed italic">{testimonial.content}</p>
                  <div className="pt-4 border-t border-primary/20">
                    <div className="font-semibold text-lg group-hover:text-primary transition-all duration-300">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <CTASection />
      <Footer />
    </div>
  );
}
