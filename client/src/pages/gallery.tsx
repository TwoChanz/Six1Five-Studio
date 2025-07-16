import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Filter, Grid, Grid3X3 } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import type { PortfolioItem } from "@shared/schema";

export default function Gallery() {
  const [viewMode, setViewMode] = useState<'grid' | 'detailed'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    document.title = "3D Model Gallery - Six1Five Studio | Reality Capture Portfolio";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Explore our complete collection of 3D models, photogrammetry captures, and LiDAR scans. Interactive Sketchfab viewers for AEC, construction, and heritage documentation projects.");
    }
  }, []);

  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const categories = ['all', 'photogrammetry', 'lidar', 'construction', 'heritage', 'interior'];
  
  const filteredItems = portfolioItems?.filter((item: PortfolioItem) => 
    selectedCategory === 'all' || item.category === selectedCategory
  ) || [];

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
      <div className="absolute top-2 right-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open(`https://sketchfab.com/3d-models/${modelId}`, '_blank')}
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          View on Sketchfab
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              3D Model <span className="text-[hsl(199,89%,48%)]">Gallery</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore our complete collection of reality capture projects. Each model tells a story of precision, innovation, and digital transformation.
            </p>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category 
                      ? "bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' 
                  ? "bg-[hsl(199,89%,48%)]" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'detailed' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('detailed')}
                className={viewMode === 'detailed' 
                  ? "bg-[hsl(199,89%,48%)]" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Portfolio Grid */}
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl p-6">
                  <Skeleton className="aspect-video mb-4 bg-gray-700" />
                  <Skeleton className="h-6 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 mb-4 bg-gray-700" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 bg-gray-700" />
                    <Skeleton className="h-6 w-20 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
              {filteredItems.map((item: PortfolioItem) => (
                <div key={item.id} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                  {item.sketchfabModelId ? (
                    <SketchfabEmbed modelId={item.sketchfabModelId} title={item.title} />
                  ) : (
                    <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                      <p className="text-gray-400">No 3D model available</p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-3">{item.description}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <Badge variant="secondary" className="bg-[hsl(24,95%,53%)] text-white">
                          {item.category}
                        </Badge>
                      </div>
                      
                      {item.tools && item.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tools.map((tool, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-4">No models found in this category</p>
              <Button onClick={() => setSelectedCategory('all')} className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]">
                View All Models
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Ready to Create Your Own 3D Model?</h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              From concept to completion, we deliver high-quality reality capture services that bring your projects into the digital realm.
            </p>
            <Link href="/#contact">
              <Button className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-8 py-3 rounded-lg font-semibold">
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}