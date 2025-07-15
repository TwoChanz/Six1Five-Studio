import { MapPin, Award, Settings } from "lucide-react";
import profileImage from "@assets/2025-07-15_10.39.28_1752594500456.png";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-8">
              Meet the <span className="text-[hsl(24,95%,53%)]">Scanner</span>
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              I'm <span className="text-[hsl(199,89%,48%)] font-semibold">Chandler Hopkins</span> — a Reality Capture specialist and founder of Six1Five Studio. With a Construction Management degree from MTSU and hands-on experience in AEC workflows, I specialize in photogrammetry, LiDAR scanning, and 3D reconstruction for construction, infrastructure, and historic preservation.
            </p>
            <p className="text-gray-400 mb-6">
              Based in La Vergne, Tennessee, I work with RealityCapture, Metashape, CloudCompare, and FARO SCENE to process high-resolution photogrammetry models and LiDAR point clouds. My expertise extends to 360 cameras, drone imagery, and advanced reconstruction methods like NeRFs and Gaussian Splatting.
            </p>
            <p className="text-gray-400 mb-8">
              Currently serving as Operations Shift Leader at Estes Express Lines, I bring practical logistics experience to reality capture projects. I'm passionate about integrating AI, automation, and digital twins into Reality Capture solutions, driving innovation in the built environment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-5 h-5 text-[hsl(24,95%,53%)]" />
                  <span>La Vergne, Tennessee + Regional</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Award className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                  <span>MTSU Construction Management</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Settings className="w-5 h-5 text-[hsl(158,64%,52%)]" />
                  <span>Operations Shift Leader</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-[hsl(199,89%,48%)]">Technical Skills</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• RealityCapture & Metashape</li>
                  <li>• CloudCompare & FARO SCENE</li>
                  <li>• NeRFs & Gaussian Splatting</li>
                  <li>• Blueprint Reading & ACI Testing</li>
                  <li>• Digital Twins & AI Integration</li>
                </ul>
              </div>
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
