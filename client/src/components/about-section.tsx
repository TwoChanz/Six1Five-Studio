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

            {/* Service Area with Enhanced Tennessee Background */}
            <div className="relative overflow-visible pt-2 pb-2">
              {/* Tennessee state outline background - enhanced visibility */}
              <div className="absolute -left-6 -top-3 w-full max-w-full h-auto opacity-[0.14] pointer-events-none">
                <svg 
                  width="100%" 
                  height="auto" 
                  viewBox="0 0 400 64" 
                  fill="none" 
                  className="w-full h-auto text-[hsl(28,100%,58%)] drop-shadow-sm"
                  style={{ aspectRatio: '6.25/1', objectFit: 'contain', maxWidth: '100%' }}
                >
                  {/* Full Tennessee state outline - horizontal orientation with enhanced stroke */}
                  <path 
                    d="M20 32 L30 18 Q40 12, 55 16 L75 14 Q95 10, 115 14 L135 12 Q155 8, 175 12 L195 10 Q215 6, 235 10 L255 12 Q275 16, 295 20 L315 24 Q335 28, 350 32 Q360 40, 355 48 L345 52 Q325 56, 305 52 L285 54 Q265 58, 245 54 L225 56 Q205 60, 185 56 L165 58 Q145 62, 125 58 L105 56 Q85 52, 65 48 L45 44 Q25 40, 20 32 Z" 
                    stroke="currentColor" 
                    strokeWidth="1.2" 
                    fill="none" 
                    strokeDasharray="6,4"
                    filter="drop-shadow(0 0 2px rgba(255, 133, 27, 0.3))"
                  />
                </svg>
              </div>
              
              {/* Foreground content with enhanced glowing location pin */}
              <div className="relative z-10 flex items-center space-x-3 text-[hsl(24,95%,53%)] font-semibold">
                <div className="relative">
                  {/* Enhanced glowing effect with blur */}
                  <div 
                    className="absolute inset-0 w-5 h-5 bg-[hsl(24,95%,53%)] rounded-full blur-sm" 
                    style={{
                      animation: 'location-glow 2s ease-in-out infinite'
                    }}
                  ></div>
                  {/* Secondary glow layer */}
                  <div 
                    className="absolute inset-0 w-5 h-5 bg-[hsl(24,95%,53%)] rounded-full opacity-40" 
                    style={{
                      animation: 'location-glow 2s ease-in-out infinite 0.5s'
                    }}
                  ></div>
                  {/* Location pin with enhanced shadow */}
                  <MapPin className="relative w-5 h-5 drop-shadow-lg filter drop-shadow-[0_0_8px_rgba(255,133,27,0.4)]" />
                </div>
                
                {/* Service area text with maintained branding */}
                <span className="relative z-10">Service Area: Nashville Region</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
              {/* Profile image with gradient frame and margin */}
              <div className="relative p-4 rounded-xl bg-gradient-to-br from-[hsl(24,95%,53%)] via-[hsl(199,89%,48%)] to-[hsl(218,11%,15%)] shadow-lg">
                <div className="bg-gray-900 rounded-xl p-3 shadow-inner overflow-hidden">
                  <div className="relative rounded-xl overflow-hidden">
                    <img 
                      src={profileImage}
                      alt="Chandler Hopkins, Founder of Six1Five Studio" 
                      className="w-full h-auto object-cover aspect-square shadow-md transform scale-95 object-top" 
                      style={{ objectPosition: 'center top' }}
                    />
                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 rounded-xl"></div>
                  </div>
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
                  <a 
                    href="#" 
                    className="text-[hsl(24,95%,53%)] hover:text-white transition-colors text-sm"
                  >
                    Download Resume →
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
