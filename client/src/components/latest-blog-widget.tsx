import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { format } from "date-fns";
import type { BlogPost } from "@shared/schema";


export default function LatestBlogWidget() {
  const { data: allPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Get only the latest 3 posts
  const posts = allPosts?.slice(0, 3) || [];

  return (
    <section className="py-16 bg-[hsl(218,11%,15%)]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[hsl(199,89%,48%)] text-white">
            <BookOpen className="w-3 h-3 mr-1" />
            Digital Blueprint
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="text-[hsl(199,89%,48%)]">Insights</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Exploring AEC technology, LiDAR, BIM, AI, and digital twins. Fresh perspectives from the field.
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[hsl(199,89%,48%)] animate-spin" />
          </div>
        )}

        {!isLoading && posts.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="bg-gray-800 border-gray-700 hover:border-[hsl(199,89%,48%)] transition-all group cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-[hsl(199,89%,48%)] transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {post.excerpt && (
                        <CardDescription className="text-gray-400 mb-4 line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
                      >
                        Read Article
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog">
                <Button className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)]">
                  View All Posts
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}

        {!isLoading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">No insights available at the moment.</p>
            <a
              href="https://digitalblueprint.substack.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-600">
                Visit Digital Blueprint
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

