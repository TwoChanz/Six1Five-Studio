import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PolycamEmbedProps {
  embedUrl: string;
  title: string;
}

export function PolycamEmbed({ embedUrl, title }: PolycamEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract capture ID if full URL is provided
  const getCaptureId = (url: string): string => {
    // Handle both full URLs and direct IDs
    if (url.includes('poly.cam')) {
      const match = url.match(/\/capture\/([^/?]+)/);
      return match ? match[1] : url;
    }
    return url; // Assume it's already a capture ID
  };

  const captureId = getCaptureId(embedUrl);
  const externalLink = `https://poly.cam/capture/${captureId}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoad) {
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="aspect-video relative bg-gray-800 rounded-lg overflow-hidden">
      {!shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-[hsl(199,89%,48%)] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Scroll to load Polycam model...</p>
          </div>
        </div>
      )}
      {shouldLoad && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto mb-4 text-[hsl(199,89%,48%)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm mb-4">
              View this 3D model on Polycam
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => window.open(externalLink, '_blank')}
            className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)]"
            aria-label={`View ${title} on Polycam`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Polycam
          </Button>
          <p className="text-gray-500 text-xs mt-4">
            Interactive 3D viewer on poly.cam
          </p>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
        Polycam 3D
      </div>
    </div>
  );
}
