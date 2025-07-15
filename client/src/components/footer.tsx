import { Linkedin, ExternalLink, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[hsl(218,11%,15%)] border-t border-gray-700 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-mono text-sm">615</span>
              </div>
              <span className="text-xl font-semibold">Six1Five Studio</span>
            </div>
            <p className="text-gray-400 mb-4">
              Reality Capture specialists transforming physical spaces into digital assets for AEC, real estate, and historic preservation.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/chandler-hopkins-924005112/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[hsl(24,95%,53%)] transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a 
                href="https://sketchfab.com/six1fivemedia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[hsl(199,89%,48%)] transition-colors"
                title="View 3D Models on Sketchfab"
              >
                <ExternalLink className="w-6 h-6" />
              </a>
              <a 
                href="https://digitalblueprint.substack.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[hsl(158,64%,52%)] transition-colors"
                title="Digital Blueprint on Substack"
              >
                <BookOpen className="w-6 h-6" />
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
              <li>La Vergne, Tennessee</li>
              <li>(931) 588-8997</li>
              <li>hopkinsc1996@hotmail.com</li>
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
