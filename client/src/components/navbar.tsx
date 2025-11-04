import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/six1five-logo.png";
import logoHorizontal from "@/assets/logo-matrix-style.webp";
import logoMobile from "@/assets/logo-matrix-style-mobile.webp";
import logoTablet from "@/assets/logo-matrix-style-tablet.webp";
import logoDesktop from "@/assets/logo-matrix-style-desktop.webp";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check admin auth status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      setIsAdminAuthenticated(!!token);
    };
    
    checkAuth();
    // Check on storage changes (e.g., login/logout in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      // Navigate to home first, then scroll
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate offset dynamically based on actual navbar height
      const nav = document.querySelector('nav');
      const navHeight = nav?.getBoundingClientRect().height ?? 80;
      const offsetTop = element.offsetTop - navHeight - 20;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(218,11%,15%)]/95 backdrop-blur-sm border-b border-[hsl(220,9%,46%)]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20 sm:h-24 md:h-28">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <picture>
              <source media="(min-width: 1024px)" srcSet={logoDesktop} />
              <source media="(min-width: 640px)" srcSet={logoTablet} />
              <img
                src={logoMobile}
                alt="Six1Five Studio - Reality Capture Specialists"
                className="h-16 sm:h-18 md:h-20 max-h-20 w-auto transition-transform hover:scale-105 rounded-lg shadow-lg"
                loading="eager"
              />
            </picture>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("home")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
              aria-label="Navigate to home section"
            >
              Home
            </button>
            <Link href="/gallery" className="relative hover:text-[var(--primary-blue)] transition-colors">
              Gallery
            </Link>
            <button
              onClick={() => scrollToSection("services")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
              aria-label="Navigate to services section"
            >
              Services
            </button>
            <Link href="/pricing" className="relative hover:text-[var(--primary-blue)] transition-colors">
              Pricing
            </Link>
            <button
              onClick={() => scrollToSection("about")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
              aria-label="Navigate to portfolio section"
            >
              Portfolio
            </button>
            <Link href="/insights" className="relative hover:text-[hsl(199,89%,48%)] transition-colors">
              Insights
            </Link>
            <Link href="/faq" className="relative hover:text-[hsl(24,95%,53%)] transition-colors">
              FAQ
            </Link>
            {isAdminAuthenticated && (
              <Link 
                href="/admin" 
                className="relative hover:text-[hsl(24,95%,53%)] transition-colors flex items-center gap-1"
                title="Admin Dashboard"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            <button
              onClick={() => scrollToSection("contact")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
              aria-label="Navigate to contact section"
            >
              Contact
            </button>
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
                Gallery
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
              <button
                onClick={() => scrollToSection("about")}
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                aria-label="Navigate to portfolio section"
              >
                Portfolio
              </button>
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
              {isAdminAuthenticated && (
                <Link 
                  href="/admin"
                  className="text-left hover:text-[hsl(24,95%,53%)] transition-colors flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => scrollToSection("contact")}
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                aria-label="Navigate to contact section"
              >
                Contact
              </button>
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
