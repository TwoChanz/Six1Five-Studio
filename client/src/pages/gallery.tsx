import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { analytics } from "@/lib/analytics";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ModelViewDialog } from "@/components/model-view-dialog";
import { SEOHead, getCanonicalUrl } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Filter, Eye, Star } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import type { PortfolioItem } from "@shared/schema";

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedModel, setSelectedModel] = useState<PortfolioItem | null>(null);
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);

  // Smooth transition effect when changing filters
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const categories = ['all', 'photogrammetry', 'lidar', 'construction', 'heritage', 'interior'];
  
  const filteredItems = (portfolioItems as PortfolioItem[])?.filter((item: PortfolioItem) =>
    selectedCategory === 'all' || item.category === selectedCategory
  ) || [];

  // Helper to get external link for a project
  const getExternalLink = (item: PortfolioItem): string | null => {
    if (item.lumaEmbedUrl) {
      const captureId = item.lumaEmbedUrl.includes('lumalabs.ai')
        ? item.lumaEmbedUrl.match(/\/capture\/([^/?]+)/)?.[1] || item.lumaEmbedUrl
        : item.lumaEmbedUrl;
      return `https://lumalabs.ai/capture/${captureId}`;
    }
    if (item.polycamEmbedUrl) {
      const captureId = item.polycamEmbedUrl.includes('poly.cam')
        ? item.polycamEmbedUrl.match(/\/capture\/([^/?]+)/)?.[1] || item.polycamEmbedUrl
        : item.polycamEmbedUrl;
      return `https://poly.cam/capture/${captureId}`;
    }
    if (item.sketchfabModelId) {
      return `https://sketchfab.com/3d-models/${item.sketchfabModelId}`;
    }
    return null;
  };

  // Helper to check if item has 3D model
  const has3DModel = (item: PortfolioItem): boolean => {
    return !!(item.sketchfabModelId || item.lumaEmbedUrl || item.polycamEmbedUrl);
  };

  // Helper to get platform name
  const getPlatformName = (item: PortfolioItem): string => {
    if (item.lumaEmbedUrl) return "Luma AI";
    if (item.polycamEmbedUrl) return "Polycam";
    if (item.sketchfabModelId) return "Sketchfab";
    return "External Link";
  };

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <SEOHead
        title="Portfolio Gallery - Six1Five Studio | Reality Capture Projects"
        description="Explore our portfolio of drone mapping, LiDAR scanning, and photogrammetry projects for construction, real estate, agriculture, and historic preservation."
        keywords="reality capture portfolio, drone mapping projects, LiDAR scans, photogrammetry gallery, 3D model viewer, construction surveying, AEC technology"
        canonicalUrl={getCanonicalUrl('/gallery')}
        ogImage="/images/og-gallery.jpg"
      />
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

          {/* Category Filters */}
          <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      analytics.galleryFilter(category);
                      // Smooth scroll to portfolio grid for better UX
                      const portfolioGrid = document.querySelector('.portfolio-grid');
                      if (portfolioGrid) {
                        portfolioGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className={`transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] shadow-lg scale-105"
                        : "border-gray-400 text-gray-200 hover:bg-gray-600 hover:border-gray-300 hover:scale-105"
                    }`}
                    aria-pressed={selectedCategory === category}
                    aria-label={`Filter by ${category} category`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Grid */}
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 portfolio-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 animate-pulse">
                  <Skeleton className="aspect-video bg-gray-700" />
                  <div className="p-5">
                    <Skeleton className="h-6 mb-3 bg-gray-700" />
                    <Skeleton className="h-4 mb-4 bg-gray-700 w-3/4" />
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-6 w-20 bg-gray-700" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 portfolio-grid">
              {filteredItems.map((item: PortfolioItem, index: number) => {
                const externalLink = getExternalLink(item);
                const platformName = getPlatformName(item);
                const hasModel = has3DModel(item);
                const visibleTags = item.tools?.slice(0, 2) || [];
                const remainingTagsCount = (item.tools?.length || 0) - 2;

                return (
                  <div
                    key={item.id}
                    className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-gray-600 ${
                      isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {/* Thumbnail with gradient overlay */}
                    <div className="relative aspect-video overflow-hidden bg-gray-900 group">
                      <img
                        src={item.featuredImage || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>

                      {/* Featured Badge */}
                      {item.featured && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                          <Star className="w-3 h-3 fill-white" />
                          Featured
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary" className="bg-[hsl(24,95%,53%)] text-white font-semibold shadow-lg">
                          {item.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold mb-2 text-white line-clamp-1">{item.title}</h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{item.description}</p>

                      {/* Tags */}
                      {visibleTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {visibleTags.map((tool, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-gray-500 text-gray-300 bg-gray-900/50">
                              {tool}
                            </Badge>
                          ))}
                          {remainingTagsCount > 0 && (
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-400">
                              +{remainingTagsCount} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        {hasModel && (
                          <Button
                            onClick={() => {
                              setSelectedModel(item);
                              setIsModelDialogOpen(true);
                              analytics.ctaClick('View 3D Model', 'gallery_item');
                            }}
                            className="w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View 3D Model
                          </Button>
                        )}
                        {externalLink && (
                          <Button
                            variant={hasModel ? "outline" : "default"}
                            onClick={() => {
                              window.open(externalLink, '_blank');
                              analytics.externalLink(externalLink, platformName);
                            }}
                            className={hasModel
                              ? "w-full border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                              : "w-full bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white font-semibold"
                            }
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on {platformName}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filteredItems.length === 0 && !isLoading && (
            <div className="text-center py-16 animate-fade-in">
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 max-w-md mx-auto">
                <p className="text-xl text-gray-300 mb-2 font-semibold">No models found</p>
                <p className="text-gray-400 mb-6 text-sm">
                  There are no projects in the "{selectedCategory}" category yet.
                </p>
                <Button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] transition-all duration-300 hover:scale-105"
                >
                  View All Models
                </Button>
              </div>
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

      {/* 3D Model View Dialog */}
      {selectedModel && (
        <ModelViewDialog
          isOpen={isModelDialogOpen}
          onClose={() => {
            setIsModelDialogOpen(false);
            setSelectedModel(null);
          }}
          title={selectedModel.title}
          sketchfabModelId={selectedModel.sketchfabModelId || undefined}
          lumaEmbedUrl={selectedModel.lumaEmbedUrl || undefined}
          polycamEmbedUrl={selectedModel.polycamEmbedUrl || undefined}
        />
      )}
    </div>
  );
}