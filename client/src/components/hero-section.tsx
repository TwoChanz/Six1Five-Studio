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
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 md:pt-16">
      {/* Semi-transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218,11%,15%)]/90 via-[hsl(218,11%,15%)]/50 to-[hsl(218,11%,15%)]/80 z-0"></div>
      <div className="container mx-auto px-4 sm:px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left px-2 sm:px-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
              <span className="text-[var(--primary-blue)]">Scan</span> the World.
              <br />
              <span className="text-[var(--logo-blue)]">Reconstruct</span> Reality.
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-3 md:mb-4 max-w-lg">
              Professional drone mapping and 3D scanning for construction, real estate, and preservation.
            </p>
            <p className="text-base sm:text-lg text-gray-300 mb-6 md:mb-8 max-w-lg">
              Drone mapping, LiDAR, photogrammetry — all captured with purpose.
            </p>
            <div className="animated-text mb-6 md:mb-8">
              <span className="text-lg sm:text-xl md:text-2xl font-mono text-[hsl(158,64%,52%)]">
                I turn real spaces into digital products.
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button 
                onClick={() => scrollToSection("portfolio")}
                className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-6 py-4 sm:px-8 sm:py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
              >
                View Portfolio
              </Button>
              <Button 
                onClick={() => scrollToSection("contact")}
                variant="outline"
                className="border border-[var(--logo-blue)] text-[var(--logo-blue)] hover:bg-[var(--logo-blue)] hover:text-white px-6 py-4 sm:px-8 sm:py-3 rounded-lg font-semibold transition-colors w-full sm:w-auto"
              >
                Book a Scan
              </Button>
            </div>
          </div>
          <div className="relative">
            <SketchfabViewer />
          </div>
        </div>
      </div>
    </section>
  );
}
