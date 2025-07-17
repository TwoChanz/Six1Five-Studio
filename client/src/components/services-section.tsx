import FlipCard from "./flip-card";
import { Plane, CameraIcon, Crosshair } from "lucide-react";

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
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="text-[hsl(199,89%,48%)]">Capture</span> Workflows
        </h2>
        <div className="flex flex-row gap-8 justify-center overflow-x-auto">
          {servicesData.map((service, index) => (
            <FlipCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
