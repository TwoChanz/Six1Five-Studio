import { useEffect } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServiceKeywords from "@/components/service-keywords";
import ServicesSection from "@/components/services-section";
import AboutSection from "@/components/about-section";
import PortfolioSection from "@/components/portfolio-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    document.title = "Six1Five Studio - Reality Capture Portfolio | Chandler Hopkins";
    
    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Professional reality capture services in Nashville, TN. Drone mapping, LiDAR scanning, and photogrammetry for AEC, real estate, and historic preservation by Chandler Hopkins.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      <HeroSection />
      <ServiceKeywords />
      <ServicesSection />
      <AboutSection />
      <PortfolioSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
