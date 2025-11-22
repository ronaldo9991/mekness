import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function PublicHeader() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [forexDropdownOpen, setForexDropdownOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const forexLinks = [
    { label: "What is Forex", href: "/what-is-forex" },
    { label: "Advantages of Trading Forex", href: "/forex-advantages" },
    { label: "ForexPedia", href: "/forexpedia" },
    { label: "Deposits & Withdrawals", href: "/deposits-withdrawals" },
    { label: "Deposit Bonus", href: "/deposit-bonus" },
    { label: "No Deposit Bonus", href: "/no-deposit-bonus" },
    { label: "Trading Contest", href: "/trading-contest" },
    { label: "Introducing Broker", href: "/introducing-broker" },
  ];

  const isActive = (href: string) => location === href;
  const isForexActive =
    location === "/forex" ||
    forexLinks.some((link) => location.startsWith(link.href));

  const navLinkBase =
    "text-foreground hover:text-primary transition-all duration-300 font-medium text-[15px] relative group py-2";

  // Handle dropdown with delay to prevent accidental closes
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setForexDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow time to move to dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setForexDropdownOpen(false);
    }, 150); // 150ms delay
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full">
        <div 
          className="bg-black/70 backdrop-blur-[24px] backdrop-saturate-[200%]"
          style={{ 
            border: 'none',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <div className="container mx-auto max-w-7xl flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo size="lg" />
          </Link>

          {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-8">
                <Link
                  href="/"
                  className={cn(navLinkBase, isActive("/") && "text-primary")}
                  aria-current={isActive("/") ? "page" : undefined}
                >
                  Home
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300",
                      isActive("/") && "w-full"
                    )}
                  ></span>
                </Link>
                <Link
                  href="/about"
                  className={cn(navLinkBase, isActive("/about") && "text-primary")}
                  aria-current={isActive("/about") ? "page" : undefined}
                >
                  About
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300",
                      isActive("/about") && "w-full"
                    )}
                  ></span>
                </Link>
                
                {/* Forex Dropdown */}
                <div 
                  ref={dropdownRef}
                  className="relative group"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/forex"
                    className={cn(
                      navLinkBase,
                      "flex items-center gap-1",
                      isForexActive && "text-primary"
                    )}
                    aria-current={isForexActive ? "page" : undefined}
                  >
                    Forex
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        (forexDropdownOpen || isForexActive) && "rotate-180"
                      )}
                    />
                    <span
                      className={cn(
                        "absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300",
                        isForexActive && "w-full"
                      )}
                    ></span>
                  </Link>
                  
                  {/* Dropdown Menu */}
                  {forexDropdownOpen && (
                    <div 
                      className="absolute top-full left-0 mt-1 w-72 bg-black/70 backdrop-blur-[24px] backdrop-saturate-[200%] rounded-lg py-2 z-50"
                      style={{ border: 'none' }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {forexLinks.map((link, index) => (
                        <Link
                          key={index}
                          href={link.href}
                          className="block px-4 py-2.5 text-sm text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 relative group/item"
                        >
                          {link.label}
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 w-0 h-0.5 bg-primary group-hover/item:w-2 transition-all duration-200"></span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <Link
                  href="/contact"
                  className={cn(navLinkBase, isActive("/contact") && "text-primary")}
                  aria-current={isActive("/contact") ? "page" : undefined}
                >
                  Contact
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300",
                      isActive("/contact") && "w-full"
                    )}
                  ></span>
                </Link>
              </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <Link href="/signin">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-foreground hover:text-primary hover:bg-primary/10 h-9 px-5 text-[13px] font-medium" 
                data-testid="button-signin"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button 
                size="sm"
                className="neon-gold magnetic-hover h-9 px-5 text-[13px] font-semibold" 
                data-testid="button-signup"
              >
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5 text-primary" />
            )}
          </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 animate-in slide-in-from-top duration-300 border-0" style={{ border: 'none' }}>
              <nav className="flex flex-col gap-1">
                <Link 
                  href="/" 
                  className={cn(
                    "text-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium",
                    isActive("/") && "text-primary bg-primary/5"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive("/") ? "page" : undefined}
                >
                  Home
                </Link>
                <Link 
                  href="/about" 
                  className={cn(
                    "text-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium",
                    isActive("/about") && "text-primary bg-primary/5"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive("/about") ? "page" : undefined}
                >
                  About
                </Link>
                {/* Forex with submenu */}
                <div className="space-y-1">
                  <Link 
                    href="/forex" 
                    className={cn(
                      "text-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium block",
                      isForexActive && "text-primary bg-primary/5"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={isForexActive ? "page" : undefined}
                  >
                    Forex
                  </Link>
                  <div className="pl-4 space-y-1">
                    {forexLinks.map((link, index) => (
                      <Link 
                        key={index}
                        href={link.href}
                        className={cn(
                          "text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-2 rounded-lg text-sm block",
                          isActive(link.href) && "text-primary bg-primary/5"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={isActive(link.href) ? "page" : undefined}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link 
                  href="/contact" 
                  className={cn(
                    "text-foreground hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium",
                    isActive("/contact") && "text-primary bg-primary/5"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive("/contact") ? "page" : undefined}
                >
                  Contact
                </Link>
                
                {/* Mobile CTA Buttons */}
                <div className="flex flex-col gap-3 pt-6 mt-4">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full h-11 neon-border-animate"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      className="w-full h-11 neon-gold"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
