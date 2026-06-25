import { Star, Shield, Award, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { analytics } from "@/lib/analytics";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { Review } from "@shared/schema";
import ReviewDialog from "@/components/review-dialog";
import logoCircular from "@/assets/logo-circular-large.webp";

const trustSignals = [
  {
    icon: Shield,
    title: "FAA Part 107 Certified",
    description: "Licensed commercial drone pilot",
    link: "/credentials/TRUST_Certification.pdf",
    linkText: "View TRUST Certification"
  },
  {
    icon: Award,
    title: "Fully Insured",
    description: "$1M liability coverage"
  },
  {
    icon: Star,
    title: "MTSU Certified",
    description: "Construction Management degree"
  }
];

export default function TestimonialsSection() {
  // Fetch approved reviews from the API
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ['/api/reviews'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      const nav = document.querySelector('nav');
      const navHeight = nav?.getBoundingClientRect().height ?? 80;
      const offsetTop = element.offsetTop - navHeight - 20;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
      analytics.ctaClick("Book a scan now", "testimonials_section");
    }
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        {/* Trust Signals */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[hsl(158,64%,52%)] text-white">Trusted & Certified</Badge>
          <h2 className="text-3xl font-bold mb-8">
            Professional <span className="text-[hsl(158,64%,52%)]">Credentials</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {trustSignals.map((signal, index) => {
              const IconComponent = signal.icon;
              return (
                <div key={index} className="flex flex-col items-center p-6 bg-gray-800 rounded-xl">
                  <IconComponent className="w-12 h-12 text-[hsl(158,64%,52%)] mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{signal.title}</h3>
                  <p className="text-gray-400 text-sm text-center mb-3">{signal.description}</p>
                  {signal.link && (
                    <a
                      href={signal.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,58%)] text-sm font-medium transition-colors flex items-center gap-1"
                      onClick={() => analytics.externalLink(signal.link!, signal.linkText || 'View Credential')}
                    >
                      {signal.linkText || 'View Credential'}
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Client <span className="text-[hsl(24,95%,53%)]">Success Stories</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from clients who've transformed their projects with precision reality capture.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src={logoCircular}
              alt="Six1Five Studio Loading"
              className="w-24 h-24 mb-4 animate-pulse"
            />
            <p className="text-gray-400">Loading client reviews...</p>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative hover:border-[hsl(199,89%,48%)] transition-colors flex flex-col min-h-[320px]">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-[hsl(199,89%,48%)]/20" />

                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[hsl(24,95%,53%)] text-[hsl(24,95%,53%)]" />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs border-gray-400 text-gray-200">
                    {review.projectType}
                  </Badge>
                </div>

                <blockquote className="text-gray-300 mb-6 relative z-10 flex-grow">
                  "{review.reviewText}"
                </blockquote>

                <div className="flex items-center border-t border-gray-700 pt-4 mt-auto">
                  <div className="w-12 h-12 rounded-full mr-4 bg-[hsl(199,89%,48%)]/20 flex items-center justify-center">
                    <span className="text-[hsl(199,89%,48%)] font-semibold text-lg">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-white">{review.name}</div>
                    <div className="text-sm text-gray-400">
                      {review.role && review.company ? (
                        `${review.role}, ${review.company}`
                      ) : review.role || review.company || 'Client'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src={logoCircular}
              alt="Six1Five Studio"
              className="w-24 h-24 mb-6 opacity-50"
            />
            <p className="text-gray-400 mb-4">No reviews yet. Be the first to share your experience!</p>
            <ReviewDialog />
          </div>
        )}

        {/* Add Review Button & CTA */}
        {reviews && reviews.length > 0 && (
          <div className="mt-12">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">
                Have you worked with us?
              </h3>
              <p className="text-gray-400 mb-6 max-w-xl mx-auto">
                Share your experience and help others understand the quality and professionalism they can expect from Six1Five Studio.
              </p>
              <ReviewDialog />
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to capture your site?
            </h3>
            <p className="text-white/90 mb-6">
              Join my satisfied clients and experience professional reality capture services.
            </p>
            <button
              onClick={scrollToContact}
              className="bg-white text-[hsl(24,95%,53%)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              aria-label="Book a scan - navigate to contact form"
            >
              Book a scan now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}