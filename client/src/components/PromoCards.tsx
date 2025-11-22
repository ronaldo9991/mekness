import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, DollarSign, FileText } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function PromoCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100; // 100px offset for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const cards = [
    {
      icon: TrendingUp,
      title: "ACCOUNT TYPES",
      description: "We offer Mini, Standard, Pro and VIP Trader account types to meet your individual investment needs.",
      cta: "DETAILS",
      scrollTo: "account-types",
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
    {
      icon: DollarSign,
      title: "COMPETITIVE SPREADS",
      description: "Reduce your trading costs and take advantage of tight spreads Mekness offers.",
      cta: "DETAILS",
      scrollTo: "compare-spreads",
      gradient: "from-primary/15 via-primary/5 to-transparent",
    },
    {
      icon: FileText,
      title: "OPEN LIVE ACCOUNT",
      description: "All you need is to fill the form on the side and start trading with us.",
      cta: "SIGNUP NOW",
      link: "/signup",
      gradient: "from-primary/20 via-primary/10 to-transparent",
    },
  ];

  return (
    <div className="py-12 md:py-20 px-4">
      <div className="container mx-auto">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Card className="group overflow-hidden border-primary/20 hover:border-primary/60 transition-all duration-500 card-hover-3d h-full">
                {/* Image Section with Diagonal Cut */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  {/* Background with gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}>
                    {/* Animated grid pattern */}
                    <div className="absolute inset-0 web3-grid-bg opacity-20"></div>
                    
                    {/* Hexagon pattern overlay */}
                    <div className="absolute inset-0 hexagon-pattern opacity-10"></div>
                    
                    {/* Icon with glow effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        className="relative"
                        initial={false}
                        animate={
                          hoveredIndex === index
                            ? {
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }
                            : {
                                scale: 1,
                                rotate: 0,
                              }
                        }
                        transition={{
                          duration: 4,
                          repeat: hoveredIndex === index ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center neon-gold">
                          <card.icon className="w-16 h-16 text-primary" />
                        </div>
                        
                        {/* Decorative elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/30 rounded-lg transform rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
                        <div className="absolute -bottom-4 -left-4 text-6xl font-bold text-primary/20">$</div>
                      </motion.div>
                    </div>

                    {/* Floating particles - Static by default */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/40 rounded-full"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + i * 20}%`,
                        }}
                        initial={false}
                        animate={
                          hoveredIndex === index
                            ? {
                                y: [0, -20, 0],
                                opacity: [0.3, 0.8, 0.3],
                              }
                            : {
                                y: 0,
                                opacity: 0.3,
                              }
                        }
                        transition={{
                          duration: 3 + i,
                          repeat: hoveredIndex === index ? Infinity : 0,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                  </div>

                  {/* Diagonal cut overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent"></div>
                  
                  {/* Diagonal SVG cut */}
                  <svg 
                    className="absolute bottom-0 left-0 w-full" 
                    viewBox="0 0 1200 60" 
                    preserveAspectRatio="none"
                    style={{ height: '60px' }}
                  >
                    <path 
                      d="M0,60 L0,20 L1200,60 Z" 
                      fill="hsl(var(--card))"
                    />
                  </svg>
                </div>

                {/* Content Section */}
                <div className="p-6 bg-card relative">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {card.description}
                  </p>
                  {card.scrollTo ? (
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto font-semibold group/btn"
                      onClick={() => scrollToSection(card.scrollTo!)}
                    >
                      {card.cta}
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Link href={card.link!}>
                      <Button 
                        variant="ghost" 
                        className="text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto font-semibold group/btn"
                      >
                        {card.cta}
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

