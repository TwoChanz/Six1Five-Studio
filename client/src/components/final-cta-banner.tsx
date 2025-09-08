import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Clock } from "lucide-react";

export default function FinalCTABanner() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-[var(--primary-blue)] to-[var(--logo-blue)]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to capture your site?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Transform your project with professional reality capture technology. 
          Get precision 3D models, accurate measurements, and comprehensive documentation.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center justify-center text-white/90">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Fast turnaround</span>
          </div>
          <div className="flex items-center justify-center text-white/90">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Tennessee service area</span>
          </div>
          <div className="flex items-center justify-center text-white/90">
            <Calendar className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Flexible scheduling</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={scrollToContact}
            className="bg-white text-[var(--primary-blue)] hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-colors"
          >
            Book a scan now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            onClick={scrollToContact}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[var(--primary-blue)] px-8 py-3 text-lg font-semibold transition-colors"
          >
            Get Free Quote
          </Button>
        </div>
        
        <p className="text-white/70 text-sm mt-4">
          Professional • Certified • Insured • Fast Delivery
        </p>
      </div>
    </section>
  );
}