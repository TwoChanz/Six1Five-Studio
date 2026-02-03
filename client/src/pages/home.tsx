import { useEffect } from "react";
import Navbar from "@/components/navbar";
import { SEOHead, getCanonicalUrl } from "@/components/seo-head";
import HeroSection from "@/components/hero-section";
import ServiceKeywords from "@/components/service-keywords";
import ServicesSection from "@/components/services-section";
import AIWorkflowShowcase from "@/components/ai-workflow-showcase";
import AboutSection from "@/components/about-section";
import PortfolioSection from "@/components/portfolio-section";
import SampleDatasetBanner from "@/components/sample-dataset-banner";
import LatestBlogWidget from "@/components/latest-blog-widget";
import TestimonialsSection from "@/components/testimonials-section";
import ContactSection from "@/components/contact-section";
import FinalCTABanner from "@/components/final-cta-banner";
import Footer from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Add structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Six1Five Studio",
      "description": "Professional reality capture services specializing in drone mapping, LiDAR scanning, and photogrammetry",
      "url": "https://six1fivestudio.com",
      "telephone": "+1-931-588-8997",
      "email": "admin@six1fivestudio.com",
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
      <SEOHead
        title="Six1Five Studio - Drone Mapping & LiDAR Scanning Nashville | Reality Capture Services"
        description="Professional drone mapping, LiDAR scanning, and photogrammetry services in Nashville and Middle Tennessee. Precision reality capture for AEC, construction, real estate, and historic preservation projects."
        keywords="drone mapping Nashville, LiDAR scanning Tennessee, photogrammetry services, reality capture, construction documentation, 3D scanning Nashville, aerial surveying"
        canonicalUrl={getCanonicalUrl('/')}
      />
      <Navbar />
      <HeroSection />
      <ServiceKeywords />
      <ServicesSection />
      <AIWorkflowShowcase />
      <AboutSection />
      <PortfolioSection />
      <SampleDatasetBanner />
      <LatestBlogWidget />
      <TestimonialsSection />
      <ContactSection />
      <FinalCTABanner />
      <Footer />
    </div>
  );
}
