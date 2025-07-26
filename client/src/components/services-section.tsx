import { Plane, CameraIcon, Crosshair, LucideIcon } from "lucide-react";

interface ServiceData {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  workflow: string[];
}

interface ServiceCardProps {
  service: ServiceData;
}

function ServiceCard({ service }: ServiceCardProps) {
  const IconComponent = service.icon;
  
  return (
    <div className="bg-[#1e1e1e] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 flex flex-col items-center text-center group hover:-translate-y-2">
      <div className="mb-8">
        <IconComponent className={`w-20 h-20 ${
          service.color === 'drone-orange' ? 'text-[hsl(24,95%,53%)]' : 
          service.color === 'sky-blue' ? 'text-[hsl(199,89%,48%)]' : 
          'text-[hsl(158,64%,52%)]'
        } group-hover:scale-110 transition-transform duration-300`} />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
      
      <p className="text-sm text-gray-400 mb-8 leading-relaxed">{service.subtitle}</p>
      
      <div className="mt-auto w-full">
        <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wide">
          Key Benefits
        </h4>
        <ul className="space-y-3 text-xs text-gray-300 mb-6">
          {service.workflow.map((item, index) => (
            <li key={index} className="flex items-start text-left">
              <span className="w-1.5 h-1.5 bg-[hsl(24,95%,53%)] rounded-full mr-3 mt-1.5 flex-shrink-0"></span>
              {item.replace('• ', '')}
            </li>
          ))}
        </ul>
        <button className="text-[hsl(199,89%,48%)] hover:text-white text-sm font-medium transition-colors">
          Learn More →
        </button>
      </div>
    </div>
  );
}

const servicesData = [
  {
    icon: Plane,
    title: "Aerial Capture",
    subtitle: "DJI Mini 4 Pro drone mapping for large-scale projects",
    color: "drone-orange",
    bgColor: "bg-[hsl(24,95%,53%)]",
    workflow: [
      "Flight planning & automated execution",
      "High-resolution aerial photography", 
      "Real-time progress monitoring",
      "Weather-optimized scheduling"
    ]
  },
  {
    icon: CameraIcon,
    title: "Photogrammetry",
    subtitle: "Multi-angle photo reconstruction with mm precision", 
    color: "sky-blue",
    bgColor: "bg-[hsl(199,89%,48%)]",
    workflow: [
      "Structured light scanning capability",
      "Sub-millimeter accuracy levels",
      "Texture-mapped 3D models", 
      "Multiple export formats"
    ]
  },
  {
    icon: Crosshair,
    title: "LiDAR Integration",
    subtitle: "Precision point cloud scanning and BIM workflows",
    color: "tech-green", 
    bgColor: "bg-[hsl(158,64%,52%)]",
    workflow: [
      "FARO & Leica scanner compatibility",
      "Cloud-to-mesh processing",
      "Revit & AutoCAD integration",
      "As-built documentation"
    ]
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-[hsl(199,89%,48%)]">Capture</span> Workflows
        </h2>
        
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {servicesData.map((service, index) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gray-800 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to capture your project?
            </h3>
            <p className="text-gray-400 mb-6">
              Get a custom quote based on your specific requirements and timeline.
            </p>
            <button className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
              Get Free Quote →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
