import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { pricingTiers } from "@/data/pricing";
import { analytics } from "@/lib/analytics";

/**
 * Homepage pricing strip. Shows only name / price / first feature for each
 * tier so a visitor can self-qualify in a glance, then links to /pricing
 * for the full breakdown. Data comes from the same module as the pricing page.
 */
export default function PricingPreview() {
  return (
    <section id="pricing" className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--logo-blue)] font-semibold mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Clear starting points. Custom quote for anything bigger.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Most small-site and land-listing projects land in the first tier. Construction and
            multi-visit work is quoted per site.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl border p-7 flex flex-col ${
                tier.popular
                  ? "border-[hsl(24,95%,53%)]/60 bg-white/[0.04]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              <p className="text-sm uppercase tracking-wider text-gray-400 mb-2">{tier.name}</p>
              <p className="text-3xl font-bold text-white mb-1">{tier.price}</p>
              <p className="text-sm text-gray-500 mb-5">{tier.priceSubtext}</p>
              <p className="text-gray-300 flex-grow">{tier.features[0]}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <Link
            href="/pricing"
            onClick={() => analytics.ctaClick("See full pricing", "pricing_preview")}
            className="inline-flex items-center gap-2 text-[var(--accent-blue)] hover:text-white font-semibold transition-colors"
          >
            See full pricing, add-ons, and the cost calculator
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
