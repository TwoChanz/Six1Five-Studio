import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Layers, Building, ExternalLink } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import type { PortfolioItem } from "@shared/schema";

const getIconForCategory = (category: string) => {
  switch (category) {
    case 'photogrammetry': return Play;
    case 'construction': return Layers;
    case 'heritage': 
    case 'interior': 
    default: return Building;
  }
};

const getColorForCategory = (category: string) => {
  switch (category) {
    case 'photogrammetry': return 'text-[hsl(24,95%,53%)]';
    case 'construction': return 'text-[hsl(199,89%,48%)]';
    case 'heritage':
    case 'interior':
    default: return 'text-[hsl(158,64%,52%)]';
  }
};

const getButtonColorForCategory = (category: string) => {
  switch (category) {
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
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=0&ui_theme=dark`}
        title={title}
        frameBorder="0"
        allow="autoplay; fullscreen; vr"
        className="w-full h-full"
        loading="lazy"
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
            {portfolioItems?.map((item: PortfolioItem, index: number) => {
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
                            <Badge key={i} variant="outline" className="border-gray-600 text-gray-300">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      {item.sketchfabModelId && (
                        <Button 
                          onClick={() => window.open(`https://sketchfab.com/3d-models/${item.sketchfabModelId}`, "_blank")}
                          className={`${buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View 3D Model
                        </Button>
                      )}
                      <Link href="/gallery">
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          View All Projects
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className={`relative ${isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    {item.sketchfabModelId ? (
                      <div className="bg-gray-800 rounded-xl p-4">
                        <SketchfabEmbed modelId={item.sketchfabModelId} title={item.title} />
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-xl p-6 scanline-effect">
                        <img 
                          src={item.featuredImage || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
                          alt={item.title} 
                          className="rounded-lg w-full h-auto" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl">
                          <div className="text-center">
                            <IconComponent className={`w-16 h-16 ${iconColor} mb-4`} />
                            <p className="text-white font-semibold">
                              {item.category === 'photogrammetry' ? "3D Model Preview" : 
                               item.category === 'construction' ? "Progress Documentation" : 
                               "Virtual Documentation"}
                            </p>
                          </div>
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
            <Button className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white px-8 py-3 rounded-lg font-semibold text-lg">
              Explore Full Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
