import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SEOHead, getCanonicalUrl } from "@/components/seo-head";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";
import logoCircular from "@/assets/logo-circular-large.webp";

export default function Blog() {
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
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
      <SEOHead
        title="Reality Capture Blog - Six1Five Studio | Industry Insights & Tutorials"
        description="Expert insights on reality capture, drone mapping, LiDAR scanning, and photogrammetry for AEC professionals. Learn about the latest techniques, regulations, and best practices in Nashville and Tennessee."
        keywords="reality capture blog, drone mapping tutorials, LiDAR scanning insights, photogrammetry techniques, AEC technology blog, construction documentation"
        canonicalUrl={getCanonicalUrl('/blog')}
      />
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
            <div className="flex flex-col items-center justify-center py-20">
              <img
                src={logoCircular}
                alt="Six1Five Studio Loading"
                className="w-32 h-32 mb-6 animate-pulse"
              />
              <p className="text-gray-400 text-lg">Loading insights...</p>
            </div>
          ) : blogPosts && Array.isArray(blogPosts) && blogPosts.length > 0 ? (
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
                      {!featuredPost.substackEmbedCode && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{readingTime(featuredPost.content)} min read</span>
                        </div>
                      )}
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
                      {featuredPost.tags?.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-[hsl(24,95%,53%)]/90 hover:bg-[hsl(24,95%,53%)] text-white font-semibold px-3 py-1 shadow-sm transition-colors">
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
                    <article key={post.id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-[hsl(199,89%,48%)]/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
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
                          {!post.substackEmbedCode && <span>{readingTime(post.content)} min</span>}
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
                              <Badge key={i} variant="outline" className="text-xs border-[hsl(199,89%,48%)]/60 bg-[hsl(199,89%,48%)]/10 text-gray-200 font-medium hover:bg-[hsl(199,89%,48%)]/20 transition-colors">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs border-[hsl(199,89%,48%)]/60 bg-[hsl(199,89%,48%)]/10 text-gray-200 font-medium">
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

          {/* Substack CTA Section - Preserved from insights page */}
          {blogPosts && blogPosts.length > 0 && (
            <div className="mt-16 text-center bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-white">Stay Updated with Digital Blueprint</h2>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Subscribe to Digital Blueprint on Substack for weekly insights on AEC technology, reality capture, and digital innovation.
              </p>
              <a
                href="https://digitalblueprint.substack.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="bg-white text-[hsl(24,95%,53%)] hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Subscribe on Substack
                  <ArrowRight className="w-4 h-4" />
                </button>
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}