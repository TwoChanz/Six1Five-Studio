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
              I'm <span className="text-[hsl(199,89%,48%)] font-semibold">Chandler Hopkins</span> — a Reality Capture specialist and founder of Six1Five Studio, transforming physical spaces into precise 3D digital assets for architecture, engineering, construction, real estate, and historic preservation projects.
            </p>
            <p className="text-gray-400 mb-6">
              Based in Nashville, TN, I combine advanced drone technology, terrestrial LiDAR scanning, and photogrammetry techniques to deliver comprehensive spatial data solutions. My work bridges the gap between physical reality and digital workflows, enabling better decision-making through accurate 3D documentation.
            </p>
            <p className="text-gray-400 mb-8">
              From construction progress monitoring to heritage preservation, I provide end-to-end reality capture services that transform how professionals visualize, analyze, and interact with spatial data.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-5 h-5 text-[hsl(24,95%,53%)]" />
                  <span>Nashville, TN + Regional Coverage</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Award className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                  <span>FAA Part 107 Licensed</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Settings className="w-5 h-5 text-[hsl(158,64%,52%)]" />
                  <span>Professional Reality Capture</span>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-[hsl(199,89%,48%)]">Core Expertise</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Aerial Photogrammetry & Mapping</li>
                  <li>• LiDAR Point Cloud Processing</li>
                  <li>• 3D Model Reconstruction</li>
                  <li>• Construction Documentation</li>
                  <li>• Historic Preservation Scanning</li>
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
                <a 
                  href="https://www.linkedin.com/in/chandler-hopkins-924005112/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-[hsl(199,89%,48%)] hover:text-white transition-colors text-sm"
                >
                  Connect on LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
