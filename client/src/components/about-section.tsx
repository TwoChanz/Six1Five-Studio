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
              I'm <span className="text-[hsl(199,89%,48%)] font-semibold">Chandler Hopkins</span>, founder of Six1Five Studio. With a background rooted in construction, agriculture, and AEC tech, I specialize in bringing physical sites into high-precision 3D models using drones, LiDAR, and photogrammetry. I began my journey studying Construction Management at MTSU and built my skills hands-on — from logistics yards to field operations.
            </p>
            <p className="text-gray-400 mb-6">
              My practical experience gives me deep insight into site conditions, project workflows, and the realities that make Reality Capture essential for modern project execution, digital twins, and preservation.
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

            {/* Service Area with Glowing Location Pin and Tennessee Background */}
            <div className="relative">
              {/* Large Tennessee state outline background */}
              <div className="absolute -left-16 -top-8 w-80 h-32 opacity-10 pointer-events-none">
                <svg 
                  width="320" 
                  height="128" 
                  viewBox="0 0 320 128" 
                  fill="none" 
                  className="w-full h-full text-[hsl(24,95%,53%)]"
                >
                  {/* Tennessee state outline */}
                  <path 
                    d="M20 60 L25 45 Q30 35, 40 38 L55 35 Q70 32, 85 35 L100 33 Q120 30, 140 33 L160 31 Q180 28, 200 31 L220 33 Q240 36, 260 40 L280 45 Q300 50, 305 60 Q300 75, 285 85 L270 90 Q250 95, 230 92 L210 95 Q190 98, 170 95 L150 97 Q130 100, 110 97 L90 95 Q70 92, 50 88 L30 85 Q20 75, 20 60 Z" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    fill="none" 
                    strokeDasharray="4,3"
                  />
                  {/* Nashville metro area highlight */}
                  <circle cx="160" cy="65" r="25" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.4" strokeDasharray="2,4"/>
                </svg>
              </div>
              
              {/* Foreground content with glowing location pin */}
              <div className="relative z-10 flex items-center space-x-3 text-[hsl(24,95%,53%)] font-semibold">
                <div className="relative">
                  {/* Glowing effect with custom animation */}
                  <div 
                    className="absolute inset-0 w-5 h-5 bg-[hsl(24,95%,53%)] rounded-full" 
                    style={{
                      animation: 'location-glow 2s ease-in-out infinite'
                    }}
                  ></div>
                  {/* Location pin */}
                  <MapPin className="relative w-5 h-5 drop-shadow-lg" />
                </div>
                
                {/* Text with subtle map overlay */}
                <div className="relative">
                  {/* Subtle Nashville metro outline behind text */}
                  <div className="absolute -left-4 -top-2 w-48 h-8 opacity-8 pointer-events-none">
                    <svg 
                      width="192" 
                      height="32" 
                      viewBox="0 0 192 32" 
                      fill="none" 
                      className="w-full h-full text-[hsl(24,95%,53%)]"
                    >
                      {/* Simplified Nashville metro area outline */}
                      <path 
                        d="M8 16 Q12 12, 20 14 L35 12 Q50 10, 65 12 L80 11 Q95 9, 110 11 L125 12 Q140 14, 155 16 Q170 18, 184 20 Q180 24, 170 26 L155 28 Q140 30, 125 28 L110 29 Q95 31, 80 29 L65 30 Q50 32, 35 30 L20 28 Q12 26, 8 20 Q6 18, 8 16 Z" 
                        stroke="currentColor" 
                        strokeWidth="0.5" 
                        fill="none" 
                        opacity="0.6"
                        strokeDasharray="2,1"
                      />
                      {/* Nashville center point */}
                      <circle cx="96" cy="20" r="1" fill="currentColor" opacity="0.4"/>
                    </svg>
                  </div>
                  <span className="relative z-10">Service Area: Nashville Region</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-800 rounded-xl p-6 scanline-effect shadow-2xl">
              {/* Profile image with gradient frame and margin */}
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-[hsl(24,95%,53%)] via-[hsl(199,89%,48%)] to-[hsl(218,11%,15%)] shadow-lg">
                <div className="bg-gray-900 rounded-lg p-3 shadow-inner">
                  <img 
                    src={profileImage}
                    alt="Chandler Hopkins, Founder of Six1Five Studio" 
                    className="rounded-md w-full h-auto object-cover aspect-square shadow-md" 
                  />
                </div>
              </div>
              
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
