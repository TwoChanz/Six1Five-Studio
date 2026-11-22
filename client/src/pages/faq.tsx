import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Plane, 
  FileText, 
  DollarSign, 
  Clock, 
  MapPin, 
  Camera, 
  Settings, 
  Shield,
  HelpCircle,
  Phone,
  LucideIcon
} from "lucide-react";
import faqData from "@/data/faq.json";

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  Plane,
  Camera,
  Clock,
  Settings,
  Shield,
  FileText,
  DollarSign,
  MapPin,
  HelpCircle,
  Phone
};


export default function FAQ() {
  useEffect(() => {
    document.title = "FAQ - Six1Five Studio | Reality Capture Questions & Answers";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Get answers to common questions about drone mapping, LiDAR scanning, regulations, pricing, and project timelines. Expert reality capture services in Tennessee.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {faqData.pageTitle.split(' ').slice(0, 2).join(' ')} <span className="text-[hsl(199,89%,48%)]">{faqData.pageTitle.split(' ').slice(2).join(' ')}</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              {faqData.pageSubtitle}
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqData.categories.map((category, categoryIndex) => {
              const IconComponent = iconMap[category.icon] || HelpCircle;
              return (
                <section key={categoryIndex} className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-6">
                    <IconComponent className={`w-6 h-6 ${category.color}`} />
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {category.faqs.length} questions
                    </Badge>
                  </div>
                  
                  <Accordion type="multiple" className="space-y-2">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem 
                        key={faqIndex} 
                        value={`${categoryIndex}-${faqIndex}`}
                        className="border-gray-700"
                      >
                        <AccordionTrigger className="text-left hover:text-[hsl(24,95%,53%)] transition-colors">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-400 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </section>
              );
            })}
          </div>

          {/* Still Have Questions Section */}
          <div className="mt-16 bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-xl p-8 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-white" />
            <h2 className="text-2xl font-bold mb-4 text-white">{faqData.ctaTitle}</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              {faqData.ctaDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button 
                  variant="secondary" 
                  className="bg-white text-[hsl(24,95%,53%)] hover:bg-gray-100"
                >
                  Get Project Quote
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => window.open('tel:+19315888997', '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call (931) 588-8997
              </Button>
            </div>
          </div>

          {/* Quick Contact Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <FileText className="w-8 h-8 text-[hsl(24,95%,53%)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Project Requirements</h3>
              <p className="text-gray-400 text-sm mb-4">Need help defining your project scope and deliverables?</p>
              <Link href="/#contact">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Get Consultation
                </Button>
              </Link>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <DollarSign className="w-8 h-8 text-[hsl(199,89%,48%)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Custom Pricing</h3>
              <p className="text-gray-400 text-sm mb-4">Large project or ongoing monitoring needs?</p>
              <Link href="/#contact">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Request Quote
                </Button>
              </Link>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <MapPin className="w-8 h-8 text-[hsl(158,64%,52%)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Service Area</h3>
              <p className="text-gray-400 text-sm mb-4">Questions about coverage in your location?</p>
              <Link href="/#contact">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Check Coverage
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