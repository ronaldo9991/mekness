import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import ParticleField from "@/components/ParticleField";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, Globe, TrendingUp, Zap, DollarSign, Shield,
  BarChart3, Users, Smartphone, Check, ArrowRight, Lock
} from "lucide-react";
import { Link } from "wouter";
import { memo, useMemo } from "react";

function ForexAdvantages() {
  // Optimized image URLs - reduced size from 800px to 600px max for better performance
  const advantages = useMemo(() => [
    {
      icon: Clock,
      title: "24/7 Online Trading",
      description: "Trade all day long within the market. Create opportunities day and night with round-the-clock market access.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Trade during any session: Asian, European, American",
        "No waiting for market opening",
        "Flexibility for any schedule",
        "React to global news instantly"
      ]
    },
    {
      icon: Globe,
      title: "Biggest Financial Market in the World",
      description: "Daily trading volume is $5.5 Trillion with participants all over the world. Unmatched liquidity and opportunities.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Highest liquidity of any market",
        "Tight spreads due to competition",
        "Easy entry and exit from positions",
        "Global market with millions of traders"
      ]
    },
    {
      icon: BarChart3,
      title: "100+ Investment Products",
      description: "Forex markets allow investors to trade more than a hundred currency pairs, from majors to exotics.",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Major pairs (EUR/USD, GBP/USD, etc.)",
        "Minor pairs and crosses",
        "Exotic currency pairs",
        "Diversification opportunities"
      ]
    },
    {
      icon: TrendingUp,
      title: "1:100 Leverage",
      description: "Use leverage to invest 100 times your initial deposit. Amplify your trading power with controlled risk.",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Control large positions with small capital",
        "Flexible leverage options",
        "Margin-based trading",
        "Leverage up to 1:100"
      ]
    },
    {
      icon: TrendingUp,
      title: "Buy or Sell - Trade Both Directions",
      description: "Follow bullish or bearish markets by buying or selling contracts. Profit in any market condition.",
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Profit from rising markets (Long)",
        "Profit from falling markets (Short)",
        "No restrictions on short selling",
        "Hedge your positions"
      ]
    },
    {
      icon: Zap,
      title: "Online Fast and Easy Access",
      description: "Trade wherever, whenever. Just need an internet connection. Access markets from any device, anywhere in the world.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Web-based trading platforms",
        "Mobile apps for iOS & Android",
        "Desktop applications",
        "No geographic restrictions"
      ]
    },
    {
      icon: DollarSign,
      title: "Commission-Free Trading",
      description: "The only cost of a trade is the difference between bid and offer (spread). No hidden fees or commissions.",
      image: "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "No trading commissions",
        "Transparent spread pricing",
        "No deposit/withdrawal fees",
        "Lower costs = higher profits"
      ]
    },
    {
      icon: Smartphone,
      title: "One-Click Trading",
      description: "Easy access and instant execution with just one click. Execute trades in milliseconds.",
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Instant order execution",
        "One-click buy/sell buttons",
        "Quick order modifications",
        "Real-time price updates"
      ]
    },
    {
      icon: Shield,
      title: "Regulated by Authorities Worldwide",
      description: "Regulations by different authorities keep investor deposits safe and secure. Trade with confidence.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=75&auto=format&fit=crop",
      benefits: [
        "Segregated client funds",
        "Regulatory oversight",
        "Investor protection schemes",
        "Transparent operations"
      ]
    },
  ], []);

  const meknessAdvantages = useMemo(() => [
    {
      icon: BarChart3,
      title: "Competitive Spreads",
      description: "Reduce your trading costs with industry-leading tight spreads starting from 0.1 pips."
    },
    {
      icon: Zap,
      title: "Ultra-Fast Execution",
      description: "Average execution time under 0.03 seconds. No requotes, no delays."
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "24/7 multilingual customer support from trading experts."
    },
    {
      icon: Lock,
      title: "Advanced Security",
      description: "SSL encryption, 2FA, and segregated accounts for your protection."
    },
    {
      icon: Smartphone,
      title: "Professional Platforms",
      description: "MetaTrader 5, WebTrader, and mobile apps with advanced tools."
    },
    {
      icon: DollarSign,
      title: "No Hidden Fees",
      description: "Transparent pricing with no commissions on standard accounts."
    },
  ], []);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden pt-40 sm:pt-52 pb-20">
        <AnimatedGrid variant="hexagon" />
        <ParticleField count={25} className="opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=75&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mt-8"
          >
            <div className="inline-block mb-10">
              <div className="px-6 py-2.5 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm neon-gold">
                <span className="text-primary font-semibold">Turn Market Advantages in Your Favor</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-12 leading-tight">
              Advantages of Trading <span className="block mt-6 text-gradient-animated text-glow-gold inline-block pb-2">Forex</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              Discover why forex is the world's most liquid market and how you can leverage its unique advantages for trading success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="neon-gold magnetic-hover shadow-[0_6px_20px_0_rgba(212,175,55,0.42)]">
                  Start Trading <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/what-is-forex">
                <Button variant="outline" size="lg">
                  Learn About Forex
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Advantages */}
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
              The Advantages Forex Markets <span className="text-gradient-gold text-glow-gold inline-block pb-1">Give You</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Turn the advantages of the world's most liquid market in your favor
            </p>
          </motion.div>

          <div className="space-y-24">
            {advantages.map((advantage, index) => {
              // Alternate between different layouts for visual variety
              const layoutVariants = [
                'image-left-large', 'image-right-overlap', 'image-left-stacked', 
                'image-right-large', 'image-left-overlap', 'image-right-stacked'
              ];
              const variant = layoutVariants[index % layoutVariants.length];
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.05 }}
                  className="relative"
                >
                  {/* Image Left Large */}
                  {variant === 'image-left-large' && (
                    <div className="grid lg:grid-cols-5 gap-8 items-center">
                      <div className="lg:col-span-3 relative h-[450px] rounded-3xl overflow-hidden group shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500">
                        <img 
                          src={advantage.image}
                          alt={advantage.title}
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                          <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-[8px] flex items-center justify-center mb-4 border border-primary/30">
                            <advantage.icon className="w-10 h-10 text-primary" />
                          </div>
                        </div>
                      </div>
                      <Card className="lg:col-span-2 p-8 glass-morphism-strong border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500">
                        <h3 className="text-3xl font-bold mb-4 text-gradient-gold text-glow-gold inline-block pb-1">{advantage.title}</h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {advantage.description}
                        </p>
                        <ul className="space-y-3">
                          {advantage.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="text-muted-foreground text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
                  )}

                  {/* Image Right with Overlap */}
                  {variant === 'image-right-overlap' && (
                    <div className="relative lg:flex lg:items-center lg:gap-0">
                      <Card className="lg:w-[55%] p-10 glass-morphism-strong border-primary/20 relative z-10">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-6 animate-pulse-glow">
                          <advantage.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 text-gradient-gold text-glow-gold inline-block pb-1">{advantage.title}</h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {advantage.description}
                        </p>
                        <ul className="space-y-3">
                          {advantage.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-[50%] lg:-ml-12 mt-8 lg:mt-0 relative h-[400px] rounded-3xl overflow-hidden group shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500"
                      >
                        <img 
                          src={advantage.image}
                          alt={advantage.title}
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl"></div>
                      </motion.div>
                    </div>
                  )}

                  {/* Image Left with Card Stacked */}
                  {variant === 'image-left-stacked' && (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <div className="space-y-6">
                        <div className="relative h-[350px] rounded-3xl overflow-hidden group shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500">
                          <img 
                            src={advantage.image}
                            alt={advantage.title}
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"></div>
                          <div className="absolute inset-0 border border-primary/30 rounded-3xl"></div>
                        </div>
                        <Card className="p-6 glass-morphism border-primary/20">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <advantage.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gradient-gold text-glow-gold inline-block pb-1">{advantage.title}</h3>
                          </div>
                        </Card>
                      </div>
                      <Card className="p-8 glass-morphism-strong border-primary/20 lg:mt-8">
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {advantage.description}
                        </p>
                        <div className="space-y-4">
                          {advantage.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Image Right Large */}
                  {variant === 'image-right-large' && (
                    <div className="grid lg:grid-cols-5 gap-8 items-center">
                      <Card className="lg:col-span-2 p-8 glass-morphism-strong border-primary/20 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500">
                        <h3 className="text-3xl font-bold mb-4 text-gradient-gold text-glow-gold inline-block pb-1">{advantage.title}</h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {advantage.description}
                        </p>
                        <ul className="space-y-3">
                          {advantage.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-primary" />
                              </div>
                              <span className="text-muted-foreground text-sm">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                      <div className="lg:col-span-3 relative h-[450px] rounded-3xl overflow-hidden group shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500">
                        <img 
                          src={advantage.image}
                          alt={advantage.title}
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tl from-black/90 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-8 right-8">
                          <div className="w-20 h-20 rounded-2xl bg-primary/20 backdrop-blur-[8px] flex items-center justify-center border border-primary/30">
                            <advantage.icon className="w-10 h-10 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Left with Overlap */}
                  {variant === 'image-left-overlap' && (
                    <div className="relative lg:flex lg:flex-row-reverse lg:items-center lg:gap-0">
                      <Card className="lg:w-[55%] p-10 glass-morphism-strong border-primary/20 relative z-10">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-6 animate-pulse-glow">
                          <advantage.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-3xl font-bold mb-4 text-gradient-gold text-glow-gold inline-block pb-1">{advantage.title}</h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {advantage.description}
                        </p>
                        <ul className="space-y-3">
                          {advantage.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </Card>
                      <motion.div 
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-[50%] lg:-mr-12 mt-8 lg:mt-0 relative h-[400px] rounded-3xl overflow-hidden group shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500"
                      >
                        <img 
                          src={advantage.image}
                          alt={advantage.title}
                          loading="lazy"
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute inset-0 border-2 border-primary/20 rounded-3xl"></div>
                      </motion.div>
                    </div>
                  )}

                  {/* Image Right Stacked */}
                  {variant === 'image-right-stacked' && (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      <Card className="p-8 glass-morphism-strong border-primary/20 lg:mt-8">
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {advantage.description}
                        </p>
                        <div className="space-y-4">
                          {advantage.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                              <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </Card>
                      <div className="space-y-6">
                        <div className="relative h-[350px] rounded-3xl overflow-hidden group shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-shadow duration-500">
                          <img 
                            src={advantage.image}
                            alt={advantage.title}
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80"></div>
                          <div className="absolute inset-0 border border-primary/30 rounded-3xl"></div>
                        </div>
                        <Card className="p-6 glass-morphism border-primary/20">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <advantage.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gradient-gold text-glow-gold inline-block pb-1">{advantage.title}</h3>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mekness Advantages */}
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
              The Advantages of Forex at <span className="text-gradient-gold text-glow-gold inline-block pb-1">Mekness</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We prioritize our investors' needs and support them with superior technology and advantages
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meknessAdvantages.map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 glass-morphism border-primary/20 card-hover-3d h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:animate-pulse-glow">
                    <advantage.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{advantage.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {advantage.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass-morphism-strong border-primary/20 p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/10"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Experience These <span className="text-gradient-gold text-glow-gold inline-block pb-1">Advantages</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of traders who are already benefiting from forex market advantages with Mekness.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="neon-gold magnetic-hover shadow-[0_6px_20px_0_rgba(212,175,55,0.42)]">
                      Open Live Account
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" size="lg">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Export with memo for performance optimization
export default memo(ForexAdvantages);

// Also export named for potential use in tests
export { ForexAdvantages };

