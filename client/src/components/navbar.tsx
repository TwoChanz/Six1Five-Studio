import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import logoImage from "@/assets/six1five-logo.png";
import logoHorizontal from "@/assets/logo-navbar-gradient.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (location !== "/") {
      // Navigate to home first, then scroll
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Add offset for fixed navbar (64px height + 20px padding)
      const offsetTop = element.offsetTop - 84;
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
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src={logoHorizontal} 
              alt="SixlFive Studio - Reality Capture Specialists" 
              className="h-8 w-auto md:h-10 transition-transform hover:scale-105 rounded-lg"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
            >
              Home
            </button>
            <Link href="/gallery" className="relative hover:text-[var(--primary-blue)] transition-colors">
              Gallery
            </Link>
            <button 
              onClick={() => scrollToSection("services")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection("portfolio")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
            >
              Portfolio
            </button>
            <Link href="/blog" className="relative hover:text-[hsl(24,95%,53%)] transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="relative hover:text-[hsl(24,95%,53%)] transition-colors">
              FAQ
            </Link>
            <button 
              onClick={() => scrollToSection("contact")}
              className="relative hover:text-[var(--primary-blue)] transition-colors"
            >
              Contact
            </button>
            <ThemeToggle />
            <Button 
              onClick={() => scrollToSection("contact")}
              className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-4 py-2 rounded-lg transition-colors"
            >
              Book a Scan
            </Button>
          </div>
          
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection("portfolio")}
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
              >
                Portfolio
              </button>
              <Link 
                href="/blog" 
                className="text-left hover:text-[var(--primary-blue)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
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
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
