import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, ExternalLink, Calendar, Package, Wrench } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import LeadMagnetTrigger from "@/components/lead-magnet-trigger";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelViewDialog } from "@/components/model-view-dialog";
import ConceptStudyTimeline from "@/components/concept-study-timeline";
import { getQueryFn } from "@/lib/queryClient";
import { analytics } from "@/lib/analytics";
import type { PortfolioItem } from "@shared/schema";
import { format } from "date-fns";

export default function PortfolioDetail() {
  const [, params] = useRoute("/portfolio/:id");
  const portfolioId = params?.id;
  const [selectedModel, setSelectedModel] = useState<PortfolioItem | null>(null);
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);

  const { data: item, isLoading, error } = useQuery<PortfolioItem>({
    queryKey: [`/api/portfolio/${portfolioId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!portfolioId,
  });

  useEffect(() => {
    if (item) {
      document.title = `${item.title} - Six1Five Studio Portfolio`;
      analytics.portfolioView(item.title, item.category);
    }
  }, [item]);

  // Helper to check if item has 3D model
  const has3DModel = (item: PortfolioItem): boolean => {
    return !!(item.sketchfabModelId || item.lumaEmbedUrl || item.polycamEmbedUrl);
  };

  // Helper to get external link
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

  if (error) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Portfolio Item Not Found</h1>
            <p className="text-gray-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Link href="/gallery">
              <Button className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Gallery
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
        <Navbar />
        <main className="pt-32 pb-16">
          <div className="container mx-auto px-6">
            <Skeleton className="h-12 w-64 mb-8 bg-gray-700" />
            <Skeleton className="h-96 w-full mb-8 bg-gray-700" />
            <Skeleton className="h-32 w-full bg-gray-700" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!item) return null;

  const externalLink = getExternalLink(item);
  const hasModel = has3DModel(item);

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[hsl(218,11%,12%)] to-[hsl(218,11%,18%)] pt-32 pb-16">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <Link href="/gallery">
            <Button variant="ghost" className="mb-6 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>

          {/* Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            {item.featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Featured Project
              </Badge>
            )}
            {item.isConceptStudy && (
              <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                Concept Study
              </Badge>
            )}
            <Badge variant="outline" className="border-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)]">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </Badge>
          </div>

          {/* Title & Date */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {item.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 mb-8">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(item.createdAt), 'MMMM dd, yyyy')}</span>
          </div>

          {/* Description */}
          <p className="text-xl text-gray-300 max-w-4xl leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Concept Study Timeline OR Featured Image / 3D Model */}
        <div className="mb-16">
          {item.isConceptStudy && item.images && item.images.length > 1 ? (
            /* Interactive Phase Timeline for Concept Studies */
            <ConceptStudyTimeline images={item.images} title={item.title} />
          ) : (
            /* Standard Featured Image Display */
            <>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
                {item.featuredImage ? (
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)]">
                    <div className="text-center text-white">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">{item.title}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 3D Model CTA */}
              {hasModel && (
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button
                    onClick={() => {
                      setSelectedModel(item);
                      setIsModelDialogOpen(true);
                    }}
                    className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)]"
                  >
                    View 3D Model
                  </Button>
                  {externalLink && (
                    <Button
                      variant="outline"
                      className="border-gray-400 text-gray-200 hover:bg-gray-700"
                      onClick={() => window.open(externalLink, '_blank')}
                    >
                      Open in Viewer
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Project Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Tools Used */}
          {item.tools && item.tools.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-[hsl(24,95%,53%)]" />
                <h3 className="text-xl font-semibold">Tools & Equipment</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.tools.map((tool, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-700 text-gray-200">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {item.services && item.services.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                <h3 className="text-xl font-semibold">Services Provided</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.services.map((service, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-700 text-gray-200">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Start Your Project?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto text-lg">
            Let's discuss how reality capture can transform your next project. Get a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#contact">
              <Button
                size="lg"
                className="bg-white text-[hsl(24,95%,53%)] hover:bg-gray-100 font-semibold px-8"
              >
                Get a Free Quote
              </Button>
            </Link>
            <LeadMagnetTrigger
              source="portfolio_detail"
              variant="outline"
              text="Download Planning Guide"
              className="bg-white/10 border-white text-white hover:bg-white hover:text-[hsl(24,95%,53%)] px-8"
            />
          </div>
        </div>
      </main>

      <Footer />

      {/* 3D Model Dialog */}
      {selectedModel && (
        <ModelViewDialog
          isOpen={isModelDialogOpen}
          onClose={() => setIsModelDialogOpen(false)}
          title={selectedModel.title}
          sketchfabModelId={selectedModel.sketchfabModelId || undefined}
          lumaEmbedUrl={selectedModel.lumaEmbedUrl || undefined}
          polycamEmbedUrl={selectedModel.polycamEmbedUrl || undefined}
        />
      )}
    </div>
  );
}
