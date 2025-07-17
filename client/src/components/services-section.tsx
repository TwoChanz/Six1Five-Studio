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
    <div className="bg-[#1e1e1e] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col items-center text-center group hover:-translate-y-2">
      <div className="mb-6">
        <IconComponent className={`w-16 h-16 ${
          service.color === 'drone-orange' ? 'text-[hsl(24,95%,53%)]' : 
          service.color === 'sky-blue' ? 'text-[hsl(199,89%,48%)]' : 
          'text-[hsl(158,64%,52%)]'
        } group-hover:scale-110 transition-transform duration-300`} />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
      
      <p className="text-sm text-gray-400 mb-6 leading-relaxed">{service.subtitle}</p>
      
      <div className="mt-auto">
        <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
          {service.title === "Photogrammetry" ? "Pipeline" : service.title === "LiDAR Integration" ? "Tools" : "Workflow"}
        </h4>
        <ul className="space-y-2 text-xs text-gray-300">
          {service.workflow.map((item, index) => (
            <li key={index} className="flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
              {item.replace('• ', '')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const servicesData = [
  {
    icon: Plane,
    title: "Aerial Capture",
    subtitle: "DJI Mini 4 Pro drone mapping",
    color: "drone-orange",
    bgColor: "bg-[hsl(24,95%,53%)]",
    workflow: [
      "• Flight planning & execution",
      "• RealityCapture processing", 
      "• Metashape reconstruction",
      "• Textured 3D model output"
    ]
  },
  {
    icon: CameraIcon,
    title: "Photogrammetry",
    subtitle: "Multi-angle photo reconstruction", 
    color: "sky-blue",
    bgColor: "bg-[hsl(199,89%,48%)]",
    workflow: [
      "• Raw image capture",
      "• Feature alignment",
      "• Mesh generation", 
      "• Texture mapping"
    ]
  },
  {
    icon: Crosshair,
    title: "LiDAR Integration",
    subtitle: "Precision point cloud scanning",
    color: "tech-green", 
    bgColor: "bg-[hsl(158,64%,52%)]",
    workflow: [
      "• FARO SCENE processing",
      "• CloudCompare analysis",
      "• Revit BIM integration",
      "• CAD-ready outputs"
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
          <button className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            Request a Free Quote
          </button>
        </div>
      </div>
    </section>
  );
}
