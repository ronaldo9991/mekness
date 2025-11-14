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
import { Loader2, ShieldCheck, Lock, Cpu, ArrowLeft } from "lucide-react";
import AnimatedGrid from "./AnimatedGrid";
import ParticleField from "./ParticleField";

interface AuthCardProps {
  type: "signin" | "signup";
}

export default function AuthCard({ type }: AuthCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const featureHighlights: Array<{ icon: LucideIcon; title: string; description: string }> = [
    {
      icon: ShieldCheck,
      title: "Regulated & Secure",
      description: "Multi-layer authentication and bank-grade encryption safeguard every transaction.",
    },
    {
      icon: Lock,
      title: "Funds Protection",
      description: "Segregated client accounts and negative balance protection for your peace of mind.",
    },
    {
      icon: Cpu,
      title: "Smart Routing",
      description: "AI-assisted order execution delivers millisecond fills across global liquidity pools.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === "signup") {
        // Handle signup
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, fullName: name }),
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
              username: email.split('@')[0], // Use email prefix as username
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
    <div className="relative min-h-screen overflow-hidden bg-black">
      <AnimatedGrid variant="cyber" className="opacity-40" />
      <ParticleField count={80} className="opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-background/60 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_55%)]"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-16 sm:py-20 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid w-full max-w-5xl gap-10 lg:gap-12 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <Card className="relative overflow-hidden border border-primary/30 bg-black/70 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-[0_35px_120px_rgba(212,175,55,0.18)]">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent"></div>
              <div className="absolute -top-32 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-primary/20 blur-[120px] sm:h-72 sm:w-72"></div>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Link>
                <div className="hidden sm:block text-xs text-muted-foreground/70 uppercase tracking-[0.3em]">
                  Mekness Portal
                </div>
              </div>

              <div className="space-y-4 text-center">
                <Logo className="justify-center" />
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gradient-gold text-glow-gold">
                    {type === "signin" ? "Welcome Back" : "Create Account"}
                  </h1>
                  <p className="text-muted-foreground">
                    {type === "signin"
                      ? "Sign in to access your trading account"
                      : "Start your trading journey with Mekness"}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {type === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-muted-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      data-testid="input-name"
                      required
                      disabled={loading}
                      className="border-primary/20 bg-black/40 focus-visible:ring-primary"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                    required
                    disabled={loading}
                    className="border-primary/20 bg-black/40 focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-muted-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-password"
                    required
                    disabled={loading}
                    minLength={6}
                    className="border-primary/20 bg-black/40 focus-visible:ring-primary"
                  />
                  {type === "signup" && (
                    <p className="text-xs text-muted-foreground">
                      Minimum 6 characters for enhanced account security.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full neon-gold font-semibold"
                  data-testid="button-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {type === "signin" ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    type === "signin" ? "Sign In" : "Create Account"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                {type === "signin" ? (
                  <p>
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-semibold hover:underline">
                      Sign up
                    </Link>
                  </p>
                ) : (
                  <p>
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                )}
              </div>
            </div>
          </Card>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="glass-morphism border border-primary/20 p-6 sm:p-8 lg:p-10 rounded-3xl space-y-8 text-sm text-muted-foreground"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gradient-gold text-glow-gold mb-2">
                Premium Trading Experience
              </h2>
              <p>
                Trade with institutional-grade technology, ultra-low spreads, and dedicated expert support designed for high performance.
              </p>
            </div>

            <div className="space-y-5">
              {featureHighlights.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-xs leading-relaxed text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-xs text-muted-foreground/70">
              By continuing, you agree to our{" "}
              <Link href="/contact#privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              {" "}and{" "}
              <a
                href="https://mekness.com/terms-conditions"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                Terms & Conditions
              </a>
              .
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
