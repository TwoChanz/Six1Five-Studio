import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

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
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[hsl(218,11%,15%)]/90 backdrop-blur-sm border-b border-[hsl(220,9%,46%)]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold font-mono text-sm">615</span>
            </div>
            <span className="text-xl font-semibold">Six1Five Studio</span>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <button 
              onClick={() => scrollToSection("home")}
              className="relative hover:text-[hsl(24,95%,53%)] transition-colors"
            >
              Home
            </button>
            <Link href="/gallery" className="relative hover:text-[hsl(24,95%,53%)] transition-colors">
              Gallery
            </Link>
            <button 
              onClick={() => scrollToSection("services")}
              className="relative hover:text-[hsl(24,95%,53%)] transition-colors"
            >
              Services
            </button>
            <Link href="/blog" className="relative hover:text-[hsl(24,95%,53%)] transition-colors">
              Blog
            </Link>
            <Link href="/faq" className="relative hover:text-[hsl(24,95%,53%)] transition-colors">
              FAQ
            </Link>
            <button 
              onClick={() => scrollToSection("contact")}
              className="relative hover:text-[hsl(24,95%,53%)] transition-colors"
            >
              Contact
            </button>
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
                className="text-left hover:text-[hsl(24,95%,53%)] transition-colors"
              >
                Home
              </button>
              <Link 
                href="/gallery" 
                className="text-left hover:text-[hsl(24,95%,53%)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Gallery
              </Link>
              <button 
                onClick={() => scrollToSection("services")}
                className="text-left hover:text-[hsl(24,95%,53%)] transition-colors"
              >
                Services
              </button>
              <Link 
                href="/blog" 
                className="text-left hover:text-[hsl(24,95%,53%)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/faq" 
                className="text-left hover:text-[hsl(24,95%,53%)] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <button 
                onClick={() => scrollToSection("contact")}
                className="text-left hover:text-[hsl(24,95%,53%)] transition-colors"
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
