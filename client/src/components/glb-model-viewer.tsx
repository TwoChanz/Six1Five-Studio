import { useEffect, useRef } from 'react';
import { Eye, RotateCcw, Maximize2 } from 'lucide-react';

interface GLBModelViewerProps {
  src: string;
  title: string;
  className?: string;
}

// Extend the JSX namespace to include model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export function GLBModelViewer({ src, title, className = '' }: GLBModelViewerProps) {
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Dynamically load the model-viewer script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    
    if (!document.querySelector('script[src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"]')) {
      document.head.appendChild(script);
    }
  }, []);

  const resetCamera = () => {
    if (viewerRef.current) {
      // Reset camera to initial position
      (viewerRef.current as any).cameraTarget = '0m 0m 0m';
      (viewerRef.current as any).cameraOrbit = '0deg 75deg 4m';
    }
  };

  const enterFullscreen = () => {
    if (viewerRef.current && viewerRef.current.requestFullscreen) {
      viewerRef.current.requestFullscreen();
    }
  };

  return (
    <div className={`relative bg-gray-900 rounded-xl overflow-hidden ${className}`}>
      <model-viewer
        ref={viewerRef}
        src={src}
        alt={title}
        auto-rotate
        camera-controls
        exposure="1.25"
        environment-image="neutral"
        shadow-intensity="1"
        background-color="#1a1a1a"
        style={{
          width: '100%',
          height: '400px',
          display: 'block'
        }}
        loading="eager"
        reveal="interaction"
        ar-modes="webxr scene-viewer quick-look"
        ar
        ar-scale="fixed"
      >
        <div slot="poster" className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Loading 3D model...</p>
          </div>
        </div>
        
        <div slot="error" className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 mb-2">⚠️</div>
            <p className="text-gray-400">Failed to load 3D model</p>
            <p className="text-xs text-gray-500 mt-1">Please check your connection</p>
          </div>
        </div>
      </model-viewer>
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={resetCamera}
          className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors"
          title="Reset camera"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={enterFullscreen}
          className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors"
          title="Fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
      
      {/* Model info badge */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/60 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
        <Eye className="w-3 h-3" />
        Interactive 3D Model
      </div>
      
      {/* AR badge */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
        AR Ready
      </div>
    </div>
  );
}