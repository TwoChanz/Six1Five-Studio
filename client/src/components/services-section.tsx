import { Plane, CameraIcon, Crosshair, Bot, Home, Building, LucideIcon } from "lucide-react";

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
  
  const getGlowColor = (color: string) => {
    switch(color) {
      case 'drone-orange': return '#ff6600';
      case 'sky-blue': return '#00aaff';
      case 'tech-green': return '#33cc99';
      default: return '#ff6600';
    }
  };

  const getBackContent = (title: string) => {
    switch(title) {
      case 'Photogrammetry': return 'Precise 3D models from aerial photography with sub-centimeter accuracy';
      case 'LiDAR Scanning': return 'Millimeter-precise point clouds for engineering-grade documentation';
      case '3D Reconstruction': return 'Professional 3D assets ready for CAD, VR, and visualization workflows';
      case 'Automated Mapping': return 'Autonomous aerial mapping with repeatable flight paths and progress tracking';
      case 'Virtual Tours': return 'Immersive 360° experiences with interactive hotspots and measurements';
      case 'Scan-to-BIM': return 'LOD 300+ BIM models from laser scan data for renovation projects';
      default: return 'Professional reality capture solutions for your project needs';
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
            {getBackContent(service.title)}
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

const servicesData = [
  {
    icon: CameraIcon,
    title: "Photogrammetry",
    subtitle: "Transform photos into precise 3D models with millimeter accuracy", 
    color: "drone-orange",
    bgColor: "bg-[hsl(24,95%,53%)]",
    workflow: [
      "Sub-millimeter accuracy levels",
      "Texture-mapped 3D models", 
      "Multiple export formats",
      "Construction documentation"
    ]
  },
  {
    icon: Crosshair,
    title: "LiDAR Scanning",
    subtitle: "High-resolution point cloud data for detailed site analysis",
    color: "sky-blue", 
    bgColor: "bg-[hsl(199,89%,48%)]",
    workflow: [
      "FARO & Leica scanner compatibility",
      "Cloud-to-mesh processing",
      "Revit & AutoCAD integration",
      "As-built documentation"
    ]
  },
  {
    icon: Building,
    title: "3D Reconstruction",
    subtitle: "Convert reality capture data into actionable 3D models",
    color: "tech-green",
    bgColor: "bg-[hsl(158,64%,52%)]",
    workflow: [
      "Reality capture data processing",
      "CAD-ready mesh generation",
      "Design workflow integration",
      "Planning optimization"
    ]
  },
  {
    icon: Bot,
    title: "Automated Mapping",
    subtitle: "Automated drone missions for large-scale site mapping",
    color: "drone-orange",
    bgColor: "bg-[hsl(24,95%,53%)]",
    workflow: [
      "Flight planning & automated execution",
      "Large-scale site mapping",
      "Real-time progress monitoring",
      "Weather-optimized scheduling"
    ]
  },
  {
    icon: Home,
    title: "Virtual Tours",
    subtitle: "Interactive 3D experiences for real estate marketing",
    color: "sky-blue",
    bgColor: "bg-[hsl(199,89%,48%)]",
    workflow: [
      "360° immersive experiences",
      "Interactive hotspot integration",
      "Real estate marketing tools",
      "Facility management solutions"
    ]
  },
  {
    icon: Plane,
    title: "Scan-to-BIM",
    subtitle: "Convert point clouds to Building Information Models",
    color: "tech-green",
    bgColor: "bg-[hsl(158,64%,52%)]",
    workflow: [
      "Point cloud to BIM conversion",
      "LOD 300+ model accuracy",
      "Renovation project support",
      "Retrofit documentation"
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
        
        {/* Single Horizontal Row */}
        <div className="flex flex-wrap justify-center gap-4 mt-10 max-w-7xl mx-auto">
          {servicesData.map((service, index) => (
            <div key={service.title} className="flex-1 min-w-[180px] max-w-[200px]">
              <ServiceCard service={service} />
            </div>
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
            <button
              onClick={() => {
                const contactElement = document.getElementById('contact');
                if (contactElement) {
                  contactElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Get Free Quote →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
