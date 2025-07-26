import { useEffect } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import ServiceKeywords from "@/components/service-keywords";
import ServicesSection from "@/components/services-section";
import AIWorkflowShowcase from "@/components/ai-workflow-showcase";
import AboutSection from "@/components/about-section";
import PortfolioSection from "@/components/portfolio-section";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";
import FinalCTABanner from "@/components/final-cta-banner";
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

    // Add structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Six1Five Studio",
      "description": "Professional reality capture services specializing in drone mapping, LiDAR scanning, and photogrammetry",
      "url": "https://six1fivestudio.com",
      "telephone": "+1-931-588-8997",
      "email": "six1fivestudio@outlook.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "La Vergne",
        "addressRegion": "TN",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "36.0156",
        "longitude": "-86.5804"
      },
      "serviceArea": {
        "@type": "State",
        "name": "Tennessee"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Reality Capture Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Drone Mapping",
              "description": "Aerial photogrammetry and mapping services using professional drone equipment"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "LiDAR Scanning",
              "description": "High-precision 3D laser scanning for interior and exterior documentation"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Photogrammetry",
              "description": "3D model reconstruction from photographs for AEC and heritage documentation"
            }
          }
        ]
      },
      "sameAs": [
        "https://www.linkedin.com/in/chandler-hopkins-057164185/",
        "https://substack.com/@digitalblueprints"
      ]
    };

    // Add structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      <HeroSection />
      <ServiceKeywords />
      <ServicesSection />
      <AIWorkflowShowcase />
      <AboutSection />
      <PortfolioSection />
      <TestimonialsSection />
      <ContactSection />
      <FinalCTABanner />
      <Footer />
    </div>
  );
}
