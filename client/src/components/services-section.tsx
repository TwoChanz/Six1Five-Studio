import { Plane, CameraIcon, Crosshair, Bot, Home, Building, Settings, Shield, LucideIcon } from "lucide-react";
import servicesData from "@/data/services.json";

interface ServiceData {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  backContent: string;
  workflow: string[];
}

interface ServiceCardProps {
  service: ServiceData;
}

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  CameraIcon,
  Crosshair,
  Building,
  Bot,
  Home,
  Plane,
  Settings,
  Shield
};

function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || CameraIcon;
  
  const getGlowColor = (color: string) => {
    switch(color) {
      case 'drone-orange': return '#ff6600';
      case 'sky-blue': return '#00aaff';
      case 'tech-green': return '#33cc99';
      default: return '#ff6600';
    }
  };

  
  return (
    <div className="flip-card-container perspective-1000 h-[180px] w-full">
      <div className="flip-card-inner relative w-full h-full transition-transform duration-600 ease-in-out transform-style-preserve-3d hover:scale-105">
        {/* Front of card - Minimal Design */}
        <div className="flip-card-front absolute inset-0 w-full h-full backface-hidden bg-[#1e1e1e] rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-600" 
             style={{'--glow-color': getGlowColor(service.color)} as any}>
          <div className="mb-4">
            <IconComponent className={`w-12 h-12 ${
              service.color === 'drone-orange' ? 'text-[hsl(24,95%,53%)]' : 
              service.color === 'sky-blue' ? 'text-[hsl(199,89%,48%)]' : 
              'text-[hsl(158,64%,52%)]'
            } transition-transform duration-300`} />
          </div>
          
          <h3 className="text-lg font-bold text-white">{service.title}</h3>
        </div>

        {/* Back of card - Detailed Info */}
        <div className="flip-card-back absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#1e1e1e] rounded-xl shadow-md p-4 flex flex-col justify-center text-center"
             style={{boxShadow: `0 0 20px ${getGlowColor(service.color)}33`}}>
          <div className="mb-3">
            <IconComponent className={`w-8 h-8 ${
              service.color === 'drone-orange' ? 'text-[hsl(24,95%,53%)]' : 
              service.color === 'sky-blue' ? 'text-[hsl(199,89%,48%)]' : 
              'text-[hsl(158,64%,52%)]'
            } mx-auto animate-pulse`} />
          </div>
          
          <h3 className="text-md font-bold text-white mb-2">{service.title}</h3>
          
          <p className="text-xs text-gray-300 leading-relaxed mb-3">
            {service.backContent}
          </p>
          
          <ul className="space-y-1 text-xs text-gray-400 mb-3">
            {service.workflow.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-center justify-center">
                <span className="w-1 h-1 bg-[hsl(24,95%,53%)] rounded-full mr-2"></span>
                {item.replace('• ', '')}
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => {
              const contactElement = document.getElementById('contact');
              if (contactElement) {
                contactElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-[hsl(199,89%,48%)] hover:text-white text-xs font-medium transition-colors"
          >
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-[hsl(199,89%,48%)]">{servicesData.sectionTitle.split(' ')[0]}</span> {servicesData.sectionTitle.split(' ').slice(1).join(' ')}
        </h2>
        
        {/* Single Horizontal Row */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 max-w-7xl mx-auto">
          {servicesData.services.map((service, index) => (
            <div key={service.title} className="flex-1 min-w-[180px] max-w-[200px]">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {servicesData.ctaTitle}
            </h3>
            <p className="text-gray-400 mb-6">
              {servicesData.ctaDescription}
            </p>
            <button
              onClick={() => {
                const contactElement = document.getElementById('contact');
                if (contactElement) {
                  contactElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              {servicesData.ctaButtonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
