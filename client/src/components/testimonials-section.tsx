import { Star, Shield, Award, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { analytics } from "@/lib/analytics";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  projectType: string;
  imageUrl?: string;
}

// PLACEHOLDER TESTIMONIALS - Replace with real client testimonials
// To add real testimonials:
// 1. Reach out to past clients
// 2. Request permission to use their feedback
// 3. Update the array below with actual names, companies, and quotes
// 4. Optional: Add client headshot images to imageUrl field
const testimonials: Testimonial[] = [
  {
    name: "Client Name",
    role: "Project Manager",
    company: "Construction Company",
    content: "Outstanding service and precision. The 3D models and site maps exceeded our expectations and provided invaluable insights for our construction project.",
    rating: 5,
    projectType: "Construction Site Mapping",
  },
  {
    name: "Client Name",
    role: "Facilities Director",
    company: "Commercial Real Estate",
    content: "The LiDAR scanning gave us incredibly accurate as-built documentation. The turnaround time was impressive and the team was professional throughout.",
    rating: 5,
    projectType: "Interior Documentation",
  },
  {
    name: "Client Name",
    role: "Historic Preservation Lead",
    company: "Heritage Organization",
    content: "The photogrammetry work captured intricate details we never thought possible. This digital preservation will serve our community for generations.",
    rating: 5,
    projectType: "Heritage Documentation",
  },
];

const trustSignals = [
  {
    icon: Shield,
    title: "FAA Part 107 Certified",
    description: "Licensed commercial drone pilot"
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
                  <p className="text-gray-400 text-sm text-center">{signal.description}</p>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 relative hover:border-[hsl(199,89%,48%)] transition-colors">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-[hsl(199,89%,48%)]/20" />

              <div className="mb-4">
                <div className="flex items-center mb-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[hsl(24,95%,53%)] text-[hsl(24,95%,53%)]" />
                  ))}
                </div>
                <Badge variant="outline" className="text-xs border-gray-400 text-gray-200">
                  {testimonial.projectType}
                </Badge>
              </div>

              <blockquote className="text-gray-300 mb-6 relative z-10">
                "{testimonial.content}"
              </blockquote>

              <div className="flex items-center border-t border-gray-700 pt-4">
                {testimonial.imageUrl ? (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full mr-4 bg-[hsl(199,89%,48%)]/20 flex items-center justify-center">
                    <span className="text-[hsl(199,89%,48%)] font-semibold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Placeholder Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 italic">
            Note: Replace placeholder testimonials with real client feedback in testimonials-section.tsx
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to capture your site?
            </h3>
            <p className="text-white/90 mb-6">
              Join our satisfied clients and experience professional reality capture services.
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