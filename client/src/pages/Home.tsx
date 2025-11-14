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
import Hero3D from "@/components/Hero3D";
import AnimatedGrid from "@/components/AnimatedGrid";
import ParticleField from "@/components/ParticleField";
import ProductsShowcase from "@/components/ProductsShowcase";
import CorporateServices from "@/components/CorporateServices";
import PromoCards from "@/components/PromoCards";
import PartnershipCards from "@/components/PartnershipCards";
import TradingPlatformsMockup from "@/components/TradingPlatformsMockup";
import AccountTypesWithSpreads from "@/components/AccountTypesWithSpreads";
import DownloadsSection from "@/components/DownloadsSection";

export default function Home() {
  const stats = [
    { value: "100K+", label: "Active Traders" },
    { value: "$5B+", label: "Monthly Volume" },
    { value: "0.1", label: "Pip Spreads" },
    { value: "24/7", label: "Support" },
  ];

  const platforms = [
    { name: "MetaTrader 5", description: "Advanced trading platform" },
    { name: "WebTrader", description: "Trade from any browser" },
    { name: "Mobile Apps", description: "iOS & Android" },
    { name: "API Trading", description: "Algorithmic trading" },
  ];

  const whyChoose = [
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
  ];

  const accountTypes = [
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
  ];

  const testimonials = [
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
  ];

  return (
    <div className="min-h-screen">
      <PublicHeader />
      
      {/* Enhanced Hero */}
      <div className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Multi-layer background system */}
        <AnimatedGrid variant="cyber" />
        <ParticleField count={80} className="opacity-40" />
        
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5"></div>
        
        <div className="absolute inset-0 opacity-20">
          <Hero3D />
        </div>

        {/* Accent gradient orbs */}
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
              className="relative h-[600px] hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              {/* 3D Card Design with Enhanced Glassmorphism */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-80 h-96 rounded-2xl glass-morphism-strong neon-gold"
                    style={{
                      transform: `translateZ(${i * 50}px) rotateY(${i * 5}deg)`,
                      zIndex: 3 - i,
                    }}
                    animate={{
                      rotateY: [i * 5, i * 5 + 10, i * 5],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {i === 0 && (
                      <div className="p-8 h-full flex flex-col justify-center relative scanline-effect">
                        <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          EUR/USD
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse-glow"></span>
                        </div>
                        <div className="text-5xl font-bold mb-1 text-glow-gold">1.0834</div>
                        <div className="flex items-center gap-2 text-primary mb-8">
                          <TrendingUp className="w-6 h-6" />
                          <span className="text-2xl font-semibold">+0.12%</span>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm p-3 rounded-lg bg-background/20 backdrop-blur-sm border border-primary/20">
                            <span className="text-muted-foreground">Spread</span>
                            <span className="font-semibold text-primary">0.1 pips</span>
                          </div>
                          <div className="flex justify-between text-sm p-3 rounded-lg bg-background/20 backdrop-blur-sm border border-primary/20">
                            <span className="text-muted-foreground">Execution</span>
                            <span className="font-semibold text-primary">0.03s</span>
                          </div>
                          <div className="flex justify-between text-sm p-3 rounded-lg bg-background/20 backdrop-blur-sm border border-primary/20">
                            <span className="text-muted-foreground">Leverage</span>
                            <span className="font-semibold text-primary">1:500</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
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
            {/* Left Side - Platform Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Card className="p-6 text-center glass-morphism-strong card-hover-3d h-full group border-primary/20 relative overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg"></div>
                    
                    {/* Icon with enhanced glow */}
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-gold group-hover:animate-pulse-glow transition-all duration-300 relative">
                        {index === 0 && <Cpu className="w-8 h-8 text-primary transition-colors duration-300" />}
                        {index === 1 && <Globe className="w-8 h-8 text-primary transition-colors duration-300" />}
                        {index === 2 && <Smartphone className="w-8 h-8 text-primary transition-colors duration-300" />}
                        {index === 3 && <Network className="w-8 h-8 text-primary transition-colors duration-300" />}
                      </div>
                      {/* Glow ring */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-primary/20 rounded-2xl group-hover:scale-110 transition-transform duration-300"></div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-all duration-300">{platform.name}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{platform.description}</p>
                    
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
              Why Choose <span className="text-gradient-gold text-glow-gold">Mekness</span>
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
              What Our <span className="text-gradient-gold text-glow-gold">Traders Say</span>
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
