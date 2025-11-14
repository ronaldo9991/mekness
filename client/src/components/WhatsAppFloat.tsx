import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappNumber = "+971545510007"; // +971 54 551 0007
  const message = "Hi, I need help with Mekness Trading";

  useEffect(() => {
    // Show tooltip after 3 seconds on first load
    const timer = setTimeout(() => {
      setShowTooltip(true);
      // Hide tooltip after 5 seconds
      setTimeout(() => setShowTooltip(false), 5000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-full right-0 mb-2 w-64"
          >
            <div className="relative bg-gradient-to-br from-black to-primary/20 border border-primary/30 rounded-lg p-4 shadow-2xl backdrop-blur-xl">
              {/* Gold accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-t-lg" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-semibold text-primary">Need Help?</p>
                  <button
                    onClick={() => setShowTooltip(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Chat with us on WhatsApp for instant support!
                </p>
                <div className="text-xs text-primary font-mono">
                  {whatsappNumber}
                </div>
              </div>
              
              {/* Arrow */}
              <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-3 h-3 bg-gradient-to-br from-black to-primary/20 border-r border-b border-primary/30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="group relative w-16 h-16 bg-[#25D366] hover:bg-[#20BA5A] rounded-full shadow-2xl flex items-center justify-center transition-all duration-300"
      >
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#25D366] to-[#20BA5A] blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
        
        {/* Icon */}
        <MessageCircle className="relative z-10 w-8 h-8 text-white" fill="currentColor" />
        
        {/* Notification badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-[10px] font-bold text-white">1</span>
        </div>
      </motion.button>

      {/* Close button (appears on hover) */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileHover={{ opacity: 1, scale: 1 }}
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -left-2 w-6 h-6 bg-black border border-primary/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-3 h-3 text-primary" />
      </motion.button>
    </div>
  );
}

