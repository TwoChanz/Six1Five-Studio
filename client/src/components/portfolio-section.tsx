import { Button } from "@/components/ui/button";
import { Play, Layers, GraduationCap } from "lucide-react";

const projects = [
  {
    title: "Watchtower | Shooting House — Photogrammetry Scan",
    role: "Aerial drone mapping, 3D reconstruction",
    deliverable: "Interactive 3D model + Sketchfab viewer", 
    tools: "DJI Mini 4 Pro, Photogrammetry Pipeline, Sketchfab",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    buttonText: "View on Sketchfab",
    buttonColor: "bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]",
    icon: Play,
    iconColor: "text-[hsl(24,95%,53%)]"
  },
  {
    title: "Construction Progress Monitoring",
    role: "Monthly progress scans, data analysis",
    deliverable: "Progress reports + 3D comparisons",
    tools: "DJI Mini 4 Pro, Metashape, CloudCompare", 
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    buttonText: "View Timeline",
    buttonColor: "bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)]",
    icon: Layers,
    iconColor: "text-[hsl(199,89%,48%)]",
    reverse: true
  },
  {
    title: "Historic Building Documentation", 
    role: "LiDAR scanning, heritage documentation",
    deliverable: "CAD models + Virtual tour",
    tools: "FARO SCENE, Revit, WebGL",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    buttonText: "Explore Model", 
    buttonColor: "bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,47%)]",
    icon: GraduationCap,
    iconColor: "text-[hsl(158,64%,52%)]"
  }
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Featured <span className="text-[hsl(199,89%,48%)]">Captures</span>
        </h2>
        <div className="space-y-16">
          {projects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <div 
                key={project.title} 
                className={`grid lg:grid-cols-2 gap-12 items-center ${project.reverse ? 'lg:grid-flow-col-dense' : ''}`}
              >
                <div className={project.reverse ? 'lg:col-start-2' : ''}>
                  <h3 className="text-3xl font-semibold mb-4">{project.title}</h3>
                  <p className="text-gray-400 mb-6">
                    {project.title === "Watchtower | Shooting House — Photogrammetry Scan" 
                      ? "Complete photogrammetry reconstruction of a shooting house watchtower using aerial drone mapping. This interactive 3D model showcases precise detail capture and texture mapping for structural analysis."
                      : project.title === "Construction Progress Monitoring"
                      ? "Multi-phase construction documentation with drone mapping and progress tracking, providing stakeholders with detailed visual reports."
                      : "Comprehensive LiDAR scanning and photogrammetry of historic architecture for preservation records and virtual museum exhibits."
                    }
                  </p>
                  <div className="space-y-2 mb-8">
                    <div className="flex items-center space-x-3">
                      <span className="text-[hsl(24,95%,53%)] font-semibold">Role:</span>
                      <span>{project.role}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[hsl(199,89%,48%)] font-semibold">Deliverable:</span>
                      <span>{project.deliverable}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[hsl(158,64%,52%)] font-semibold">Tools:</span>
                      <span>{project.tools}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      if (project.title === "Watchtower | Shooting House — Photogrammetry Scan") {
                        window.open("https://sketchfab.com/3d-models/watchtower-shooting-house-f066d332c0d145c3b90ad32efde4b4a9", "_blank");
                      }
                    }}
                    className={`${project.buttonColor} text-white px-8 py-3 rounded-lg font-semibold transition-colors`}
                  >
                    {project.buttonText}
                  </Button>
                </div>
                <div className={`relative ${project.reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-gray-800 rounded-xl p-6 scanline-effect">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="rounded-lg w-full h-auto" 
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                      <div className="text-center">
                        <IconComponent className={`w-16 h-16 ${project.iconColor} mb-4`} />
                        <p className="text-white font-semibold">
                          {project.title === "Watchtower | Shooting House — Photogrammetry Scan" 
                            ? "View 3D Model" 
                            : project.title === "Construction Progress Monitoring"
                            ? "Progress Timeline"
                            : "Virtual Tour"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
