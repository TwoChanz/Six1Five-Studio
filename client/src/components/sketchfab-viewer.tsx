import { Box, Expand, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SketchfabViewer() {
  return (
    <div className="bg-gray-800 rounded-xl p-6 scanline-effect tech-glow">
      {/* Placeholder for Sketchfab embed */}
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Box className="w-16 h-16 text-[hsl(199,89%,48%)] mb-4 mx-auto animate-pulse" />
          <p className="text-gray-400 font-mono">3D Model Viewer</p>
          <p className="text-sm text-gray-500 mt-2">Interactive Floyd Stadium Scan</p>
          <p className="text-xs text-gray-600 mt-1">Sketchfab integration ready</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-[hsl(199,89%,48%)] hover:text-white transition-colors"
        >
          <Expand className="w-4 h-4 mr-2" />
          Fullscreen
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-[hsl(199,89%,48%)] hover:text-white transition-colors"
        >
          <Info className="w-4 h-4 mr-2" />
          Info
        </Button>
      </div>
    </div>
  );
}
