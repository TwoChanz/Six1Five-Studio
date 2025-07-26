import { Star, Shield, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    role: "Project Manager",
    company: "Heritage Construction Co.",
    content: "Chandler's 3D documentation of our historic renovation project was incredibly detailed. The precision of the LiDAR scans helped us identify structural issues we couldn't see otherwise.",
    rating: 5
  },
  {
    name: "Mike Torres",
    role: "Real Estate Developer",
    company: "Tennessee Properties LLC",
    content: "The drone mapping service for our 50-acre development site was completed ahead of schedule. The deliverables were exactly what we needed for our engineering team.",
    rating: 5
  }
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
            Client <span className="text-[hsl(24,95%,53%)]">Testimonials</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from clients who've experienced the precision and professionalism of our reality capture services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-8 border border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[hsl(24,95%,53%)] fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div className="border-t border-gray-700 pt-4">
                <p className="text-white font-semibold">{testimonial.name}</p>
                <p className="text-gray-400 text-sm">{testimonial.role}, {testimonial.company}</p>
              </div>
            </div>
          ))}
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
            <button className="bg-white text-[hsl(24,95%,53%)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Book a scan now →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}