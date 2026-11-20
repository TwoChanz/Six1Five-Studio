import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { scrollToSection as scrollToSectionOnPage } from "@/lib/scroll";
import logoMobile from "@/assets/logo-matrix-style-mobile.webp";
import logoTablet from "@/assets/logo-matrix-style-tablet.webp";
import logoDesktop from "@/assets/logo-matrix-style-desktop.webp";

/**
 * One nav item is either a same-page section (scrolls, navigating home first
 * if needed) or a route (client-side navigation).
 *
 * The list mirrors the homepage top-to-bottom, so a visitor's mental model of
 * the nav matches what they see as they scroll. Secondary pages (Blog, FAQ,
 * Resources) live in the footer.
 */
type NavItem =
  | { label: string; kind: "section"; target: string }
  | { label: string; kind: "route"; target: string };

const navItems: NavItem[] = [
  { label: "Work", kind: "section", target: "work" },
  { label: "Services", kind: "section", target: "services" },
  { label: "Process", kind: "section", target: "process" },
  { label: "Pricing", kind: "route", target: "/pricing" },
  { label: "Contact", kind: "section", target: "contact" },
];

const CTA_LABEL = "Request a Quote";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const pendingScrollRef = useRef<string | null>(null);

  // After navigating to "/" for a section link, wait a tick for the page to
  // render, then perform the deferred scroll.
  useEffect(() => {
    if (location === "/" && pendingScrollRef.current) {
      const targetId = pendingScrollRef.current;
      pendingScrollRef.current = null;
      const timeoutId = setTimeout(() => scrollToSectionOnPage(targetId), 150);
      return () => clearTimeout(timeoutId);
    }
  }, [location]);

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    if (location !== "/") {
      pendingScrollRef.current = sectionId;
      setLocation("/");
      return;
    }
    scrollToSectionOnPage(sectionId);
  };

  const isActiveRoute = (target: string) =>
    location === target || location.startsWith(`${target}/`);

  const linkBase = "relative transition-colors hover:text-[var(--primary-blue)]";
  const activeUnderline =
    "text-[var(--primary-blue)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-[var(--primary-blue)] after:rounded-full";

  const renderItem = (item: NavItem, mobile = false) => {
    const mobileClass = mobile ? "text-left" : "";
    if (item.kind === "route") {
      return (
        <Link
          key={item.label}
          href={item.target}
          onClick={() => setIsMenuOpen(false)}
          className={`${linkBase} ${mobileClass} ${!mobile && isActiveRoute(item.target) ? activeUnderline : ""}`}
        >
          {item.label}
        </Link>
      );
    }
    return (
      <button
        key={item.label}
        type="button"
        onClick={() => scrollToSection(item.target)}
        className={`${linkBase} ${mobileClass}`}
        aria-label={`Navigate to ${item.label.toLowerCase()} section`}
      >
        {item.label}
      </button>
    );
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
                style={{ filter: "brightness(1.15) drop-shadow(0 0 6px var(--logo-blue))" }}
                loading="eager"
              />
            </picture>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => renderItem(item))}
            <div className="pr-3">
              <ThemeToggle />
            </div>
            <Button
              onClick={() => scrollToSection("contact")}
              className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-4 py-2 rounded-lg transition-colors"
              aria-label={`${CTA_LABEL} - navigate to contact form`}
            >
              {CTA_LABEL}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
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
              {navItems.map((item) => renderItem(item, true))}
              <div className="flex items-center gap-3 pt-3">
                <span className="text-sm text-gray-400">Theme:</span>
                <ThemeToggle />
              </div>
              <button
                type="button"
                onClick={() => scrollToSection("contact")}
                className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-4 py-2 rounded-lg transition-colors w-full text-center mt-4"
                aria-label={`${CTA_LABEL} - navigate to contact form`}
              >
                {CTA_LABEL}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
