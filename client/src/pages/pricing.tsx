import { useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import CostCalculator from "@/components/cost-calculator";
import LeadMagnetTrigger from "@/components/lead-magnet-trigger";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle, ArrowRight } from "lucide-react";
import { analytics } from "@/lib/analytics";

import { pricingTiers, pricingAddOns as addOns, pricingFaqs as faqs } from "@/data/pricing";

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
              Clear, competitive pricing for professional reality capture services. Choose the tier that fits your project, or contact me for a custom quote.
            </p>
          </div>

          {/* Cost Calculator */}
          <div className="mb-16 max-w-4xl mx-auto">
            <CostCalculator />
          </div>

          {/* Pricing Tiers Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Standard Pricing Tiers</h2>
            <p className="text-gray-400">Or browse my standard packages below</p>
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
                <span className="text-white font-medium"> Contact me for an accurate quote</span> based on your specific needs.
              </p>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Have questions about my pricing? I've got answers.
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

          {/* Lead Magnet Section */}
          <div className="mb-16 bg-gradient-to-br from-[hsl(24,95%,53%)]/10 to-[hsl(199,89%,48%)]/10 border-2 border-[hsl(24,95%,53%)] rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Free Download: <span className="text-[hsl(24,95%,53%)]">Reality Capture ROI Guide</span>
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-lg">
              Calculate your project ROI, compare technologies, and get expert planning templates.
              No credit card required - just instant access to my comprehensive guide.
            </p>
            <LeadMagnetTrigger
              source="pricing_page"
              variant="cta"
              text="Get Your Free Guide"
              className="px-8 py-6 text-lg"
            />
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Tell me about your project and I'll provide a detailed quote within 24 hours.
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
