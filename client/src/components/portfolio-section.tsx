import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Layers, Building, ExternalLink, Eye, PlayCircle } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { ModelViewer } from "./model-viewer";
import OptimizedImage from "./optimized-image";
import type { PortfolioItem } from "@shared/schema";

const getIconForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'photogrammetry': return Play;
    case 'construction': return Layers;
    case 'heritage': 
    case 'interior': 
    default: return Building;
  }
};

const getColorForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'photogrammetry': return 'text-[hsl(24,95%,53%)]';
    case 'construction': return 'text-[hsl(199,89%,48%)]';
    case 'heritage':
    case 'interior':
    default: return 'text-[hsl(158,64%,52%)]';
  }
};

const getButtonColorForCategory = (category: string) => {
  switch (category.toLowerCase()) {
    case 'photogrammetry': return 'bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]';
    case 'construction': return 'bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)]';
    case 'heritage':
    case 'interior':
    default: return 'bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,47%)]';
  }
};

export default function PortfolioSection() {
  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ['/api/portfolio/featured'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const SketchfabEmbed = ({ modelId, title }: { modelId: string; title: string }) => (
    <div className="aspect-video relative bg-gray-800 rounded-lg overflow-hidden">
      <iframe
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=0&ui_theme=dark&preload=0`}
        title={title}
        frameBorder="0"
        allow="autoplay; fullscreen; vr"
        className="w-full h-full"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      />
    </div>
  );

  return (
    <section id="portfolio" className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Featured <span className="text-[hsl(199,89%,48%)]">Captures</span>
        </h2>
        
        {isLoading ? (
          <div className="space-y-16">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Skeleton className="h-8 mb-4 bg-gray-700" />
                  <Skeleton className="h-24 mb-6 bg-gray-700" />
                  <div className="space-y-2 mb-8">
                    <Skeleton className="h-4 bg-gray-700" />
                    <Skeleton className="h-4 bg-gray-700" />
                    <Skeleton className="h-4 bg-gray-700" />
                  </div>
                  <Skeleton className="h-12 w-32 bg-gray-700" />
                </div>
                <Skeleton className="aspect-video bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {(portfolioItems as PortfolioItem[])?.map((item: PortfolioItem, index: number) => {
              const IconComponent = getIconForCategory(item.category);
              const iconColor = getColorForCategory(item.category);
              const buttonColor = getButtonColorForCategory(item.category);
              const isReverse = index % 2 === 1;
              
              return (
                <div 
                  key={item.id} 
                  className={`grid lg:grid-cols-2 gap-12 items-center ${isReverse ? 'lg:grid-flow-col-dense' : ''}`}
                >
                  <div className={isReverse ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-3xl font-semibold">{item.title}</h3>
                      <Badge variant="secondary" className="bg-[hsl(24,95%,53%)] text-white">
                        {item.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {item.tools && item.tools.length > 0 && (
                      <div className="mb-6">
                        <span className={`${iconColor} font-semibold mr-3`}>Tools:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.tools.map((tool, i) => (
                            <Badge key={i} variant="outline" className="border-gray-400 text-gray-200">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Deliverables Section */}
                    {(item.services && item.services.length > 0) && (
                      <div className="mb-6">
                        <span className={`${iconColor} font-semibold mb-2 block`}>Deliverables:</span>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {item.services.map((service, i) => (
                            <li key={i} className="flex items-start">
                              <span className="w-1.5 h-1.5 bg-[hsl(24,95%,53%)] rounded-full mr-2 mt-2 flex-shrink-0"></span>
                              {service}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                      {item.sketchfabModelId && (
                        <a 
                          href={`https://sketchfab.com/3d-models/${item.sketchfabModelId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center ${buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Sketchfab
                        </a>
                      )}
                      {item.modelFile && item.modelFormat && (
                        <button 
                          onClick={() => {
                            const modelElement = document.querySelector(`[data-model-id="${item.id}"]`);
                            if (modelElement) {
                              modelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }}
                          className={`inline-flex items-center ${buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90`}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View in 3D
                        </button>
                      )}
                      {item.videoFile && item.videoFormat && (
                        <button 
                          onClick={() => {
                            const videoElement = document.querySelector(`[data-video-id="${item.id}"]`);
                            if (videoElement) {
                              videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              const video = videoElement.querySelector('video');
                              if (video) video.play();
                            }
                          }}
                          className={`inline-flex items-center ${buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90`}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Watch Video
                        </button>
                      )}
                      <button className="text-[hsl(199,89%,48%)] hover:text-white text-sm font-medium transition-colors">
                        See full project →
                      </button>
                    </div>
                  </div>
                  
                  <div className={`relative ${isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    {item.sketchfabModelId ? (
                      <div className="bg-gray-800 rounded-xl p-4">
                        <SketchfabEmbed modelId={item.sketchfabModelId} title={item.title} />
                      </div>
                    ) : item.modelFile && item.modelFormat ? (
                      <div className="bg-gray-800 rounded-xl p-4" data-model-id={item.id}>
                        <ModelViewer 
                          modelFile={item.modelFile} 
                          modelFormat={item.modelFormat as 'glb' | 'gltf' | 'obj'} 
                          title={item.title} 
                          className="rounded-lg"
                        />
                        <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          Interactive 3D
                        </div>
                      </div>
                    ) : item.videoFile && item.videoFormat ? (
                      <div className="bg-gray-800 rounded-xl overflow-hidden relative" data-video-id={item.id}>
                        <video 
                          controls
                          preload="metadata"
                          className="w-full h-auto aspect-video object-cover rounded-lg"
                          poster={item.featuredImage || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                        >
                          <source src={item.videoFile} type={`video/${item.videoFormat}`} />
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                          <PlayCircle className="w-3 h-3" />
                          Video Walkthrough
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-xl overflow-hidden relative group">
                        <OptimizedImage
                          src={item.featuredImage || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                          alt={item.title}
                          aspectRatio="video"
                          className="w-full h-auto"
                        />
                        {item.images && item.images.length > 1 && (
                          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                            +{item.images.length - 1} more images
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-medium">
                          {item.category}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link href="/gallery">
            <Button className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500">
              Explore Full Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
