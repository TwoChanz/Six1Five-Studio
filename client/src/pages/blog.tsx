import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";

export default function Blog() {
  useEffect(() => {
    document.title = "Reality Capture Blog - Six1Five Studio | Industry Insights & Tutorials";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Expert insights on reality capture, drone mapping, LiDAR scanning, and photogrammetry. Learn about the latest techniques and regulations in the AEC industry.");
    }
  }, []);

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['/api/blog'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const featuredPost = blogPosts?.[0];
  const otherPosts = blogPosts?.slice(1) || [];

  const readingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reality Capture <span className="text-[hsl(199,89%,48%)]">Insights</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Expert tutorials, industry insights, and the latest in drone mapping, LiDAR scanning, and photogrammetry technology.
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              {/* Featured Post Skeleton */}
              <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                <Skeleton className="h-64 bg-gray-700" />
                <div className="p-8">
                  <Skeleton className="h-8 mb-4 bg-gray-700" />
                  <Skeleton className="h-4 mb-4 bg-gray-700" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-20 bg-gray-700" />
                    <Skeleton className="h-6 w-16 bg-gray-700" />
                  </div>
                  <Skeleton className="h-4 bg-gray-700" />
                </div>
              </div>
              
              {/* Other Posts Skeleton */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                    <Skeleton className="h-48 bg-gray-700" />
                    <div className="p-6">
                      <Skeleton className="h-6 mb-3 bg-gray-700" />
                      <Skeleton className="h-4 mb-4 bg-gray-700" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-20 bg-gray-700" />
                        <Skeleton className="h-4 w-16 bg-gray-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="space-y-12">
              {/* Featured Post */}
              {featuredPost && (
                <article className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                  {featuredPost.featuredImage && (
                    <div className="h-64 bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] flex items-center justify-center">
                      <img 
                        src={featuredPost.featuredImage} 
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(featuredPost.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{readingTime(featuredPost.content)} min read</span>
                      </div>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-4 hover:text-[hsl(24,95%,53%)] transition-colors">
                      <Link href={`/blog/${featuredPost.slug}`}>
                        {featuredPost.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-400 mb-6 text-lg leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags?.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-[hsl(24,95%,53%)] text-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <Link href={`/blog/${featuredPost.slug}`}>
                      <span className="inline-flex items-center text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,38%)] transition-colors">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </Link>
                  </div>
                </article>
              )}

              {/* Other Posts Grid */}
              {otherPosts.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherPosts.map((post: BlogPost) => (
                    <article key={post.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-gray-600 transition-colors">
                      {post.featuredImage ? (
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] flex items-center justify-center">
                          <div className="text-center">
                            <h3 className="text-white font-bold text-lg">{post.title.substring(0, 30)}...</h3>
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                          <span>{format(new Date(post.createdAt), 'MMM dd')}</span>
                          <span>{readingTime(post.content)} min</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-3 hover:text-[hsl(24,95%,53%)] transition-colors">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {post.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                                +{post.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <Link href={`/blog/${post.slug}`}>
                          <span className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,38%)] text-sm transition-colors">
                            Read More →
                          </span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
              <p className="text-gray-400 mb-8">
                We're working on bringing you expert insights and tutorials on reality capture technology. 
                Check back soon for the latest industry knowledge and practical guides.
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-[hsl(24,95%,53%)]">Drone Mapping</h3>
                  <p className="text-gray-400 text-sm">Complete guides on aerial surveying and photogrammetry workflows</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-[hsl(199,89%,48%)]">LiDAR Technology</h3>
                  <p className="text-gray-400 text-sm">Deep dives into scanning techniques and point cloud processing</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-2 text-[hsl(158,64%,52%)]">Industry Regulations</h3>
                  <p className="text-gray-400 text-sm">Updates on FAA regulations and best practices for professionals</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}