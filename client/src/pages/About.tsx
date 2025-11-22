import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import ParticleField from "@/components/ParticleField";
import CountingNumber from "@/components/CountingNumber";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Lightbulb, 
  Rocket, 
  Target, 
  Users, 
  Globe, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Infinity,
  Brain,
  Palette,
  Music,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { Link } from "wouter";

export default function About() {
  const stats = [
    { icon: Users, value: 500, suffix: "+", label: "Employees Worldwide" },
    { icon: Globe, value: 60, suffix: "+", label: "Countries Available" },
    { icon: TrendingUp, value: 70000, suffix: "+", label: "Happy Customers Worldwide" },
  ];

  const philosophyPrinciples = [
    {
      icon: Lightbulb,
      title: "We are simple and easy to understand",
      description: "We believe in simplicity because we know plainness will bring you much closer to us. Simplicity is one of our goals. We know it shall be easier for us to work together and form a working bond with each other due to simple and clear communication modes. We invite you to invest on the products and for that, we provide the simplest explanation.",
    },
    {
      icon: Rocket,
      title: "We love to produce",
      description: "We are innovators! We develop and produce to offer you the best service available. Being innovators, we offer services and products best suited for your taste and money. Our financial market is developed consistently to provide you a financial market in every aspect, which shall help you in gaining an accurate point of view.",
    },
    {
      icon: Target,
      title: "We love to excel",
      description: "We always explore! We love to add the value of excellence in financial markets. We aim to excel at our financial markets and to add value to it. Our priority is to excel at what we do. With the best Technology, infrastructure and trading conditions, we help you move towards a successful future.",
    },
  ];

  const naturephilosophy = [
    {
      icon: Infinity,
      title: "UNIVERSE IS CHAOS",
      description: "Investing is a lifetime profession and a discipline of constant learning. Markets appear chaotic, yet every turbulent move hides an internal structure. The Mekness philosophy embraces that duality—helping traders decode disorder to find new alpha.",
      image: "/chaos.jpg"
    },
    {
      icon: Brain,
      title: "UNPREDICTABLE",
      description: "No cycle repeats perfectly. Our research teams model the emergent patterns that self-correct and evolve, turning unpredictability into a strategic advantage without ignoring risk.",
      image: "https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg?auto=compress&cs=tinysrgb&w=1600"
    },
    {
      icon: Layers,
      title: "WINNING LOOP",
      description: "Each feedback loop—from strategy testing to post-trade analytics—adds a new layer of intelligence. Mekness platforms hardwire these loops so traders can refine faster and scale smarter.",
      image: "/winning.jpg"
    },
    {
      icon: Palette,
      title: "ART OF TRADING",
      description: "We believe trading is both science and art. Craft, timing, and emotional discipline harmonize with data-driven execution—turning every portfolio into a symphony of well-calibrated decisions.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f"
    },
  ];

  const howToTrade = [
    {
      step: "1",
      title: "Open Demo Account",
      description: "You can fill the free demo account form on the side to open an unreal account and try the market without any risk.",
    },
    {
      step: "2",
      title: "Open Real Account",
      description: "You can apply to open a real account to enter the world of investment.",
    },
    {
      step: "3",
      title: "Start Trading",
      description: "After depositing the initial investment you can easily start to trade.",
    },
  ];

  return (
    <div className="min-h-screen">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-[65vh] md:min-h-[80vh] flex items-center overflow-hidden pt-28 md:pt-40 pb-14 md:pb-20">
        <AnimatedGrid variant="cyber" />
        <ParticleField count={60} className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-8"
            >
              <div className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm neon-gold">
                <span className="text-primary font-semibold">An investment company for who think big</span>
              </div>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              About <span className="text-gradient-gold text-glow-gold">Mekness</span>
            </h1>
            <motion.p 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              A game Changer!
            </motion.p>
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Mekness is reshaping the rules in Investment world and simplicity to invest.
            </motion.p>
          </motion.div>

          {/* Stats - Without Cards, With Counting Animation */}
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 mt-16 sm:mt-20 lg:mt-24 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                className="text-center group"
              >
                {/* Icon with glow effect */}
                <motion.div 
                  className="inline-flex items-center justify-center mb-6 relative"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30 group-hover:border-primary/60 transition-all duration-300">
                    <stat.icon className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                  </div>
                </motion.div>

                {/* Counting Number */}
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-3 text-glow-gold">
                  <CountingNumber 
                    target={stat.value} 
                    suffix={stat.suffix}
                    duration={2500}
                  />
                </div>

                {/* Label */}
                <div className="text-base sm:text-lg text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </div>

                {/* Decorative line */}
                <motion.div 
                  className="w-16 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.15 }}
                ></motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About Mekness Section - Redesigned */}
      <div className="py-16 md:py-24 px-4 bg-muted/30 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 web3-grid-bg opacity-5"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          {/* Main Content - Zig-Zag Dynamic Layout */}
          <div className="max-w-7xl mx-auto relative">
            {/* Company Description - Top Center with Diagonal Accent */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mb-20"
            >
              {/* Diagonal line decorations */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-primary/50"></div>
              
              <div className="relative glass-morphism-strong border-2 border-primary/30 rounded-3xl p-8 md:p-12 neon-gold max-w-5xl mx-auto overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse-glow rounded-3xl"></div>
                <div className="absolute inset-0 scanline-effect opacity-20 rounded-3xl"></div>
                <div className="absolute -top-20 -left-16 w-56 h-56 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 space-y-8 text-center">
                  <div className="flex justify-center">
                    <div className="rounded-2xl border border-primary/30 bg-black/40 px-6 py-4 shadow-[0_0_40px_-10px_rgba(212,175,55,0.35)]">
                      <Logo className="!gap-2 [&>div]:w-12 [&>div]:h-12" showText />
                    </div>
                  </div>
                  <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                    What began in 2018 as a boutique dealing desk determined to simplify cross-border investing has grown into the
                    <span className="font-bold text-gradient-gold text-glow-gold inline-block pb-2"> Mekness ecosystem</span>—a global network of technologists, quants, and market specialists.
                    We obsess over transforming complex market infrastructure into an experience that feels human, intuitive, and uncompromisingly secure.
                  </p>
                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    Every release, from our first liquidity hub to today’s Web3-inspired trading environment, is measured against one promise:
                    empower ambitious traders to move faster while taking smarter risk. That mindset has helped clients ride through volatility,
                    expand into new asset classes, and build lasting wealth alongside the Mekness team.
                  </p>

                  <div className="grid gap-6 sm:grid-cols-3 text-left">
                    <div className="glass-morphism border border-primary/20 rounded-2xl p-4">
                      <span className="text-xs uppercase tracking-widest text-primary/80">2018 → Foundation</span>
                      <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Launched in London with a single goal—erase the friction between everyday investors and institutional-grade forex execution.
                      </p>
                    </div>
                    <div className="glass-morphism border border-primary/20 rounded-2xl p-4">
                      <span className="text-xs uppercase tracking-widest text-primary/80">2020 → Acceleration</span>
                      <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Delivered integrated analytics, advanced risk tooling, and multilingual support as our client community crossed 30,000 traders.
                      </p>
                    </div>
                    <div className="glass-morphism border border-primary/20 rounded-2xl p-4">
                      <span className="text-xs uppercase tracking-widest text-primary/80">2024 → Momentum</span>
                      <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Web3-inspired interface, AI-driven insights, and 70K+ active accounts keep Mekness on track to redefine the standard for forex experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connecting diagonal lines */}
              <div className="absolute -bottom-10 left-1/4 w-px h-20 bg-gradient-to-b from-primary/50 to-transparent"></div>
              <div className="absolute -bottom-10 right-1/4 w-px h-20 bg-gradient-to-b from-primary/50 to-transparent"></div>
            </motion.div>

          {/* Mission & Vision */}
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl shadow-2xl flex flex-col lg:flex-row"
            >
              <div className="relative w-full lg:w-2/5 h-56 lg:h-auto overflow-hidden">
                <img
                  src="/vision.jpg"
                  alt="Mekness vision"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
              </div>
              <div className="relative z-10 glass-morphism-strong border border-primary/20 rounded-3xl lg:rounded-l-none flex-1 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/25 rounded-2xl blur-xl"></div>
                  <Lightbulb className="relative w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gradient-gold text-glow-gold">Our Vision</h3>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                To become the world's most trusted and innovative forex broker, empowering traders globally through cutting-edge technology,
                  transparent operations, and unwavering commitment to client success. We envision financial markets where every trader, regardless of location,
                  can access institutional liquidity, real-time intelligence, and mentorship that unlocks lasting independence.
              </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl shadow-2xl flex flex-col lg:flex-row-reverse"
            >
              <div className="relative w-full lg:w-2/5 h-56 lg:h-auto overflow-hidden">
                <img
                  src="/mision.jpg"
                  alt="Mekness mission"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-black/20 to-transparent"></div>
              </div>
              <div className="relative z-10 glass-morphism-strong border border-primary/20 rounded-3xl lg:rounded-r-none flex-1 p-6 sm:p-8 lg:p-10 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/25 rounded-2xl blur-xl"></div>
                  <Target className="relative w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gradient-gold text-glow-gold">Our Mission</h3>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
                  To provide traders with institutional-grade trading conditions, advanced platforms, and comprehensive education. Every feature we ship is tested
                  against real trading desks, from execution speed to risk dashboards, so Mekness clients can focus on strategy while we safeguard pricing,
                  liquidity, and compliance behind the scenes.
                </p>
              </div>
            </motion.div>
          </div>

            {/* Trust Badge - Bottom Center */}
            <motion.div
              className="flex items-center justify-center gap-3 mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="glass-morphism-strong border-2 border-primary/30 rounded-full px-8 py-4 neon-gold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm text-primary font-semibold uppercase tracking-wider">
                  Regulated • Secure • Trusted Since 2018
                </span>
                <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
            </motion.div>
          </div>

          {/* Philosophy - Horizontal Timeline Flow */}
          <div className="mt-20 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            
            {/* Animated flowing dots on the line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 overflow-hidden">
              <div className="w-2 h-2 bg-primary rounded-full animate-flow-horizontal"></div>
            </div>

            <div className="grid gap-12 md:grid-cols-2 xl:grid-cols-3 relative">
              {philosophyPrinciples.map((principle, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative group"
                >
                  {/* Connection point on line */}
                  <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/30 rounded-full border-2 border-primary group-hover:scale-150 group-hover:bg-primary transition-all duration-300 z-10">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                  </div>

                  {/* Vertical connecting line from dot to icon */}
                  <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-primary/50 to-transparent"></div>

                  {/* Content */}
                  <div className="text-center pt-28 sm:pt-36 md:pt-44">
                    {/* Large Icon with Number Badge */}
                    <motion.div
                      className="relative inline-flex items-center justify-center mb-8"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
                      
                      {/* Icon container */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center border-2 border-primary/40 backdrop-blur-sm">
                        <principle.icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary" />
                      </div>

                      {/* Number badge */}
                      <div className="absolute -top-2 -right-2 w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center border-2 border-background text-primary-foreground font-bold text-sm sm:text-base md:text-xl">
                        {index + 1}
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:text-gradient-gold group-hover:text-glow-gold transition-all duration-300">
                      {principle.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {principle.description}
                    </p>

                    {/* Decorative bottom element */}
                    <motion.div
                      className="w-20 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Our Journey - Vertical Timeline */}
      <div className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gradient-gold text-glow-gold inline-block pb-2">Journey</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From humble beginnings to a global leader in forex trading
            </p>
          </motion.div>

          {/* Vertical Timeline */}
          <div className="max-w-5xl mx-auto relative">
            {/* Vertical connecting line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>

            {/* Timeline Items */}
            <div className="space-y-16">
              {/* 2018 - Founded */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="md:text-right mb-8 md:mb-0">
                    <div className="inline-block glass-morphism-strong border-2 border-primary/30 rounded-2xl p-8 neon-gold hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4 md:justify-end mb-4">
                        <Rocket className="w-10 h-10 text-primary" />
                        <h3 className="text-3xl font-bold text-primary">2018</h3>
                    </div>
                      <h4 className="text-xl font-bold mb-2">Mekness Founded</h4>
                      <p className="text-muted-foreground">
                        Established with a vision to democratize forex trading and provide accessible financial services globally.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping"></div>
                </div>
              </motion.div>

              {/* 2019 - 10K Traders */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="hidden md:block"></div>
                  <div className="mb-8 md:mb-0">
                    <div className="inline-block glass-morphism-strong border-2 border-primary/30 rounded-2xl p-8 neon-gold hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <Users className="w-10 h-10 text-primary" />
                        <h3 className="text-3xl font-bold text-primary">2019</h3>
                      </div>
                      <h4 className="text-xl font-bold mb-2">10,000+ Active Traders</h4>
                      <p className="text-muted-foreground">
                        Rapid growth through exceptional service and word-of-mouth recommendations from satisfied clients.
                      </p>
          </div>
        </div>
      </div>
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping"></div>
                </div>
          </motion.div>

              {/* 2020 - Regulation */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="md:text-right mb-8 md:mb-0">
                    <div className="inline-block glass-morphism-strong border-2 border-primary/30 rounded-2xl p-8 neon-gold hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4 md:justify-end mb-4">
                        <CheckCircle2 className="w-10 h-10 text-primary" />
                        <h3 className="text-3xl font-bold text-primary">2020</h3>
                    </div>
                      <h4 className="text-xl font-bold mb-2">Regulatory Licenses Achieved</h4>
                      <p className="text-muted-foreground">
                        Obtained licenses from top-tier regulatory bodies, ensuring client protection and trust.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping"></div>
                </div>
              </motion.div>

              {/* 2022 - Global Expansion */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="hidden md:block"></div>
                  <div className="mb-8 md:mb-0">
                    <div className="inline-block glass-morphism-strong border-2 border-primary/30 rounded-2xl p-8 neon-gold hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4 mb-4">
                        <Globe className="w-10 h-10 text-primary" />
                        <h3 className="text-3xl font-bold text-primary">2022</h3>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Expanded to 60+ Countries</h4>
                      <p className="text-muted-foreground">
                        Global expansion with multilingual support and local payment methods across continents.
                      </p>
          </div>
        </div>
      </div>
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping"></div>
                </div>
          </motion.div>

              {/* 2024 - 70K+ Traders */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                  <div className="md:text-right mb-8 md:mb-0">
                    <div className="inline-block glass-morphism-strong border-2 border-primary/30 rounded-2xl p-8 neon-gold hover:scale-105 transition-all duration-300">
                      <div className="flex items-center gap-4 md:justify-end mb-4">
                        <TrendingUp className="w-10 h-10 text-primary" />
                        <h3 className="text-3xl font-bold text-primary">2024</h3>
                      </div>
                      <h4 className="text-xl font-bold mb-2">70,000+ Happy Customers</h4>
                      <p className="text-muted-foreground">
                        Became one of the fastest-growing forex brokers globally with advanced platforms and exceptional service.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
                {/* Timeline dot */}
                <div className="absolute left-8 md:left-1/2 top-8 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Philosophy - Nature Inspired Flow Design */}
      <div className="py-24 px-4 relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0 web3-grid-bg opacity-10"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10 max-w-7xl">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-3">
              Our <span className="text-gradient-gold text-glow-gold inline-block pb-2">Philosophy</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Our perspective on investing is inspired from nature
            </p>
          </motion.div>

          {/* Philosophy Items - Editorial Image Layout */}
          <div className="relative max-w-6xl mx-auto space-y-20">
              {naturephilosophy.map((item, index) => {
              const isReversed = index % 2 === 1;

                return (
              <motion.div
                key={index}
                  initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} gap-10 lg:gap-16 items-center`}
                >
                  {/* Image */}
                  <div className="relative w-full lg:w-1/2 h-[260px] sm:h-[320px] lg:h-[360px] overflow-hidden rounded-3xl shadow-[0_0_30px_rgba(212,175,55,0.25),0_0_60px_rgba(212,175,55,0.15),0_0_90px_rgba(212,175,55,0.08)] hover:shadow-[0_0_40px_rgba(212,175,55,0.35),0_0_80px_rgba(212,175,55,0.2),0_0_120px_rgba(212,175,55,0.12)] transition-shadow duration-500">
                    <img
                      src={`${item.image}?auto=format&fit=crop&w=1600&q=80`}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-110"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/20 to-transparent"></div>
                    <div className="absolute top-6 left-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/40 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-primary" />
                          </div>
                      <span className="text-sm tracking-[0.3em] uppercase text-primary/80">
                        {`Philosophy ${index + 1}`}
                      </span>
                          </div>
                    </div>

                  {/* Content */}
                  <div className={`w-full lg:w-1/2 space-y-6 text-center ${isReversed ? "lg:text-right" : "lg:text-left"}`}>
                        <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                                {item.title}
                              </span>
                            </h3>
                      <div
                        className={`mt-4 h-[3px] w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto ${isReversed ? "lg:mr-0" : "lg:ml-0"}`}
                      ></div>
                          </div>

                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>

                    <div
                      className={`flex items-center gap-3 text-xs uppercase tracking-widest text-primary/70 justify-center ${
                        isReversed ? "lg:justify-end" : "lg:justify-start"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>
                        <span>Insight</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary/70 rounded-full inline-block"></span>
                        <span>Strategy</span>
                        </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary/40 rounded-full inline-block"></span>
                        <span>Discipline</span>
                      </div>
                    </div>
                        </div>
                  </motion.div>
                );
              })}
          </div>

          {/* Maestro Section - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-32 relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 border-2 border-primary/20 rounded-full"></div>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-24 border-2 border-primary/30 rounded-full"></div>
            
            <div className="relative glass-morphism-strong border-2 border-primary/30 rounded-3xl p-12 md:p-16 text-center neon-gold overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"></div>
              <div className="absolute inset-0 scanline-effect opacity-10"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center mb-8"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: 999999, ease: "easeInOut" }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
                    <Music className="relative w-20 h-20 text-primary" />
                  </div>
              </motion.div>

                {/* Main Title */}
                <h3 className="text-3xl md:text-5xl font-bold mb-6">
                  BE THE MAESTRO OF YOUR{' '}
                  <span className="text-gradient-gold">INVESTMENT ORCHESTRA</span>
                </h3>

                {/* Subtitle */}
                <div className="inline-block px-8 py-3 bg-primary/10 border-2 border-primary/30 rounded-full mb-8 neon-gold">
                  <p className="text-xl md:text-2xl font-bold text-primary tracking-wider">
                    MANAGE YOUR RISK SUCCESSFULLY
                  </p>
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                  Considering the presence of order in the sequence and order in the chaos, we provide the{' '}
                  <span className="text-primary font-semibold">right place</span>, the{' '}
                  <span className="text-primary font-semibold">right time</span>, and the{' '}
                  <span className="text-primary font-semibold">right decision</span> for investors to make.{' '}
                  We are aware of risks, profit as well as opportunities to earn, and risks of making a loss.{' '}
                  We deliver the investing, which we, <span className="text-gradient-gold text-glow-gold font-semibold inline-block pb-2">Mekness family</span>, 
                  approach as an art, to you, to all investors.
                </p>

                {/* Decorative bottom line */}
                <motion.div
                  className="w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-12"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
              </div>
          </div>
          </motion.div>
        </div>
      </div>

      {/* How To Be A Trader */}
      <div className="py-24 px-4">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              HOW TO BE A <span className="text-gradient-gold text-glow-gold">TRADER?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We invite you to meet Mekness investment world. You can follow the steps below to be an online investor with us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howToTrade.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Card className="p-8 glass-morphism-strong border-primary/20 card-hover-3d h-full text-center group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 neon-gold group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl font-bold text-primary text-glow-gold">{step.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <CheckCircle2 className="w-8 h-8 text-primary mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-muted-foreground mb-6">
              Let us give you information about investment education and products:
            </p>
                <Link href="/signup">
              <Button size="lg" className="neon-gold magnetic-hover text-lg px-10">
                START NOW <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
