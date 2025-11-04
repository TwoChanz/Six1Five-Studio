import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Calendar, BookOpen, Loader2 } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";


export default function InsightsPage() {
  useEffect(() => {
    document.title = "Insights - Six1Five Studio | Digital Blueprint Blog";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Explore insights on AEC technology, LiDAR, BIM, AI, and digital twins from Six1Five Studio."
      );
    }
  }, []);

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[hsl(199,89%,48%)] text-white">
              <BookOpen className="w-3 h-3 mr-1" />
              Digital Blueprint
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Industry <span className="text-[hsl(199,89%,48%)]">Insights</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
              Exploring AEC technology, LiDAR, BIM, AI, and digital twins. Insights from the field to inspire the next generation of industry professionals.
            </p>
            <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
              <span>Published on</span>
              <a
                href="https://digitalblueprint.substack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,43%)] transition-colors flex items-center gap-1"
              >
                Substack <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[hsl(199,89%,48%)] animate-spin mb-4" />
              <p className="text-gray-400">Loading latest insights...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">Failed to load insights.</p>
              <Button
                variant="outline"
                className="border-gray-400 text-gray-200 hover:bg-gray-600"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Posts Grid */}
          {!isLoading && !error && posts && posts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="bg-gray-800 border-gray-700 hover:border-[hsl(199,89%,48%)] transition-all group cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-[hsl(199,89%,48%)] transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {post.excerpt && (
                        <CardDescription className="text-gray-400 mb-4 line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] w-full"
                      >
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4 text-white">Stay Updated</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Subscribe to Digital Blueprint on Substack for weekly insights on AEC technology, reality capture, and digital innovation.
            </p>
            <a
              href="https://digitalblueprint.substack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="secondary"
                className="bg-white text-[hsl(24,95%,53%)] hover:bg-gray-100"
              >
                Subscribe on Substack
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

