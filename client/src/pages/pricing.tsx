import { useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, ArrowRight } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  priceSubtext: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Essential",
    tagline: "Perfect for small sites",
    price: "Starting at $500",
    priceSubtext: "per project",
    description: "Ideal for residential properties, small commercial sites, or single-structure documentation.",
    features: [
      "Up to 5 acres coverage",
      "Basic aerial photogrammetry",
      "3D model delivery (OBJ/FBX)",
      "Orthomosaic map (GeoTIFF)",
      "Basic point cloud",
      "2-week turnaround",
      "Email support",
    ],
    cta: "Get Started",
  },
  {
    name: "Professional",
    tagline: "Most popular choice",
    price: "Starting at $1,500",
    priceSubtext: "per project",
    description: "Comprehensive solution for construction sites, commercial properties, and heritage documentation.",
    features: [
      "Up to 50 acres coverage",
      "Advanced photogrammetry + LiDAR",
      "High-detail 3D models",
      "Orthomosaic + elevation maps",
      "Classified point cloud",
      "Progress tracking dashboards",
      "1-week turnaround",
      "Priority phone/email support",
      "3 revision rounds included",
    ],
    popular: true,
    cta: "Get Quote",
  },
  {
    name: "Enterprise",
    tagline: "For large-scale projects",
    price: "Custom Pricing",
    priceSubtext: "volume discounts available",
    description: "Tailored solutions for large construction projects, infrastructure, and ongoing monitoring programs.",
    features: [
      "Unlimited acreage",
      "Multi-site coordination",
      "Drone + terrestrial LiDAR",
      "Advanced mesh processing",
      "Custom deliverable formats",
      "Automated progress monitoring",
      "Rush delivery available",
      "Dedicated project manager",
      "Unlimited revisions",
      "API integration support",
      "Training & onboarding",
    ],
    cta: "Contact Sales",
  },
];

const addOns = [
  {
    name: "Thermal Imaging",
    price: "+$300",
    description: "Identify heat loss, moisture intrusion, or electrical issues",
  },
  {
    name: "Interior Scanning",
    price: "+$500",
    description: "Complete interior documentation with terrestrial LiDAR",
  },
  {
    name: "Rush Delivery",
    price: "+30%",
    description: "3-day turnaround for urgent projects",
  },
  {
    name: "Monthly Monitoring",
    price: "Custom",
    description: "Scheduled site captures for progress tracking",
  },
];

const faqs = [
  {
    question: "What factors affect pricing?",
    answer: "Pricing depends on site size, complexity, desired resolution, deliverable formats, turnaround time, and site accessibility. We provide custom quotes after reviewing your project requirements.",
  },
  {
    question: "Do you offer volume discounts?",
    answer: "Yes! We offer discounted rates for multi-site projects, ongoing monitoring programs, and long-term partnerships. Contact us to discuss volume pricing.",
  },
  {
    question: "What's included in the base price?",
    answer: "All tiers include flight planning, data capture, processing, standard deliverables (3D models, orthomosaics, point clouds), and basic project management. Additional services can be added à la carte.",
  },
  {
    question: "How do revisions work?",
    answer: "Essential tier includes minor adjustments. Professional includes 3 revision rounds. Enterprise includes unlimited revisions. Revisions cover processing adjustments, not additional site visits.",
  },
  {
    question: "What if my project is outside these tiers?",
    answer: "These are starting points. Every project is unique. Contact us with your specific requirements for a custom quote tailored to your needs.",
  },
  {
    question: "Do you travel for projects?",
    answer: "Yes! We serve clients nationwide. Travel expenses may apply for projects outside our local service area (details provided in quote).",
  },
];

export default function Pricing() {
  useEffect(() => {
    document.title = "Pricing - Six1Five Studio | Reality Capture Services";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Transparent pricing for drone mapping, photogrammetry, and LiDAR scanning services. Custom quotes for construction, real estate, and heritage documentation projects.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[hsl(199,89%,48%)] text-white">Transparent Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Invest in <span className="text-[hsl(199,89%,48%)]">Precision</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Clear, competitive pricing for professional reality capture services. Choose the tier that fits your project, or contact us for a custom quote.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 border ${
                  tier.popular
                    ? "bg-gray-800 border-[hsl(24,95%,53%)] ring-2 ring-[hsl(24,95%,53%)] shadow-xl relative"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[hsl(24,95%,53%)] text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{tier.tagline}</p>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-[hsl(199,89%,48%)]">
                      {tier.price}
                    </span>
                    <span className="text-gray-400 ml-2">{tier.priceSubtext}</span>
                  </div>
                  <p className="text-sm text-gray-400">{tier.description}</p>
                </div>

                <div className="mb-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-[hsl(199,89%,48%)] mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href="/#contact">
                  <Button
                    className={`w-full ${
                      tier.popular
                        ? "bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
                        : "bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)]"
                    }`}
                    onClick={() => analytics.ctaClick(tier.cta, "pricing_tier")}
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Add-On Services</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Enhance your project with specialized services tailored to your unique requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon) => (
                <div
                  key={addon.name}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold">{addon.name}</h4>
                    <Badge variant="outline" className="text-[hsl(24,95%,53%)] border-[hsl(24,95%,53%)]">
                      {addon.price}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Comparison Note */}
          <div className="mb-16 bg-gray-800 border border-[hsl(199,89%,48%)] rounded-xl p-6 flex items-start">
            <AlertCircle className="w-6 h-6 text-[hsl(199,89%,48%)] mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Custom Quote Recommended</h3>
              <p className="text-gray-400 text-sm">
                These are starting prices for typical projects. Every site is unique—factors like terrain complexity,
                flight restrictions, desired accuracy, and deliverable requirements can affect final pricing.
                <span className="text-white font-medium"> Contact us for an accurate quote</span> based on your specific needs.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Have questions about our pricing? We've got answers.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-lg mb-2 text-[hsl(199,89%,48%)]">
                    {faq.question}
                  </h4>
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Tell us about your project and we'll provide a detailed quote within 24 hours.
              No obligation, no hidden fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button
                  className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] px-8"
                  onClick={() => analytics.ctaClick("Request Quote", "pricing_bottom_cta")}
                >
                  Request a Quote
                </Button>
              </Link>
              <Link href="/gallery">
                <Button
                  variant="outline"
                  className="border-gray-400 text-gray-200 hover:bg-gray-600 px-8"
                  onClick={() => analytics.ctaClick("View Portfolio", "pricing_bottom_cta")}
                >
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
