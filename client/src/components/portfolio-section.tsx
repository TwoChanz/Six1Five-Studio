import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, Layers, Building, ArrowRight, Eye } from "lucide-react";
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
                            <Badge key={i} variant="outline" className="border-gray-400 text-gray-200">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Link href={`/project/${item.slug}`}>
                        <Button className={`${buttonColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors hover:opacity-90`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Project
                        </Button>
                      </Link>
                      <Link href="/gallery">
                        <Button variant="outline" className="border-gray-500 text-gray-200 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                          View All Projects
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Static Image Thumbnail - Clickable */}
                  <Link href={`/project/${item.slug}`} className={`relative block ${isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="bg-gray-800 rounded-xl p-6 scanline-effect relative group cursor-pointer overflow-hidden">
                      <img 
                        src={item.featuredImage || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
                        alt={item.title} 
                        className="rounded-lg w-full h-auto transition-transform duration-300 group-hover:scale-105" 
                      />
                      
                      {/* Overlay with hover effect */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl group-hover:bg-black/60 transition-all duration-300">
                        <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <IconComponent className={`w-16 h-16 ${iconColor} mb-4 mx-auto`} />
                          <p className="text-white font-semibold mb-2">View 3D Model</p>
                          <p className="text-gray-300 text-sm mb-4">Interactive {item.viewerType || 'preview'} experience</p>
                          <div className="inline-flex items-center text-white bg-black/60 hover:bg-black/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Explore Project
                          </div>
                        </div>
                      </div>

                      {/* Badge indicators */}
                      <div className="absolute top-4 left-4 z-10">
                        <Badge variant="secondary" className="bg-black/70 text-white border-0">
                          {item.category}
                        </Badge>
                      </div>
                      
                      {/* 3D indicator */}
                      {(item.modelFile || item.sketchfabModelId || item.viewerType) && (
                        <div className="absolute top-4 right-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                          <Eye className="w-3 h-3" />
                          3D Ready
                        </div>
                      )}
                    </div>
                  </Link>
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
