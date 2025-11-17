import PublicHeader from "@/components/PublicHeader";
import Footer from "@/components/Footer";
import AnimatedGrid from "@/components/AnimatedGrid";
import ParticleField from "@/components/ParticleField";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, Wallet, Building2, Smartphone, Shield, 
  Zap, Clock, Check, ArrowRight, DollarSign, Globe
} from "lucide-react";
import { Link } from "wouter";

export default function DepositsWithdrawals() {
  const paymentMethods = [
    {
      icon: CreditCard,
      name: "Credit/Debit Cards",
      description: "Visa, Mastercard, and major card networks",
      depositTime: "Instant",
      withdrawalTime: "3-5 business days",
      minDeposit: "$100",
      fees: "No fees",
      popular: true
    },
    {
      icon: Building2,
      name: "Bank Wire Transfer",
      description: "Direct bank transfers for large amounts",
      depositTime: "1-3 business days",
      withdrawalTime: "2-5 business days",
      minDeposit: "$500",
      fees: "Bank fees may apply",
      popular: false
    },
    {
      icon: Wallet,
      name: "E-Wallets",
      description: "Skrill, Neteller, and other e-payment solutions",
      depositTime: "Instant",
      withdrawalTime: "24 hours",
      minDeposit: "$50",
      fees: "No fees",
      popular: true
    },
    {
      icon: Smartphone,
      name: "Mobile Payments",
      description: "Apple Pay, Google Pay, and regional mobile solutions",
      depositTime: "Instant",
      withdrawalTime: "1-2 business days",
      minDeposit: "$100",
      fees: "No fees",
      popular: false
    },
    {
      icon: DollarSign,
      name: "Cryptocurrency",
      description: "Bitcoin, Ethereum, USDT, and major altcoins",
      depositTime: "15-30 minutes",
      withdrawalTime: "1-2 hours",
      minDeposit: "$100 equivalent",
      fees: "Network fees only",
      popular: true
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Most deposits are credited instantly to your trading account. Start trading within seconds."
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "SSL encryption, PCI DSS compliance, and segregated client funds for maximum protection."
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Deposit and withdraw anytime, any day. Our automated systems never sleep."
    },
    {
      icon: Globe,
      title: "Multi-Currency Support",
      description: "Account base currencies in USD, EUR, GBP, and 15+ other major currencies."
    },
  ];

  const depositSteps = [
    "Log into your Mekness client portal",
    "Navigate to 'Deposit Funds' section",
    "Select your preferred payment method",
    "Enter deposit amount and confirm",
    "Funds appear instantly in your account"
  ];

  const withdrawalSteps = [
    "Log into your client portal",
    "Go to 'Withdraw Funds' section",
    "Choose withdrawal method and amount",
    "Complete security verification",
    "Receive funds according to method timeframe"
  ];

  const faqs = [
    {
      question: "What is the minimum deposit amount?",
      answer: "Minimum deposit varies by payment method: $50 for e-wallets, $100 for cards and crypto, $500 for bank transfers. There's no maximum limit."
    },
    {
      question: "Are there any deposit or withdrawal fees?",
      answer: "Mekness does not charge any deposit or withdrawal fees. However, your payment provider (bank, e-wallet, crypto network) may apply their own fees."
    },
    {
      question: "How long do withdrawals take?",
      answer: "Withdrawal times depend on the method: E-wallets (24 hours), Cards (3-5 days), Bank transfers (2-5 days), Crypto (1-2 hours). All withdrawals are processed within 24 hours on our end."
    },
    {
      question: "Can I withdraw to a different method than I deposited?",
      answer: "For security and regulatory compliance, withdrawals must be processed to the same method/account used for deposit, up to the deposited amount. Profits can be withdrawn via any supported method."
    },
    {
      question: "Is my financial information secure?",
      answer: "Absolutely. We use 256-bit SSL encryption, comply with PCI DSS standards, and never store complete card details. All payment processing is handled by certified, tier-1 payment processors."
    },
    {
      question: "Do I need to verify my account before withdrawing?",
      answer: "Yes, account verification is required before your first withdrawal. This includes proof of identity (passport/ID) and proof of address (utility bill/bank statement). Verification typically takes 24-48 hours."
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      
      {/* Hero */}
      <div className="relative min-h-[65vh] flex items-center overflow-hidden pt-36 sm:pt-48 pb-20">
        <AnimatedGrid variant="cyber" />
        <ParticleField count={70} className="opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-background to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/10"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center mt-8"
          >
            <div className="inline-block mb-10">
              <div className="px-6 py-2.5 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm neon-gold">
                <span className="text-primary font-semibold">Fast, Secure, Transparent</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12">
              Deposits & <span className="block mt-6 text-gradient-animated text-glow-gold">Withdrawals</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              Fund your account instantly with multiple payment methods. Withdraw your profits quickly and securely with zero fees from Mekness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/deposit">
                <Button size="lg" className="neon-gold magnetic-hover shadow-[0_6px_20px_0_rgba(212,175,55,0.42)]">
                  Make a Deposit <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Support
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 glass-morphism border-primary/20 card-hover-3d h-full text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
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
              Payment <span className="text-gradient-gold">Methods</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from a wide range of secure payment options tailored to your preferences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {method.popular && (
                  <div className="absolute -top-3 right-4 z-10">
                    <div className="px-3 py-1 bg-primary rounded-full text-primary-foreground text-xs font-semibold">
                      POPULAR
                    </div>
                  </div>
                )}
                <Card className={`p-6 glass-morphism-strong border-primary/20 card-hover-3d h-full ${method.popular ? 'border-primary/40' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <method.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{method.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deposit Time:</span>
                      <span className="text-foreground font-medium">{method.depositTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Withdrawal Time:</span>
                      <span className="text-foreground font-medium">{method.withdrawalTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Min. Deposit:</span>
                      <span className="text-primary font-semibold">{method.minDeposit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fees:</span>
                      <span className="text-neon-green font-medium">{method.fees}</span>
                    </div>
                  </div>
                </Card>
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
              How It <span className="text-gradient-gold">Works</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Deposits */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 glass-morphism-strong border-primary/20 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-primary rotate-[-90deg]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gradient-gold">Making a Deposit</h3>
                </div>
                <ol className="space-y-4">
                  {depositSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-muted-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-8">
                  <Link href="/dashboard/deposit">
                    <Button size="lg" className="w-full neon-gold">
                      Deposit Now
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>

            {/* Withdrawals */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 glass-morphism-strong border-primary/20 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-primary rotate-[90deg]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gradient-gold">Making a Withdrawal</h3>
                </div>
                <ol className="space-y-4">
                  {withdrawalSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-muted-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-8">
                  <Link href="/dashboard/withdraw">
                    <Button size="lg" variant="outline" className="w-full">
                      Withdraw Funds
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Common <span className="text-gradient-gold">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-morphism-strong border border-primary/20 rounded-xl p-6 group"
              >
                <summary className="flex items-center justify-between cursor-pointer text-left font-semibold text-lg hover:text-primary transition-colors">
                  {faq.question}
                  <span className="text-primary ml-4 group-open:rotate-180 transition-transform flex-shrink-0">▼</span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

