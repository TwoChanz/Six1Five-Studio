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
  Phone
} from "lucide-react";

const faqCategories = [
  {
    title: "Drone Mapping & Regulations",
    icon: Plane,
    color: "text-[hsl(24,95%,53%)]",
    faqs: [
      {
        question: "Do you have FAA Part 107 certification?",
        answer: "Yes, I hold a current FAA Part 107 Remote Pilot Certificate, which is required for commercial drone operations in the United States. This certification ensures all flights are conducted safely and legally according to federal aviation regulations."
      },
      {
        question: "What are the restrictions for drone flights in Tennessee?",
        answer: "Tennessee follows federal FAA regulations. Key restrictions include: maximum altitude of 400 feet AGL, maintaining visual line of sight, no flights over people without waivers, and restricted airspace around airports. I handle all airspace authorizations and NOTAMs required for your project."
      },
      {
        question: "Can you fly drones in restricted airspace?",
        answer: "Yes, with proper authorization. I can obtain LAANC (Low Altitude Authorization and Notification Capability) approvals for controlled airspace and submit special use airspace requests when required. This process typically takes 1-3 business days depending on the location."
      },
      {
        question: "What weather conditions affect drone operations?",
        answer: "Drone operations are weather-dependent. Flights are cancelled or rescheduled for: winds exceeding 25 mph, precipitation, fog with visibility less than 3 miles, and temperatures below 14°F or above 104°F. I monitor weather conditions closely and will reschedule if safety is compromised."
      }
    ]
  },
  {
    title: "Services & Deliverables",
    icon: Camera,
    color: "text-[hsl(199,89%,48%)]",
    faqs: [
      {
        question: "What's included in a typical photogrammetry project?",
        answer: "Standard deliverables include: high-resolution orthomosaic maps, digital surface models (DSM), point clouds, 3D textured models, and measurement reports. All data is provided in industry-standard formats (GeoTIFF, LAS, PLY, FBX) and includes metadata and accuracy reports."
      },
      {
        question: "How accurate are your survey-grade measurements?",
        answer: "Accuracy depends on the method and ground control points used. With RTK/PPK GPS and ground control points, horizontal accuracy is typically 1-3cm and vertical accuracy is 2-5cm. For standard mapping without GCPs, accuracy ranges from 1-3 meters, suitable for most planning and monitoring applications."
      },
      {
        question: "Can you integrate with existing CAD/BIM workflows?",
        answer: "Absolutely. I deliver data in formats compatible with AutoCAD, Revit, SketchUp, ArcGIS, and other professional software. Point clouds can be directly imported into Autodesk ReCap, and I can provide specific coordinate systems to match your existing project requirements."
      },
      {
        question: "Do you provide LiDAR scanning services?",
        answer: "Yes, I offer terrestrial LiDAR scanning for detailed interior and close-range exterior mapping. This technology captures sub-centimeter accuracy and is ideal for as-built documentation, heritage preservation, and complex structural analysis where photogrammetry limitations exist."
      }
    ]
  },
  {
    title: "Project Timeline & Costs",
    icon: Clock,
    color: "text-[hsl(158,64%,52%)]",
    faqs: [
      {
        question: "How long does a typical mapping project take?",
        answer: "Project timelines vary by scope: Small sites (1-5 acres): 1-2 days field work, 3-5 days processing. Medium sites (5-50 acres): 2-3 days field work, 5-10 days processing. Large sites (50+ acres): 3-7 days field work, 10-15 days processing. Rush delivery is available for 25% additional cost."
      },
      {
        question: "What factors affect project pricing?",
        answer: "Pricing is based on: site size and complexity, required accuracy level, deliverable formats needed, travel distance from Nashville metro area, timeline requirements, and special permits or airspace authorizations required. Contact me for a detailed quote based on your specific needs."
      },
      {
        question: "Do you offer multi-phase monitoring services?",
        answer: "Yes, I provide ongoing construction progress monitoring and change detection services. Multi-phase contracts include baseline mapping, scheduled progress flights, automated change detection analysis, and progress reporting. This typically reduces per-flight costs by 15-30%."
      },
      {
        question: "What's your service area coverage?",
        answer: "Primary service area covers middle Tennessee including Nashville metro, Murfreesboro, Franklin, and surrounding counties. I also travel throughout Tennessee and neighboring states for larger projects. Travel time and expenses are included in project quotes for sites beyond the primary service area."
      }
    ]
  },
  {
    title: "Equipment & Technology",
    icon: Settings,
    color: "text-[hsl(44,87%,47%)]",
    faqs: [
      {
        question: "What drone and camera equipment do you use?",
        answer: "Primary platform is the DJI Mini 4 Pro with 4K/60fps camera and mechanical 3-axis gimbal. For specialized applications, I also use the DJI Air 2S and various payload options. All equipment is regularly calibrated and maintained according to manufacturer specifications."
      },
      {
        question: "What software do you use for processing?",
        answer: "I use professional photogrammetry software including Agisoft Metashape, RealityCapture, and PIX4D for data processing. Point cloud analysis is performed in CloudCompare and AutoDesk ReCap. This ensures compatibility with your existing workflows and industry-standard output quality."
      },
      {
        question: "How do you ensure data quality and accuracy?",
        answer: "Quality assurance includes: pre-flight mission planning with overlap verification, real-time image quality monitoring, ground control point placement with RTK GPS, automated quality reports during processing, and final accuracy verification against known coordinates."
      },
      {
        question: "Can you capture thermal or multispectral data?",
        answer: "Currently focused on high-resolution RGB photogrammetry and LiDAR. For thermal or multispectral requirements, I partner with specialized operators who have the appropriate sensors and certifications for agricultural, environmental, or industrial inspection applications."
      }
    ]
  },
  {
    title: "Data Security & Legal",
    icon: Shield,
    color: "text-[hsl(280,65%,60%)]",
    faqs: [
      {
        question: "How is my project data protected?",
        answer: "All data is encrypted during transfer and storage. Raw imagery and processed deliverables are stored on secure, backed-up servers with access limited to authorized personnel. Data retention policies and confidentiality agreements are available for sensitive projects."
      },
      {
        question: "Do you carry insurance for drone operations?",
        answer: "Yes, I maintain comprehensive commercial drone insurance including general liability, professional liability, and equipment coverage. Certificates of insurance can be provided to clients and their insurance companies as required for project compliance."
      },
      {
        question: "Who owns the rights to captured images and data?",
        answer: "Clients retain full ownership rights to all deliverable data and processed outputs upon final payment. Raw imagery and flight data are retained for backup purposes according to our data retention policy, but ownership transfers to the client."
      },
      {
        question: "Can you work on secure or restricted sites?",
        answer: "Yes, I can work on secure facilities with proper authorization. This includes background checks, site-specific safety training, escort requirements, and modified data handling procedures as needed. Additional time and costs may apply for security compliance."
      }
    ]
  }
];

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
              Frequently Asked <span className="text-[hsl(199,89%,48%)]">Questions</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to know about reality capture services, drone regulations, 
              project timelines, and working with Six1Five Studio.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => {
              const IconComponent = category.icon;
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
            <h2 className="text-2xl font-bold mb-4 text-white">Still Have Questions?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? I'm here to help with any specific questions 
              about your project requirements, technical specifications, or service details.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#contact">
                <Button variant="secondary" className="bg-white text-[hsl(24,95%,53%)] hover:bg-gray-100">
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
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Get Consultation
                </Button>
              </Link>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <DollarSign className="w-8 h-8 text-[hsl(199,89%,48%)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Custom Pricing</h3>
              <p className="text-gray-400 text-sm mb-4">Large project or ongoing monitoring needs?</p>
              <Link href="/#contact">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Request Quote
                </Button>
              </Link>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
              <MapPin className="w-8 h-8 text-[hsl(158,64%,52%)] mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Service Area</h3>
              <p className="text-gray-400 text-sm mb-4">Questions about coverage in your location?</p>
              <Link href="/#contact">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
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