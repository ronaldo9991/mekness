import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import ParticleField from "@/components/ParticleField";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Globe, 
  Zap, 
  Clock, 
  DollarSign, 
  LineChart,
  ShieldCheck,
  Wallet,
  Target,
  ArrowUpDown,
  Sparkles,
  Gift,
  Download,
  CreditCard,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Forex() {
  const learnForexSteps = [
    {
      number: 1,
      icon: Globe,
      title: "What is Forex?",
      description: "The meaning of term 'Forex' is an abbreviation of Foreign and Exchange in which it leads to describe a contract that both an investor buys or sells. The contract refers a specific currency depreciation or an appreciation over another currency. It is the biggest and most attendant financial market in the world.",
    },
    {
      number: 2,
      icon: Zap,
      title: "Forex is a Leveraged Market",
      description: "In Forex markets your investment is 10 to 100 times valuable due to your margin agreement with us. With little investments you can access through bigger volumes. In Forex Markets you can use leverage to give many times bigger market orders of your initial investment.",
    },
    {
      number: 3,
      icon: Clock,
      title: "5 Days 24 Hours Open Market",
      description: "The sun never goes down in forex markets. You can trade without timing limitations, endless and uninterrupted orders can be executed in 24 hours a day and 5 days a week. You can grow your initial investment whenever you like.",
    },
    {
      number: 4,
      icon: ArrowUpDown,
      title: "You Can Trade Both Sides",
      description: "Forex markets allows you to execute both buy and sell orders on a specific contract. You can buy while a contract price is increasing, also sell in decreasing situations. You have the chance to trade ups and downs and turn crisis into your favor.",
    },
    {
      number: 5,
      icon: LineChart,
      title: "100+ Products to Trade",
      description: "Do not restrict your trading with exchanges only. You can choose a wide variety of products from our system to trade that suits you well.",
    },
    {
      number: 6,
      icon: Target,
      title: "Forex is Appropriate for Everyone",
      description: "Forex is suitable for every age and profession. You might had an experience in an exchange office. Consider Forex market as a huge exchange office with a lot of participant worldwide.",
    },
    {
      number: 7,
      icon: Wallet,
      title: "You Can Start with Little Investment",
      description: "You can start without a minimum investment limit. Enables you to invest many times of your deposit agreed with the help of the leverage. This enables all types of investor to invest in Forex markets.",
    },
    {
      number: 8,
      icon: Sparkles,
      title: "You Can Trade Wherever and Whenever You Like",
      description: "Forex is an OTC market and connected to the globe itself by electronic communications for 5 days 24 hours. Enables you to trade day and night without any interruption in your daily routine.",
    },
  ];

  const advantages = [
    {
      icon: Clock,
      title: "5/24 Online Trading",
      description: "You can trade all day long within the market. Create opportunities day and night.",
    },
    {
      icon: Globe,
      title: "Biggest Financial Market in the World",
      description: "Daily trading volume is 5.5 Trillion dollars with participants all over the world.",
    },
    {
      icon: LineChart,
      title: "100+ Investment Products",
      description: "Forex Markets allowed the investor to invest in more than a hundred products.",
    },
    {
      icon: Zap,
      title: "1:100 Leverage",
      description: "Use that leverage and have the ability to invest 100 times your initial deposit.",
    },
    {
      icon: ArrowUpDown,
      title: "Buy or Sell",
      description: "Follow bullish or bearish markets by buying or selling the contract.",
    },
    {
      icon: ShieldCheck,
      title: "Regulated Market",
      description: "Regulations by different authorities keep investor deposits safe and secure.",
    },
  ];

  return (
    <div className="min-h-screen">
      <PublicHeader />
      
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center overflow-hidden pt-40 pb-20">
        <AnimatedGrid variant="cyber" />
        <ParticleField count={25} className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/5"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-10"
            >
              <div className="px-6 py-2 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm neon-gold">
                <span className="text-primary font-semibold">One Step Ahead in Forex</span>
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-12 leading-tight flex flex-col items-center gap-4">
              <span>Trade in the</span>
              <span className="text-gradient-gold text-glow-gold inline-block pb-2">World's Largest</span>
              <span>Market</span>
            </h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Forex, also known as foreign exchange, FX or currency trading, is a decentralized global market 
              where all the world's currencies are trading.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/signup">
                <Button size="lg" className="neon-gold magnetic-hover text-lg px-10">
                  OPEN LIVE ACCOUNT <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="w-px h-12 bg-primary/30"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5.5T</div>
                  <div className="text-sm text-muted-foreground">Daily Volume</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Learn Forex in 8 Easy Steps */}
      <div className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Learn Forex in <span className="text-gradient-gold text-glow-gold inline-block pb-1">8 Easy Steps</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              Master the fundamentals of forex trading with our comprehensive guide
            </p>
          </motion.div>

          {/* Steps - Card Timeline Layout */}
          <div className="relative max-w-6xl mx-auto">
            {/* Vertical guide line */}
            <div className="hidden md:block absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>

            <div className="space-y-16">
              {learnForexSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="pl-12 md:pl-32">
                    {/* Icon Node */}
                    <motion.div
                      className="absolute left-0 md:left-6 top-6 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-140"></div>
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-120"></div>
                        <div className="relative w-16 h-16 bg-gradient-to-br from-primary/40 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/40 backdrop-blur-sm shadow-2xl">
                          <step.icon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background text-primary-foreground font-bold text-sm shadow-lg">
                          {step.number}
                        </div>
                        <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                      </div>
                    </motion.div>

                    {/* Card */}
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="glass-morphism-strong border border-primary/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500 relative"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wide text-gradient-gold text-glow-gold inline-block pb-1">
                          {step.title}
                        </h3>
                        <div className="hidden md:flex items-center gap-2 text-primary font-semibold text-sm">
                          <span className="uppercase tracking-wider">Step</span>
                          <span className="text-xl">{step.number}</span>
                        </div>
                      </div>
                      <div className="h-0.5 w-20 bg-gradient-to-r from-primary to-transparent mb-4"></div>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                      <div className="flex items-center gap-2 pt-4">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <div className="w-4 h-0.5 bg-primary/40 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-primary/60 rounded-full"></div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Connector between cards */}
                  {index < learnForexSteps.length - 1 && (
                    <motion.div
                      className="hidden md:flex flex-col items-center absolute left-6 top-full"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-primary/20"></div>
                      <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                      <div className="w-px h-12 bg-gradient-to-b from-primary/20 to-transparent"></div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="py-16 md:py-24 px-4 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 web3-grid-bg opacity-5"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The <span className="text-gradient-gold text-glow-gold inline-block pb-1">Advantages</span> That Forex Markets Give
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Turn the advantages of the world's most liquid market in your favor
            </p>
          </motion.div>

          {/* Advantages Grid - Timeline Style */}
          <div className="relative max-w-5xl mx-auto">
            {/* Horizontal connecting line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {advantages.map((advantage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  className="relative text-center"
                >
                  {/* Connection point */}
                  <div className="hidden md:block absolute top-20 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background z-10">
                    <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                  </div>

                  {/* Vertical line from connection to icon */}
                  <div className="hidden md:block absolute top-24 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-primary/50 to-transparent"></div>

                  {/* Content */}
                  <div className="pt-28 md:pt-36 lg:pt-40">
                    {/* Icon */}
                    <motion.div
                      className="relative inline-flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/40 backdrop-blur-sm">
                        <advantage.icon className="w-12 h-12 text-primary" />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {advantage.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>

                    {/* Decorative line */}
                    <motion.div
                      className="w-16 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-4"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Mekness for Forex */}
      <div className="py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Benefits of Forex in <span className="text-gradient-gold text-glow-gold inline-block pb-1">Mekness</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We prioritise our investors' needs and support them with superior technology and advantages
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {[ 
                {
                  icon: ShieldCheck,
                  title: "Benefit 01",
                  heading: "Forex Market is Regulated",
                  description: "By regulators around the world, the OTC Forex market is regulated and is protecting the investors. With the help of different regulations in different countries, Mekness leads you towards the path to invest.",
                },
                {
                  icon: DollarSign,
                  title: "Benefit 02",
                  heading: "Commission Free Trading",
                  description: "The only cost of a trade to an investor is the difference between bid and offer. You can gain profit by the difference between the prices of your opened and closed positions.",
                },
                {
                  icon: Wallet,
                  title: "Benefit 03",
                  heading: "Wallet Friendly Investment",
                  description: "To enhance your trading skills before investing more, you can start with minimum deposits. It is suitable for everyone.",
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.15, ease: [0.34, 1.56, 0.64, 1] }}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className="glass-morphism-strong border border-primary/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-all duration-500 h-full flex flex-col"
                >
                  <motion.div
                    className="relative inline-flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 280 }}
                  >
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/40 backdrop-blur-sm">
                      <benefit.icon className="w-10 h-10 text-primary" />
                    </div>
                  </motion.div>

                  <div className="text-sm uppercase tracking-[0.3em] text-primary mb-2 text-center">
                    {benefit.title}
                  </div>
                  <h3 className="text-xl font-bold text-gradient-gold text-glow-gold text-center mb-4 inline-block pb-1">
                    {benefit.heading}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center flex-1">
                    {benefit.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 mt-6 text-primary/70">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">Trusted by Mekness</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Deposits & Bonuses Section */}
      <div className="py-16 md:py-24 px-4 bg-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 web3-grid-bg opacity-5"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Deposits, Withdrawals & <span className="text-gradient-gold text-glow-gold inline-block pb-1">Bonuses</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Easy funding options and exclusive bonus programs
            </p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3 max-w-5xl mx-auto">
            {/* Deposits & Withdrawals */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                className="relative inline-flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[16px] scale-150"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/40 backdrop-blur-[8px]">
                  <CreditCard className="w-12 h-12 text-primary" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-gradient-gold text-glow-gold inline-block pb-1">Deposits & Withdrawals</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Fast, secure, and hassle-free transactions with multiple payment methods
              </p>
            </motion.div>

            {/* Deposit Bonus */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-center"
            >
              <motion.div
                className="relative inline-flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[16px] scale-150"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/40 backdrop-blur-[8px]">
                  <Gift className="w-12 h-12 text-primary" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-gradient-gold text-glow-gold inline-block pb-1">Deposit Bonus</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Boost your trading capital with our exclusive deposit bonus programs
              </p>
            </motion.div>

            {/* Downloads */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <motion.div
                className="relative inline-flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[16px] scale-150"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center border-2 border-primary/40 backdrop-blur-[8px]">
                  <Download className="w-12 h-12 text-primary" />
                </div>
              </motion.div>
              <h3 className="text-xl font-bold mb-3 text-gradient-gold text-glow-gold inline-block pb-1">Downloads</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Access trading platforms, tools, and educational resources
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="glass-morphism-strong border-2 border-primary/30 rounded-3xl p-12 md:p-16 neon-gold max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Start <span className="text-gradient-gold text-glow-gold inline-block pb-1">Trading Forex?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of traders who trust Mekness for their forex trading needs. 
                Open your account today and experience the difference.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="neon-gold magnetic-hover text-lg px-10">
                    OPEN LIVE ACCOUNT <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="neon-border-animate text-lg px-10">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

