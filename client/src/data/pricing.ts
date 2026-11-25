/**
 * Single source of truth for pricing content.
 *
 * Consumed by:
 *   - pages/pricing.tsx            (full pricing page)
 *   - components/pricing-preview.tsx (homepage "starting at" strip)
 *
 * Edit prices here and both surfaces update together.
 */

export interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  priceSubtext: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface PricingAddOn {
  name: string;
  price: string;
  description: string;
}

export interface PricingFaq {
  question: string;
  answer: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Essential",
    tagline: "Perfect for small sites",
    price: "Starting at $500",
    priceSubtext: "per project",
    description:
      "Ideal for residential properties, small commercial sites, or single-structure documentation.",
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
    tagline: "Built for active construction sites",
    price: "Starting at $1,500",
    priceSubtext: "per project",
    description:
      "Comprehensive solution for construction sites, commercial properties, and heritage documentation.",
    features: [
      "Up to 50 acres coverage",
      "Detailed photogrammetry with oblique passes",
      "High-detail 3D models",
      "Orthomosaic + elevation maps",
      "Dense point cloud",
      "Shareable browser link for every capture",
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
    description:
      "Tailored solutions for large construction projects, infrastructure, and ongoing monitoring programs.",
    features: [
      "Larger or multi-phase sites",
      "Multiple sites on one schedule",
      "Gaussian splat walkthroughs",
      "Custom deliverable formats",
      "Recurring progress captures on your schedule",
      "Rush delivery available",
      "You work with me directly, start to finish",
      "Unlimited revisions",
      "Walkthrough of your files and viewer links",
    ],
    cta: "Get Quote",
  },
];

export const pricingAddOns: PricingAddOn[] = [
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

export const pricingFaqs: PricingFaq[] = [
  {
    question: "What factors affect pricing?",
    answer:
      "Pricing depends on site size, complexity, desired resolution, deliverable formats, turnaround time, and site accessibility. I provide custom quotes after reviewing your project requirements.",
  },
  {
    question: "Do you offer volume discounts?",
    answer:
      "Yes! I offer discounted rates for multi-site projects, ongoing monitoring programs, and long-term partnerships. Contact me to discuss volume pricing.",
  },
  {
    question: "What's included in the base price?",
    answer:
      "All tiers include flight planning, data capture, processing, standard deliverables (3D models, orthomosaics, point clouds), and basic project management. Additional services can be added à la carte.",
  },
  {
    question: "How do revisions work?",
    answer:
      "Essential tier includes minor adjustments. Professional includes 3 revision rounds. Enterprise includes unlimited revisions. Revisions cover processing adjustments, not additional site visits.",
  },
  {
    question: "What if my project is outside these tiers?",
    answer:
      "These are starting points. Every project is unique. Contact me with your specific requirements for a custom quote tailored to your needs.",
  },
  {
    question: "Do you travel for projects?",
    answer:
      "I'm based in Smyrna and cover Rutherford County, the Nashville area, and the rest of Middle Tennessee. Sites farther out are quoted case by case, with any travel cost listed in the quote.",
  },
];
