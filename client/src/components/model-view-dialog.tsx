import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";

interface ModelViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sketchfabModelId?: string;
  lumaEmbedUrl?: string;
  polycamEmbedUrl?: string;
}

export function ModelViewDialog({
  isOpen,
  onClose,
  title,
  sketchfabModelId,
  lumaEmbedUrl,
  polycamEmbedUrl,
}: ModelViewDialogProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Reset loading state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  // Handle different Luma URL formats
  const getLumaEmbedSrc = (url: string): string => {
    if (url.includes('lumalabs.ai/embed/')) {
      return url; // Already an embed URL, use as-is (preserves all parameters)
    }
    if (url.includes('lumalabs.ai/capture/')) {
      const match = url.match(/\/capture\/([^/?]+)/);
      const captureId = match ? match[1] : url;
      return `https://lumalabs.ai/embed/${captureId}`;
    }
    return `https://lumalabs.ai/embed/${url}`; // Assume it's a capture ID
  };

  const getLumaCaptureId = (url: string): string => {
    const match = url.match(/\/(capture|embed)\/([^/?]+)/);
    return match ? match[2] : url;
  };

  const getPolycamCaptureId = (url: string): string => {
    const match = url.match(/\/capture\/([^/?]+)/);
    return match ? match[1] : url;
  };

  const LumaEmbedInline = ({ embedUrl }: { embedUrl: string }) => {
    const embedSrc = getLumaEmbedSrc(embedUrl);
    const captureId = getLumaCaptureId(embedUrl);

    return (
      <div className="aspect-video relative bg-gray-900 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[hsl(199,89%,48%)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400 text-sm">Loading Luma AI Model...</p>
            </div>
          </div>
        )}
        <iframe
          src={embedSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="eager"
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute top-2 right-2 z-20">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(`https://lumalabs.ai/capture/${captureId}`, '_blank')}
            aria-label="View this model on Luma AI"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View on Luma AI
          </Button>
        </div>
      </div>
    );
  };

  const PolycamEmbedInline = ({ embedUrl }: { embedUrl: string }) => {
    const captureId = getPolycamCaptureId(embedUrl);

    return (
      <div className="aspect-video relative bg-gray-900 rounded-lg overflow-hidden flex flex-col items-center justify-center p-8 text-center">
        <svg className="w-16 h-16 mx-auto mb-4 text-[hsl(199,89%,48%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">View this 3D model on Polycam</p>
        <Button
          size="lg"
          onClick={() => window.open(`https://poly.cam/capture/${captureId}`, '_blank')}
          className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)]"
          aria-label={`View ${title} on Polycam`}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open in Polycam
        </Button>
      </div>
    );
  };

  const SketchfabEmbedInline = ({ modelId }: { modelId: string }) => {
    return (
      <div className="aspect-video relative bg-gray-900 rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-[hsl(199,89%,48%)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400 text-sm">Loading 3D Model...</p>
            </div>
          </div>
        )}
        <iframe
          src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark`}
          title={title}
          frameBorder="0"
          allow="autoplay; fullscreen; vr"
          className="w-full h-full"
          loading="eager"
          onLoad={() => setIsLoading(false)}
        />
        <div className="absolute top-2 right-2 z-20">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(`https://sketchfab.com/3d-models/${modelId}`, '_blank')}
            aria-label="View this model on Sketchfab"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View on Sketchfab
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {lumaEmbedUrl ? (
            <LumaEmbedInline embedUrl={lumaEmbedUrl} />
          ) : polycamEmbedUrl ? (
            <PolycamEmbedInline embedUrl={polycamEmbedUrl} />
          ) : sketchfabModelId ? (
            <SketchfabEmbedInline modelId={sketchfabModelId} />
          ) : (
            <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">No 3D model available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
