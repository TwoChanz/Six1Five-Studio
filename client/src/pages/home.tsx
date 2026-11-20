import { useEffect } from "react";
import Navbar from "@/components/navbar";
import HeroVideo from "@/components/hero-video";
import FeaturedModelsSection from "@/components/featured-models-section";
import ServicesSection from "@/components/services-section";
import ProcessSection from "@/components/process-section";
import PricingPreview from "@/components/pricing-preview";
import AboutSection from "@/components/about-section";
import TestimonialsSection from "@/components/testimonials-section";
import LatestBlogWidget from "@/components/latest-blog-widget";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

/**
 * Homepage section order is deliberate and mirrors the navbar:
 *
 *   Hero → Work (live 3D models) → Services → Process → Pricing →
 *   About → Credentials → Blog → Contact
 *
 * Show the product first, explain it second, price it third, then prove
 * credibility and ask for the quote. Sections that used to live here but
 * were removed from the funnel (AI workflow showcase, service keyword
 * ticker, sample dataset banner, final CTA banner, DB-driven portfolio
 * grid) still exist as components and on their own pages.
 */
export default function Home() {
  useEffect(() => {
    document.title = "Six1Five Studio - Drone Mapping & 3D Site Models | Middle Tennessee";

    // Add meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Drone mapping, orthomosaics, and interactive 3D site models for construction teams, land listings, and property owners in Nashville and Middle Tennessee. Delivered as a browser link.";
      document.head.appendChild(meta);
    }

    // Structured data for local business
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Six1Five Studio",
      description:
        "Drone mapping and reality capture: orthomosaics, elevation data, and interactive 3D site models for AEC, construction, and real estate.",
      url: "https://six1fivestudio.com",
      telephone: "+1-931-588-8997",
      email: "admin@six1fivestudio.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "La Vergne",
        addressRegion: "TN",
        addressCountry: "US",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "36.0156",
        longitude: "-86.5804",
      },
      serviceArea: {
        "@type": "State",
        name: "Tennessee",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Reality Capture Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Drone Mapping & 3D Site Models",
              description:
                "Orthomosaics, digital surface models, and interactive 3D models from drone photogrammetry",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Construction Progress Documentation",
              description:
                "Recurring, dated aerial captures with shareable links for owners, project managers, and subcontractors",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Aerial Photography & Video",
              description: "Still imagery and video for listings, marketing, and proposals",
            },
          },
        ],
      },
      sameAs: [
        "https://www.linkedin.com/in/chandler-hopkins-057164185/",
        "https://substack.com/@digitalblueprints",
        "https://sketchfab.com/six1fivemedia",
      ],
    };

    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      <HeroVideo />
      <FeaturedModelsSection />
      <ServicesSection />
      <ProcessSection />
      <PricingPreview />
      <AboutSection />
      <TestimonialsSection />
      <LatestBlogWidget />
      <ContactSection />
      <Footer />
    </div>
  );
}
