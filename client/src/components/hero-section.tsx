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
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Semi-transparent gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(218,11%,15%)]/90 via-[hsl(218,11%,15%)]/50 to-[hsl(218,11%,15%)]/80 z-0"></div>
      <div className="container mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-[hsl(24,95%,53%)]">Scan</span> the World.
              <br />
              <span className="text-[hsl(199,89%,48%)]">Reconstruct</span> Reality.
            </h1>
            <p className="text-xl text-gray-400 mb-4 max-w-lg">
              Professional drone mapping and 3D scanning for construction, real estate, and preservation.
            </p>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Drone mapping, LiDAR, photogrammetry — all captured with purpose.
            </p>
            <div className="animated-text mb-8">
              <span className="text-2xl font-mono text-[hsl(158,64%,52%)]">
                I turn real spaces into digital products.
              </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => scrollToSection("portfolio")}
                className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View Portfolio
              </Button>
              <Button 
                onClick={() => scrollToSection("contact")}
                variant="outline"
                className="border border-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,48%)] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
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
