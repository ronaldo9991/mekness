import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import ParticleField from "@/components/ParticleField";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, TrendingUp, DollarSign, BarChart3, 
  Globe, Shield, Zap, ArrowRight, Activity, Target, 
  TrendingDown, Coins, Calendar,
  AlertTriangle, Percent, Layers, ArrowUpCircle,
  ArrowDownCircle, Minus, CircleDollarSign, Signal
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function ForexPedia() {
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { 
      name: "Trading Basics", 
      count: 45, 
      image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=600&q=80&auto=format&fit=crop" 
    },
    { 
      name: "Market Analysis", 
      count: 38, 
      image: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=600&q=80&auto=format&fit=crop" 
    },
    { 
      name: "Trading Strategies", 
      count: 52, 
      image: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=600&q=80&auto=format&fit=crop" 
    },
    { 
      name: "Risk Management", 
      count: 29, 
      image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600&q=80&auto=format&fit=crop" 
    },
    { 
      name: "Technical Indicators", 
      count: 67, 
      image: "https://images.unsplash.com/photo-1559526324-593bc073d938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
    },
    { 
      name: "Currency Pairs", 
      count: 34, 
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
    },
  ];

  const forexTerms = [
    {
      term: "Ask Price",
      definition: "The price at which the market is prepared to sell a specific currency pair. This is the price a trader pays when buying the base currency.",
      category: "Trading Basics",
      relatedTerms: ["Bid Price", "Spread", "Quote"],
      icon: ArrowUpCircle
    },
    {
      term: "Base Currency",
      definition: "The first currency quoted in a currency pair. For example, in EUR/USD, EUR is the base currency. The base currency is always equal to 1 unit.",
      category: "Currency Pairs",
      relatedTerms: ["Quote Currency", "Currency Pair", "Exchange Rate"],
      icon: Coins
    },
    {
      term: "Bear Market",
      definition: "A market characterized by declining prices over an extended period. Traders who anticipate falling prices are called 'bears' and often take short positions.",
      category: "Market Analysis",
      relatedTerms: ["Bull Market", "Market Trend", "Short Position"],
      icon: TrendingDown
    },
    {
      term: "Bid Price",
      definition: "The price at which the market is prepared to buy a specific currency pair. This is the price a trader receives when selling the base currency.",
      category: "Trading Basics",
      relatedTerms: ["Ask Price", "Spread", "Market Maker"],
      icon: ArrowDownCircle
    },
    {
      term: "Bull Market",
      definition: "A market characterized by rising prices over an extended period. Traders who anticipate rising prices are called 'bulls' and often take long positions.",
      category: "Market Analysis",
      relatedTerms: ["Bear Market", "Market Trend", "Long Position"],
      icon: TrendingUp
    },
    {
      term: "Candlestick Chart",
      definition: "A type of price chart that displays the high, low, opening, and closing prices of a currency pair over a specific time period using candlestick-shaped marks.",
      category: "Technical Indicators",
      relatedTerms: ["Bar Chart", "Line Chart", "Technical Analysis"],
      icon: BarChart3
    },
    {
      term: "Currency Pair",
      definition: "The quotation of two different currencies, where one is quoted against the other. The first currency is the base, the second is the quote currency.",
      category: "Currency Pairs",
      relatedTerms: ["Base Currency", "Quote Currency", "Exchange Rate"],
      icon: Globe
    },
    {
      term: "Day Trading",
      definition: "A trading strategy where positions are opened and closed within the same trading day to capitalize on short-term price movements.",
      category: "Trading Strategies",
      relatedTerms: ["Scalping", "Swing Trading", "Position Trading"],
      icon: Calendar
    },
    {
      term: "Leverage",
      definition: "The use of borrowed capital to increase potential returns. For example, 1:100 leverage means you can control $100,000 with just $1,000 of your own capital.",
      category: "Trading Basics",
      relatedTerms: ["Margin", "Margin Call", "Equity"],
      icon: Zap
    },
    {
      term: "Liquidity",
      definition: "The degree to which an asset can be quickly bought or sold without affecting its price. Forex is the most liquid financial market in the world.",
      category: "Market Analysis",
      relatedTerms: ["Market Depth", "Volume", "Slippage"],
      icon: Activity
    },
    {
      term: "Long Position",
      definition: "Buying a currency pair with the expectation that its value will increase. You profit if the base currency strengthens against the quote currency.",
      category: "Trading Basics",
      relatedTerms: ["Short Position", "Buy Order", "Bull Market"],
      icon: ArrowUpCircle
    },
    {
      term: "Lot",
      definition: "A standardized unit of measurement for a forex transaction. A standard lot equals 100,000 units of the base currency. Mini lots (10,000) and micro lots (1,000) are also available.",
      category: "Trading Basics",
      relatedTerms: ["Position Size", "Volume", "Contract Size"],
      icon: Layers
    },
    {
      term: "Margin",
      definition: "The amount of money required in your account to open and maintain a leveraged trading position. It's expressed as a percentage of the full position size.",
      category: "Risk Management",
      relatedTerms: ["Leverage", "Margin Call", "Free Margin"],
      icon: Percent
    },
    {
      term: "Margin Call",
      definition: "A notification from your broker that your account equity has fallen below the required margin level. You must deposit additional funds or close positions.",
      category: "Risk Management",
      relatedTerms: ["Margin", "Stop Out", "Account Equity"],
      icon: AlertTriangle
    },
    {
      term: "Pip",
      definition: "The smallest price increment in forex trading. For most currency pairs, a pip is 0.0001 (the fourth decimal place). For JPY pairs, it's 0.01.",
      category: "Trading Basics",
      relatedTerms: ["Pipette", "Spread", "Price Quote"],
      icon: Target
    },
    {
      term: "Quote Currency",
      definition: "The second currency in a currency pair. In EUR/USD, USD is the quote currency. It represents how much of the quote currency equals one unit of the base currency.",
      category: "Currency Pairs",
      relatedTerms: ["Base Currency", "Currency Pair", "Exchange Rate"],
      icon: DollarSign
    },
    {
      term: "Resistance Level",
      definition: "A price level at which selling is thought to be strong enough to prevent the price from rising further. It acts as a 'ceiling' for price movement.",
      category: "Technical Indicators",
      relatedTerms: ["Support Level", "Breakout", "Price Action"],
      icon: Minus
    },
    {
      term: "Short Position",
      definition: "Selling a currency pair with the expectation that its value will decrease. You profit if the base currency weakens against the quote currency.",
      category: "Trading Basics",
      relatedTerms: ["Long Position", "Sell Order", "Bear Market"],
      icon: ArrowDownCircle
    },
    {
      term: "Spread",
      definition: "The difference between the bid and ask price of a currency pair. It represents the cost of trading and is how most brokers make money on forex transactions.",
      category: "Trading Basics",
      relatedTerms: ["Bid Price", "Ask Price", "Commission"],
      icon: Minus
    },
    {
      term: "Stop Loss",
      definition: "An order placed to automatically close a position when the price reaches a specified unfavorable level, limiting potential losses on a trade.",
      category: "Risk Management",
      relatedTerms: ["Take Profit", "Risk Management", "Order Types"],
      icon: Shield
    },
    {
      term: "Support Level",
      definition: "A price level at which buying is thought to be strong enough to prevent the price from declining further. It acts as a 'floor' for price movement.",
      category: "Technical Indicators",
      relatedTerms: ["Resistance Level", "Breakout", "Price Action"],
      icon: Minus
    },
    {
      term: "Swap",
      definition: "The interest rate differential between the two currencies in a pair. When you hold a position overnight, you either pay or earn swap depending on the interest rates.",
      category: "Trading Basics",
      relatedTerms: ["Rollover", "Carry Trade", "Interest Rate"],
      icon: CircleDollarSign
    },
    {
      term: "Take Profit",
      definition: "An order placed to automatically close a position when the price reaches a specified favorable level, securing your profits on a trade.",
      category: "Risk Management",
      relatedTerms: ["Stop Loss", "Limit Order", "Exit Strategy"],
      icon: Target
    },
    {
      term: "Volatility",
      definition: "The degree of variation in the price of a currency pair over time. High volatility means large price swings; low volatility means stable prices.",
      category: "Market Analysis",
      relatedTerms: ["ATR", "Standard Deviation", "Market Conditions"],
      icon: Signal
    },
  ];

  const filteredTerms = forexTerms.filter(term => 
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero */}
      <div className="relative min-h-[70vh] flex items-center overflow-hidden pt-36 sm:pt-48 pb-20">
        <AnimatedGrid variant="hexagon" />
        <ParticleField count={80} className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80')] bg-cover bg-center opacity-10"></div>
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
                <span className="text-primary font-semibold">Your Complete Forex Knowledge Base</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-12 leading-tight">
              <span className="text-gradient-animated text-glow-gold inline-block pb-2">ForexPedia</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              Master forex trading with our comprehensive encyclopedia of trading terms, strategies, and concepts. From basics to advanced techniques.
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search forex terms, strategies, concepts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 h-14 text-lg glass-morphism-strong border-primary/30"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Browse by <span className="text-gradient-gold text-glow-gold inline-block pb-1">Category</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore forex topics organized by subject
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.03, y: -6 }}
                  transition={{ duration: 0.5 }}
                  className="group relative h-52 lg:h-56 rounded-3xl overflow-hidden cursor-pointer border border-primary/20 bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500"
                >
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-black/70 group-hover:from-black/70 group-hover:to-primary/20 transition-all duration-500"></div>
                  <div className="absolute inset-0">
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-semibold text-white mb-1 drop-shadow-lg">
                            {category.name}
                          </div>
                          <div className="text-sm text-white/70">{category.count} terms</div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary transition-transform duration-300 group-hover:translate-x-2">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent"></div>
                  </div>
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 border border-white/5 rounded-3xl shadow-[inset_0_0_30px_rgba(255,255,255,0.05)]"></div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Terms List */}
      <div className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Forex <span className="text-gradient-gold text-glow-gold inline-block pb-1">Dictionary</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              {searchTerm ? `${filteredTerms.length} results found` : `${forexTerms.length} essential forex terms`}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-center">
            {filteredTerms.map((item, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.02, 0.3) }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="glass-morphism-strong border border-primary/20 rounded-2xl p-5 group cursor-pointer hover:border-primary/50 transition-all duration-300 w-full shadow-[0_0_30px_rgba(212,175,55,0.35),0_0_60px_rgba(212,175,55,0.2),0_0_90px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45),0_0_80px_rgba(212,175,55,0.25),0_0_120px_rgba(212,175,55,0.15)] transition-shadow duration-500"
              >
                <summary className="flex items-start gap-4 text-left font-semibold hover:text-primary transition-colors list-none">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="text-lg text-gradient-gold text-glow-gold mb-2 font-bold inline-block pb-1">{item.term}</div>
                    <span className="text-[10px] text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-primary text-sm group-open:rotate-180 transition-transform flex-shrink-0 mt-2">▼</span>
                </summary>
                <div className="mt-4 pt-4 border-t border-primary/10 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.definition}
                  </p>
                  {item.relatedTerms.length > 0 && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-2 font-semibold flex items-center gap-2">
                        <div className="w-4 h-0.5 bg-primary/30"></div>
                        Related Terms
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.relatedTerms.map((related, idx) => (
                          <span key={idx} className="text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors">
                            {related}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.details>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <Card className="p-12 glass-morphism-strong border-primary/20 text-center">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords or browse categories above
              </p>
            </Card>
          )}
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
                  Ready to Apply Your <span className="text-gradient-gold text-glow-gold inline-block pb-1">Knowledge</span>?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Start trading with confidence using professional tools and resources from Mekness.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="neon-gold magnetic-hover shadow-[0_6px_20px_0_rgba(212,175,55,0.42)]">
                      Open Live Account
                    </Button>
                  </Link>
                  <Link href="/what-is-forex">
                    <Button variant="outline" size="lg">
                      Learn More
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

