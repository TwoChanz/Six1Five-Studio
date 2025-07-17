import { Eye } from "lucide-react";
import { GLBModelViewer } from "@/components/glb-model-viewer";
import type { ProjectConfig } from "@shared/projects";

interface ProjectViewerProps {
  project: ProjectConfig;
  className?: string;
}

// Sketchfab Embed Component
function SketchfabEmbed({ modelId, title }: { modelId: string; title: string }) {
  return (
    <div className="aspect-video relative bg-gray-800 rounded-lg overflow-hidden">
      <iframe
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&camera=0`}
        title={title}
        frameBorder="0"
        allow="autoplay; fullscreen; vr"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
}

// Polycam/General Iframe Embed Component
function IframeEmbed({ url, title }: { url: string; title: string }) {
  return (
    <div className="aspect-video relative bg-gray-800 rounded-lg overflow-hidden">
      <iframe
        src={url}
        title={title}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
        style={{
          border: '0',
          borderRadius: '12px'
        }}
      />
    </div>
  );
}

export default function ProjectViewer({ project, className = "" }: ProjectViewerProps) {
  const renderViewer = () => {
    switch (project.viewerType) {
      case 'glb':
        if (!project.modelFile) return null;
        return (
          <div className={`bg-gray-800 rounded-xl p-4 ${className}`}>
            <GLBModelViewer 
              src={project.modelFile} 
              title={project.title} 
              className="rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" />
                Interactive 3D Model
              </p>
            </div>
          </div>
        );

      case 'sketchfab':
        if (!project.viewerUrl) return null;
        // Extract model ID from Sketchfab URL
        const sketchfabMatch = project.viewerUrl.match(/\/models\/([^\/]+)/);
        const modelId = sketchfabMatch ? sketchfabMatch[1] : '';
        
        return (
          <div className={`bg-gray-800 rounded-xl p-4 ${className}`}>
            <SketchfabEmbed modelId={modelId} title={project.title} />
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">Sketchfab 3D Model</p>
            </div>
          </div>
        );

      case 'iframe':
        if (!project.viewerUrl) return null;
        return (
          <div className={`bg-gray-800 rounded-xl p-4 ${className}`}>
            <IframeEmbed url={project.viewerUrl} title={project.title} />
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                {project.viewerUrl.includes('poly.cam') ? 'Polycam 3D Capture' : 'Interactive 3D Model'}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className={`bg-gray-800 rounded-xl p-6 text-center ${className}`}>
            <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="rounded-lg w-full h-auto mb-4" 
            />
            <p className="text-gray-400">3D model not available for this project</p>
          </div>
        );
    }
  };

  return (
    <div className="lg:sticky lg:top-24">
      {renderViewer()}
    </div>
  );
}