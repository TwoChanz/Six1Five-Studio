import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog', slug],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!slug,
  });

  useEffect(() => {
    if (post) {
      document.title = `${post.title} - Six1Five Studio Blog | Reality Capture Insights`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", post.excerpt || "Blog post from Six1Five Studio");
      }
    }
  }, [post]);

  const readingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post?.title || '';

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shareTitle,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      // You could add a toast notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8 bg-gray-700" />
            <Skeleton className="h-12 mb-4 bg-gray-700" />
            <Skeleton className="h-64 mb-8 bg-gray-700" />
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 bg-gray-700" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
            <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been moved.</p>
            <Link href="/blog">
              <Button className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <article className="container mx-auto px-6 max-w-4xl">
          {/* Back to Blog Link */}
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{readingTime(post.content)} min read</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="text-gray-400 hover:text-white p-0"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-400 leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-[hsl(24,95%,53%)] text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
            />
          </div>

          {/* Article Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <h3 className="text-lg font-semibold mb-2">About Six1Five Studio</h3>
                <p className="text-gray-400 max-w-md">
                  Professional reality capture services specializing in drone mapping, LiDAR scanning, 
                  and photogrammetry for the AEC industry and heritage documentation.
                </p>
              </div>
              
              <div className="text-center">
                <Link href="/#contact">
                  <Button className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-6 py-3">
                    Start Your Project
                  </Button>
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}