import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SketchfabViewer from "./sketchfab-viewer";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Animate hero text on mount
    const animatedText = document.querySelector('.animated-text');
    if (animatedText) {
      animatedText.classList.add('animate-pulse');
    }
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center py-20 sm:py-24 md:py-16 overflow-x-hidden">
      {/* Semi-transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218,11%,15%)]/90 via-[hsl(218,11%,15%)]/50 to-[hsl(218,11%,15%)]/80 z-0"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 z-10 max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Text Content - Mobile Optimized */}
          <div className="text-center lg:text-left space-y-5 sm:space-y-6 lg:space-y-8 max-w-3xl mx-auto lg:mx-0">
            {/* Hero Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] sm:leading-[1.25]">
              <span className="text-[var(--primary-blue)]">Scan</span> the World.
              <br />
              <span className="text-[var(--logo-blue)]">Reconstruct</span> Reality.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-contrast-medium leading-relaxed">
              Professional drone mapping and 3D scanning for construction, real estate, and preservation.
            </p>

            {/* Secondary Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed">
              Drone mapping, LiDAR, photogrammetry — all captured with purpose.
            </p>

            {/* Animated Tagline */}
            <div className="animated-text py-2">
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono text-[hsl(158,64%,52%)] leading-relaxed block">
                I turn real spaces into digital products.
              </span>
            </div>

            {/* CTA Buttons - Stack on mobile, horizontal on sm+ */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start pt-4">
              <Button
                onClick={() => scrollToSection("portfolio")}
                className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-8 py-4 sm:py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto text-base sm:text-lg"
              >
                View Portfolio
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                variant="outline"
                className="border-2 border-[var(--logo-blue)] text-[var(--logo-blue)] hover:bg-[var(--logo-blue)] hover:text-white px-8 py-4 sm:py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto text-base sm:text-lg"
              >
                Book a Scan
              </Button>
            </div>
          </div>

          {/* 3D Viewer - Hidden on mobile, shown on md+ */}
          <div className="relative w-full hidden md:block">
            <SketchfabViewer />
          </div>
        </div>
      </div>
    </section>
  );
}
