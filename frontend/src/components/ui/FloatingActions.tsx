import { Phone, ArrowUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const FloatingActions = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-4 bottom-6 z-40 flex flex-col gap-3">
      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className={cn(
          "p-3 bg-primary text-primary-foreground rounded-full shadow-medium hover:shadow-luxury transition-all duration-500",
          showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <ArrowUp className="h-5 w-5" />
      </button>

      {/* Phone */}
      <a
        href="tel:+919876543210"
        className="p-3 bg-primary text-primary-foreground rounded-full shadow-medium hover:shadow-luxury hover:scale-110 transition-all duration-300 sm:hidden"
      >
        <Phone className="h-5 w-5" />
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="p-4 bg-[#25D366] text-white rounded-full shadow-medium hover:shadow-luxury hover:scale-110 transition-all duration-300 animate-pulse-gold flex items-center justify-center"
      >
        <FaWhatsapp className="h-6 w-6" />
      </a>
    </div>
  );
};
