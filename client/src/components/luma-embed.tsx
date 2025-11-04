import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface LumaEmbedProps {
  embedUrl: string;
  title: string;
}

export function LumaEmbed({ embedUrl, title }: LumaEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle different URL formats
  const getEmbedSrc = (url: string): string => {
    // If it's already a full embed URL with parameters, use it as-is
    if (url.includes('lumalabs.ai/embed/') && url.includes('?')) {
      return url;
    }

    // If it's a full embed URL without parameters
    if (url.includes('lumalabs.ai/embed/')) {
      return url;
    }

    // If it's a capture URL, extract ID and build embed URL
    if (url.includes('lumalabs.ai/capture/')) {
      const match = url.match(/\/capture\/([^/?]+)/);
      const captureId = match ? match[1] : url;
      return `https://lumalabs.ai/embed/${captureId}`;
    }

    // If it's just a capture ID, build the embed URL
    return `https://lumalabs.ai/embed/${url}`;
  };

  const getCaptureId = (url: string): string => {
    // Extract capture ID from various URL formats
    if (url.includes('lumalabs.ai')) {
      const match = url.match(/\/(capture|embed)\/([^/?]+)/);
      return match ? match[2] : url;
    }
    return url; // Assume it's already a capture ID
  };

  const embedSrc = getEmbedSrc(embedUrl);
  const captureId = getCaptureId(embedUrl);
  const externalLink = `https://lumalabs.ai/capture/${captureId}`;

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
            <p className="text-gray-400 text-sm">Scroll to load Luma AI model...</p>
          </div>
        </div>
      )}
      {isLoading && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[hsl(199,89%,48%)] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-400 text-sm">Loading Luma AI Model...</p>
          </div>
        </div>
      )}
      {shouldLoad && (
        <iframe
          src={embedSrc}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
      )}
      <div className="absolute top-2 right-2 z-20">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open(externalLink, '_blank')}
          aria-label="View this model on Luma AI"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View on Luma AI
        </Button>
      </div>
      <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
        Luma AI NeRF
      </div>
    </div>
  );
}
