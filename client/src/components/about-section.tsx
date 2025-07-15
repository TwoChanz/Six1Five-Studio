import { MapPin, Award, Settings } from "lucide-react";

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
              I'm <span className="text-[hsl(199,89%,48%)] font-semibold">Chandler Hopkins</span> — a Reality Capture specialist transforming physical spaces into 3D assets for AEC, real estate, and historic preservation.
            </p>
            <p className="text-gray-400 mb-8">
              Based in Nashville, TN, I leverage cutting-edge drone technology, LiDAR scanning, and photogrammetry to deliver precise digital reconstructions that drive real-world results for my clients.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <MapPin className="w-5 h-5 text-[hsl(24,95%,53%)]" />
                <span>Nashville, TN + Surrounding Areas</span>
              </div>
              <div className="flex items-center space-x-4">
                <Award className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                <span>FAA Part 107 Licensed</span>
              </div>
              <div className="flex items-center space-x-4">
                <Settings className="w-5 h-5 text-[hsl(158,64%,52%)]" />
                <span>5+ Years in Reality Capture</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gray-800 rounded-xl p-6 scanline-effect">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Professional headshot of Chandler Hopkins" 
                className="rounded-lg w-full h-auto" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
