import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import logoMobile from "@/assets/logo-matrix-style-mobile.webp";
import logoTablet from "@/assets/logo-matrix-style-tablet.webp";
import logoDesktop from "@/assets/logo-matrix-style-desktop.webp";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const pendingScrollRef = useRef<string | null>(null);

  // Handle pending scroll after navigation to home page
  useEffect(() => {
    if (location === "/" && pendingScrollRef.current) {
      const targetId = pendingScrollRef.current;
      pendingScrollRef.current = null;

      // Wait for page to render, then scroll
      const timeoutId = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const nav = document.querySelector('nav');
          const navHeight = nav?.getBoundingClientRect().height ?? 80;
          const offsetTop = element.offsetTop - navHeight - 20;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth"
          });
        }
      }, 150);

      return () => clearTimeout(timeoutId);
    }
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);

    if (location !== "/") {
      // Store the target and navigate to home
      pendingScrollRef.current = sectionId;
      setLocation("/");
      return;
    }

    // Already on home page, scroll immediately
    const element = document.getElementById(sectionId);
    if (element) {
      const nav = document.querySelector('nav');
      const navHeight = nav?.getBoundingClientRect().height ?? 80;
      const offsetTop = element.offsetTop - navHeight - 20;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(218,11%,15%)]/95 backdrop-blur-sm border-b border-[hsl(220,9%,46%)]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28">
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <picture>
              <source media="(min-width: 1024px)" srcSet={logoDesktop} />
              <source media="(min-width: 640px)" srcSet={logoTablet} />
              <img
                src={logoMobile}
                alt="Six1Five Studio - Reality Capture Specialists"
                className="h-16 sm:h-18 md:h-20 max-h-20 w-auto transition-transform hover:scale-105 rounded-lg shadow-lg"
                style={{
                  filter: 'brightness(1.15) drop-shadow(0 0 6px var(--logo-blue))'
                }}
                loading="eager"
              />
            </picture>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className={`relative hover:text-[var(--primary-blue)] transition-colors ${location === "/" ? "text-[var(--primary-blue)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--primary-blue)] after:rounded-full" : ""}`}
              aria-label="Navigate to home section"
            >
              Home
            </button>
            <Link href="/gallery" className={`relative hover:text-[var(--primary-blue)] transition-colors ${location === "/gallery" ? "text-[var(--primary-blue)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--primary-blue)] after:rounded-full" : ""}`}>
              Portfolio
            </Link>
            <button
              onClick={() => scrollToSection("services")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
              aria-label="Navigate to services section"
            >
              Services
            </button>
            <Link href="/pricing" className={`relative hover:text-[var(--primary-blue)] transition-colors ${location === "/pricing" ? "text-[var(--primary-blue)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--primary-blue)] after:rounded-full" : ""}`}>
              Pricing
            </Link>
            <Link href="/resources" className={`relative hover:text-[hsl(158,64%,52%)] transition-colors ${location === "/resources" ? "text-[hsl(158,64%,52%)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[hsl(158,64%,52%)] after:rounded-full" : ""}`}>
              Resources
            </Link>
            <Link href="/insights" className={`relative hover:text-[hsl(199,89%,48%)] transition-colors ${location === "/insights" || location.startsWith("/blog") ? "text-[hsl(199,89%,48%)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[hsl(199,89%,48%)] after:rounded-full" : ""}`}>
              Insights
            </Link>
            <Link href="/faq" className={`relative hover:text-[hsl(24,95%,53%)] transition-colors ${location === "/faq" ? "text-[hsl(24,95%,53%)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[hsl(24,95%,53%)] after:rounded-full" : ""}`}>
              FAQ
            </Link>
            <button
              onClick={() => scrollToSection("contact")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
              aria-label="Navigate to contact section"
            >
              Contact
            </button>
            <div className="pr-3">
              <ThemeToggle />
            </div>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-4 py-2 rounded-lg transition-colors"
              aria-label="Book a scan - navigate to contact form"
            >
              Book a Scan
            </Button>
          </div>
          
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[hsl(220,9%,46%)]/20">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("home")}
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                aria-label="Navigate to home section"
              >
                Home
              </button>
              <Link
                href="/gallery"
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Portfolio
              </Link>
              <button
                onClick={() => scrollToSection("services")}
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                aria-label="Navigate to services section"
              >
                Services
              </button>
              <Link
                href="/pricing"
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/resources"
                className="text-left hover:text-[hsl(158,64%,52%)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </Link>
              <Link
                href="/insights"
                className="text-left hover:text-[hsl(199,89%,48%)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Insights
              </Link>
              <Link
                href="/faq"
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                aria-label="Navigate to contact section"
              >
                Contact
              </button>
              <div className="flex items-center gap-3 pt-3">
                <span className="text-sm text-gray-400">Theme:</span>
                <ThemeToggle />
              </div>
              <button
                onClick={() => scrollToSection("contact")}
                className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-4 py-2 rounded-lg transition-colors w-full text-center mt-4"
                aria-label="Book a scan - navigate to contact form"
              >
                Book a Scan
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
