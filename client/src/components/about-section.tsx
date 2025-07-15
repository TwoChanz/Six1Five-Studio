import { MapPin, Award, Settings, Info, CheckCircle } from "lucide-react";
import { useState } from "react";
import profileImage from "@assets/2025-07-15_10.39.28_1752594500456.png";

interface TechTagProps {
  name: string;
  tooltip: string;
}

function TechTag({ name, tooltip }: TechTagProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="inline-flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 text-[hsl(158,64%,52%)] rounded-md text-sm cursor-pointer transition-colors border border-gray-600 hover:border-[hsl(158,64%,52%)]">
        <CheckCircle className="w-3 h-3 mr-1" />
        {name}
      </span>
      {showTooltip && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg border border-gray-600 whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Meet the <span className="text-[hsl(24,95%,53%)]">Scanner</span>
            </h2>
            
            {/* Punchy Opening Line */}
            <div className="mb-6">
              <p className="text-xl font-semibold text-[hsl(24,95%,53%)] mb-4">
                From farm foundations to digital replicas—bringing real-world sites into stunning 3D.
              </p>
            </div>

            {/* Matthew Byrd Quote Integration */}
            <div className="bg-gray-800 border-l-4 border-[hsl(158,64%,52%)] p-4 mb-6 rounded-r-lg">
              <blockquote className="text-gray-300 italic mb-2">
                "The great thing about reality capturing is you can combine the data that is captured by multiple technology types into one model."
              </blockquote>
              <p className="text-sm text-gray-400">— Matthew Byrd, Nexus 3D Consulting</p>
            </div>

            <p className="text-gray-400 mb-6">
              I'm <span className="text-[hsl(199,89%,48%)] font-semibold">Chandler Hopkins</span>, Operations Shift Leader at Estes Express Lines with an MTSU Construction Management background. I combine practical logistics experience with cutting-edge reality capture technologies to deliver precise digital twins for AEC, real estate, and historic preservation projects.
            </p>

            {/* Interactive Tech Tags */}
            <div className="mb-6">
              <h4 className="font-semibold text-[hsl(199,89%,48%)] mb-3">Core Technologies</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <TechTag 
                  name="RealityCapture" 
                  tooltip="Photogrammetry tool for high-resolution 3D reconstruction" 
                />
                <TechTag 
                  name="Metashape" 
                  tooltip="Professional photogrammetry software for aerial and terrestrial mapping" 
                />
                <TechTag 
                  name="CloudCompare" 
                  tooltip="Point-cloud editing and comparison tool for LiDAR and photogrammetry data" 
                />
                <TechTag 
                  name="FARO SCENE" 
                  tooltip="3D point cloud processing software for LiDAR scanning workflows" 
                />
                <TechTag 
                  name="LiDAR Scanning" 
                  tooltip="Laser-based method for capturing precise spatial data and measurements" 
                />
                <TechTag 
                  name="NeRFs" 
                  tooltip="Neural Radiance Fields for AI-powered 3D scene reconstruction" 
                />
                <TechTag 
                  name="Gaussian Splatting" 
                  tooltip="Advanced 3D rendering technique for photorealistic scene representation" 
                />
              </div>
            </div>

            {/* Service Area with Map Icon */}
            <div className="flex items-center space-x-3 text-[hsl(24,95%,53%)] font-semibold">
              <MapPin className="w-5 h-5" />
              <span>📍 Service Area: Nashville Region</span>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-800 rounded-xl p-6 scanline-effect">
              <img 
                src={profileImage}
                alt="Chandler Hopkins, Founder of Six1Five Studio" 
                className="rounded-lg w-full h-auto object-cover aspect-square" 
              />
              <div className="mt-4 text-center">
                <h4 className="font-semibold text-white">Chandler Hopkins</h4>
                <p className="text-sm text-gray-400">Founder & Reality Capture Specialist</p>
                <div className="flex flex-col gap-1 mt-2">
                  <a 
                    href="https://www.linkedin.com/in/chandler-hopkins-924005112/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[hsl(199,89%,48%)] hover:text-white transition-colors text-sm"
                  >
                    Connect on LinkedIn →
                  </a>
                  <a 
                    href="https://digitalblueprint.substack.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[hsl(158,64%,52%)] hover:text-white transition-colors text-sm"
                  >
                    Read Digital Blueprint →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
