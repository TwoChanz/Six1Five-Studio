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
        <div className="flex justify-center overflow-x-auto pb-4">
          <div className="flex flex-row gap-4 md:gap-6 lg:gap-8 flex-nowrap px-4 md:px-6 lg:px-0">
            {servicesData.map((service, index) => (
              <div key={service.title} className="flex-shrink-0 w-72 sm:w-80 md:w-72 lg:w-80 xl:w-96">
                <FlipCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
