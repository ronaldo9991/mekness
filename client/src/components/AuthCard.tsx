import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";
import { Loader2, ShieldCheck, Lock, Cpu, ArrowLeft, Sparkles, CheckCircle2, TrendingUp, Globe, Award, Zap, Users } from "lucide-react";
import AnimatedGrid from "./AnimatedGrid";
import ParticleField from "./ParticleField";
import SearchableCountrySelect from "./SearchableCountrySelect";

interface AuthCardProps {
  type?: "signin" | "signup";
}

export default function AuthCard({ type = "signup" }: AuthCardProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(false);

  const featureHighlights: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: ShieldCheck,
      title: "Regulated & Secure",
      description: "Bank-grade encryption and multi-layer security",
    },
    {
      icon: Lock,
      title: "Funds Protection",
      description: "Segregated accounts with negative balance protection",
    },
    {
      icon: Cpu,
      title: "Smart Execution",
      description: "AI-powered routing for millisecond order fills",
    },
  ];

  const stats = [
    { icon: Users, label: "Active Traders", value: "100K+" },
    { icon: TrendingUp, label: "Avg. Execution", value: "<30ms" },
    { icon: Globe, label: "Countries", value: "150+" },
    { icon: Award, label: "Awards Won", value: "12+" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "signup") {
        if (!phone || !country || !city) {
          throw new Error("Phone number, country, and city are required");
        }

        // Get referral ID from URL query parameter or manual input
        const urlParams = new URLSearchParams(window.location.search);
        const urlRef = urlParams.get("ref");
        
        // Extract referral ID from manual input if provided (handle both full URL and just the ID)
        let manualRef = null;
        if (referralLink.trim()) {
          const refMatch = referralLink.match(/ref=([^&]+)/) || referralLink.match(/^([A-Z0-9]+)$/);
          if (refMatch) {
            manualRef = refMatch[1];
          }
        }

        const ref = urlRef || manualRef || undefined;

        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email, 
            password, 
            fullName: name,
            phone,
            country,
            city,
            ref: ref
          }),
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        toast({
          title: "Account Created!",
          description: "Your account has been created successfully.",
        });
        setLocation("/dashboard");
      } else {
        // Try admin login first
        let isAdmin = false;
        try {
          const adminResponse = await fetch("/api/admin/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              username: email.split('@')[0],
              password 
            }),
            credentials: "include",
          });

          if (adminResponse.ok) {
            isAdmin = true;
            toast({
              title: "Welcome Back, Admin!",
              description: "You've been signed in to the admin dashboard.",
            });
            setLocation("/admin/dashboard");
            return;
          }
        } catch {
          // Admin login failed, try user login
        }

        // Try user login if admin login failed
        const userResponse = await fetch("/api/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        });

        const userData = await userResponse.json();
        if (!userResponse.ok) {
          throw new Error(userData.message || "Invalid credentials");
        }

        toast({
          title: "Welcome Back!",
          description: "You've been signed in successfully.",
        });
        setLocation("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black flex items-center justify-center">
      <AnimatedGrid variant="cyber" className="opacity-[0.03]" />
      <ParticleField count={30} className="opacity-[0.08]" />
      
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Animated scan lines */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{
          y: [0, "100vh", 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className={`grid ${type === "signin" ? "lg:grid-cols-2" : "lg:grid-cols-[1.3fr_0.7fr]"} gap-6 items-center`}>
            {/* Main Form Card - Futuristic Design */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl shadow-2xl shadow-primary/10">
                {/* Futuristic border glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/40" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/40" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/40" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/40" />
                
                {/* Decorative Elements */}
                <div className="absolute top-6 right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />
                <div className="absolute bottom-6 left-6 w-20 h-20 bg-primary/5 rounded-full blur-xl" />

                <div className="relative z-10 p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-all duration-300 group"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                      Back to Home
                    </Link>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground/60">
                      <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                      <span className="uppercase tracking-wider text-[10px]">Mekness Portal</span>
                    </div>
                  </div>

                  {/* Logo & Title */}
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mb-3"
                    >
                      <Logo className="justify-center" size="sm" />
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h1 className="font-bold text-2xl sm:text-3xl mb-2">
                        <span className="bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
                          {type === "signin" ? "Welcome Back" : "Create Account"}
                        </span>
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        {type === "signin"
                          ? "Sign in to access your trading account"
                          : "Join thousands of traders worldwide"}
                      </p>
                    </motion.div>
                  </div>

                  {/* Form */}
                  <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    {type === "signup" && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <span>Full Name</span>
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="John Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              disabled={loading}
                              className="h-10 text-sm border-primary/30 bg-black/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <span>Phone</span>
                              <span className="text-primary">*</span>
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 234 567 8900"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              required
                              disabled={loading}
                              className="h-10 text-sm border-primary/30 bg-black/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label htmlFor="country" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <span>Country</span>
                              <span className="text-primary">*</span>
                            </Label>
                            <SearchableCountrySelect
                              id="country"
                              value={country}
                              onChange={setCountry}
                              placeholder="Search country..."
                              disabled={loading}
                              className="w-full h-10 border-primary/30 bg-black/50"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="city" className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <span>City</span>
                              <span className="text-primary">*</span>
                            </Label>
                            <Input
                              id="city"
                              type="text"
                              placeholder="New York"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                              disabled={loading}
                              className="h-10 text-sm border-primary/30 bg-black/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="referralLink" className="text-xs font-medium text-muted-foreground">
                            Referral Link <span className="text-muted-foreground/60 text-[10px]">(Optional)</span>
                          </Label>
                          <Input
                            id="referralLink"
                            type="text"
                            placeholder="Enter referral link or ID"
                            value={referralLink}
                            onChange={(e) => setReferralLink(e.target.value)}
                            disabled={loading}
                            className="h-10 text-sm border-primary/30 bg-black/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all"
                          />
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          className="text-sm border-primary/30 bg-black/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all h-10"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                          minLength={6}
                          className="text-sm border-primary/30 bg-black/50 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all h-10"
                        />
                      </div>
                    </div>

                    {type === "signup" && (
                      <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Minimum 6 characters required
                      </p>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary via-primary/95 to-primary hover:from-primary/90 hover:via-primary/85 hover:to-primary/90 text-black font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 disabled:opacity-50 h-11 mt-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {type === "signin" ? "Signing In..." : "Creating Account..."}
                        </>
                      ) : (
                        <>
                          {type === "signin" ? "Sign In" : "Create Account"}
                          <Sparkles className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.form>

                  {/* Footer Link */}
                  <div className="text-center pt-3 border-t border-primary/10 mt-4">
                    <p className="text-xs text-muted-foreground">
                      {type === "signin" ? (
                        <>
                          Don't have an account?{" "}
                          <Link href="/signup" className="text-primary font-semibold hover:underline transition-colors">
                            Sign up
                          </Link>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <Link href="/signin" className="text-primary font-semibold hover:underline transition-colors">
                            Sign in
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Features Panel - Futuristic Design */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative h-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl shadow-2xl shadow-primary/10">
                {/* Futuristic border glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-primary/40" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-primary/40" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-primary/40" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-primary/40" />
                
                {/* Decorative Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />
                
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="font-bold text-xl mb-2">
                        <span className="bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent">
                          Premium Trading
                        </span>
                      </h2>
                      <p className="text-muted-foreground leading-relaxed text-xs">
                        Institutional-grade technology with ultra-low spreads and expert support.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {featureHighlights.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="group"
                        >
                          <div className="flex items-start rounded-lg border border-primary/20 bg-black/30 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 gap-3 p-3">
                            <div className="flex shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/10 transition-all h-9 w-9">
                              <feature.icon className="text-primary h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground text-xs mb-1">{feature.title}</h3>
                              <p className="text-muted-foreground leading-relaxed text-[11px]">{feature.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Stats Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="border-t border-primary/20 pt-4"
                    >
                      <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px] mb-3">
                        Trusted Worldwide
                      </h3>
                      <div className="grid grid-cols-2 gap-2.5">
                        {stats.map((stat, index) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.05 }}
                            className="rounded-lg border border-primary/20 bg-black/30 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 p-2.5"
                          >
                            <div className="flex items-center mb-1 gap-1.5">
                              <stat.icon className="text-primary h-3.5 w-3.5" />
                              <span className="font-bold text-primary text-base">{stat.value}</span>
                            </div>
                            <p className="text-muted-foreground text-[10px]">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  <div className="border-t border-primary/20 pt-4">
                    <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
                      By continuing, you agree to our{" "}
                      <Link href="/contact#privacy-policy" className="text-primary hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      {" "}and{" "}
                      <a
                        href="https://mekness.com/terms-conditions"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        Terms & Conditions
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
