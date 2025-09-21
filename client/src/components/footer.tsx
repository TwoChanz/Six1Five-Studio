import { Users, Globe, FileText } from "lucide-react";
import logoImage from "@/assets/six1five-logo.png";
import logoHorizontalWhite from "@/assets/logo-horizontal-clean-bg.png";

export default function Footer() {
  return (
    <footer className="bg-[hsl(218,11%,15%)] border-t border-gray-700 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src={logoHorizontalWhite} 
                alt="SixlFive Studio - Reality Capture Specialists" 
                className="h-12 w-auto filter drop-shadow-lg"
                style={{
                  filter: 'drop-shadow(0 0 8px var(--logo-blue))'
                }}
              />
            </div>
            <p className="text-gray-400 mb-4">
              Reality Capture specialists transforming physical spaces into digital assets for AEC, real estate, and historic preservation.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://www.linkedin.com/in/chandler-hopkins-924005112/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-gray-400 hover:text-[var(--primary-blue)] transition-all duration-300 transform hover:scale-110"
              >
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-[var(--primary-blue)] transition-all duration-300">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">LinkedIn</span>
              </a>
              <a 
                href="https://sketchfab.com/six1fivemedia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-gray-400 hover:text-[var(--logo-blue)] transition-all duration-300 transform hover:scale-110"
                title="View 3D Models on Sketchfab"
              >
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-[var(--logo-blue)] transition-all duration-300">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">3D Models</span>
              </a>
              <a 
                href="https://digitalblueprint.substack.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-gray-400 hover:text-[hsl(158,64%,52%)] transition-all duration-300 transform hover:scale-110"
                title="Digital Blueprint on Substack"
              >
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-[hsl(158,64%,52%)] transition-all duration-300">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Newsletter</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Drone Mapping</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">LiDAR Scanning</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Photogrammetry</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">3D Reconstruction</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Nashville, Tennessee</li>
              <li>(931) 588-8997</li>
              <li>admin@six1fivestudio.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Six1Five Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
