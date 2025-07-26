import { Expand, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SketchfabViewer() {
  const openFullscreen = () => {
    window.open("https://sketchfab.com/3d-models/watchtower-shooting-house-f066d332c0d145c3b90ad32efde4b4a9", "_blank");
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 scanline-effect tech-glow">
      {/* Sketchfab embed */}
      <div className="aspect-video rounded-lg overflow-hidden">
        <iframe 
          title="Watchtower | Shooting House" 
          frameBorder="0" 
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          src="https://sketchfab.com/models/f066d332c0d145c3b90ad32efde4b4a9/embed?autostart=1&preload=1&ui_theme=dark&camera=0"
          className="w-full h-full rounded-lg"
        />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-left">
          <p className="text-white font-semibold">Watchtower | Shooting House</p>
          <p className="text-gray-400 text-sm">Interactive 3D photogrammetry scan</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={openFullscreen}
            className="text-[hsl(199,89%,48%)] hover:text-white transition-colors"
          >
            <Expand className="w-4 h-4 mr-2" />
            View on Sketchfab
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-[hsl(199,89%,48%)] hover:text-white transition-colors"
          >
            <Info className="w-4 h-4 mr-2" />
            Details
          </Button>
        </div>
      </div>
    </div>
  );
}
