import { useEffect } from "react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ExternalLink, BookOpen, Video, Wrench, Shield, Newspaper, Lightbulb } from "lucide-react";

export default function Resources() {
  useEffect(() => {
    document.title = "Resources - Six1Five Studio | Reality Capture Guides & Tools";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Free reality capture resources, guides, and tools. Learn about drone mapping, LiDAR scanning, photogrammetry best practices, and industry regulations.");
    }
  }, []);

  const resourceCategories = [
    {
      title: "Concept Studies",
      icon: Lightbulb,
      color: "hsl(280,70%,60%)",
      description: "Experimental design studies blending Reality Capture workflows with environmental analysis and digital visualization. Exploratory projects that showcase technical expertise beyond traditional scanning services.",
      items: [
        {
          title: "Nashville Parthenon Solar Analysis",
          description: "Architectural analysis exploring sun path modeling, structural load paths, and conceptual solar retrofit integration — demonstrating site analysis expertise complementary to reality capture services.",
          type: "Concept Study",
          link: "/case-study/parthenon",
          internal: true
        }
      ]
    },
    {
      title: "Downloadable Guides",
      icon: FileText,
      color: "hsl(24,95%,53%)",
      items: [
        {
          title: "Reality Capture Buyer's Guide",
          description: "Everything you need to know before hiring a reality capture service provider.",
          type: "PDF Guide",
          status: "Coming Soon"
        },
        {
          title: "Drone Mapping Project Checklist",
          description: "Essential checklist for planning and executing successful drone mapping projects.",
          type: "PDF Checklist",
          status: "Coming Soon"
        },
        {
          title: "LiDAR vs Photogrammetry Comparison",
          description: "Technical comparison to help you choose the right capture method for your project.",
          type: "PDF Guide",
          status: "Coming Soon"
        }
      ]
    },
    {
      title: "Industry Resources",
      icon: BookOpen,
      color: "hsl(199,89%,48%)",
      items: [
        {
          title: "FAA Drone Regulations",
          description: "Official Part 107 regulations and requirements for commercial drone operations.",
          link: "https://www.faa.gov/uas/commercial_operators",
          type: "External Link"
        },
        {
          title: "ASPRS Standards",
          description: "American Society for Photogrammetry and Remote Sensing accuracy standards.",
          link: "https://www.asprs.org/",
          type: "External Link"
        },
        {
          title: "BIM Standards (NBIMS-US)",
          description: "National Building Information Modeling Standards for the United States.",
          link: "https://www.nationalbimstandard.org/",
          type: "External Link"
        }
      ]
    },
    {
      title: "Technical Specifications",
      icon: Wrench,
      color: "hsl(158,64%,52%)",
      items: [
        {
          title: "Common Deliverable Formats",
          description: "Orthomosaics, Point Clouds, 3D Models - Learn about standard output formats.",
          type: "Info Page",
          status: "Coming Soon"
        },
        {
          title: "Accuracy & Resolution Guide",
          description: "Understanding GSD, point density, and accuracy requirements for different applications.",
          type: "Technical Doc",
          status: "Coming Soon"
        },
        {
          title: "CAD/BIM Integration",
          description: "How reality capture data integrates with AutoCAD, Revit, and other design software.",
          type: "Integration Guide",
          status: "Coming Soon"
        }
      ]
    },
    {
      title: "Video Tutorials",
      icon: Video,
      color: "hsl(280,70%,60%)",
      items: [
        {
          title: "Reading Point Cloud Data",
          description: "Learn how to interpret and navigate point cloud data for your projects.",
          type: "Video Tutorial",
          status: "Coming Soon"
        },
        {
          title: "Understanding Orthomosaics",
          description: "How to use and measure from georeferenced orthomosaic imagery.",
          type: "Video Tutorial",
          status: "Coming Soon"
        },
        {
          title: "3D Model Viewer Tutorial",
          description: "Navigate and extract measurements from interactive 3D models.",
          type: "Video Tutorial",
          status: "Coming Soon"
        }
      ]
    }
  ];

  const latestInsights = [
    {
      title: "The Future of Construction Technology",
      excerpt: "How LiDAR, BIM, and AI are revolutionizing the AEC industry.",
      slug: "the-future-of-construction-how-lidar-bim-and-ai-are-revolutionizing-the-industry"
    },
    {
      title: "AI Agents and Digital Twins",
      excerpt: "The new era of operational intelligence transforming AEC technology.",
      slug: "the-new-era-of-operational-intelligence-ai-agents-and-digital-twins-transform-aec-technology"
    },
    {
      title: "GIS and CAD Integration",
      excerpt: "5 overlapping areas between GIS and CAD and why they matter.",
      slug: "overlapping-areas-gis-cad"
    }
  ];

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />

      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[hsl(158,64%,52%)] text-white">Knowledge Base</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Reality Capture <span className="text-[hsl(158,64%,52%)]">Resources</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Free guides, tools, and educational resources to help you understand and leverage reality capture technology for your projects.
            </p>
          </div>

          {/* Resource Categories */}
          <div className="space-y-12">
            {resourceCategories.map((category, idx) => {
              const IconComponent = category.icon;
              return (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                      <IconComponent className="w-6 h-6" style={{ color: category.color }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.title}</h2>
                      {'description' in category && (
                        <p className="text-sm text-gray-400 mt-1 max-w-3xl">{category.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item, itemIdx) => (
                      <Card key={itemIdx} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-lg text-white">{item.title}</CardTitle>
                            {'status' in item && item.status && (
                              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                                {item.status}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-gray-400">
                            {item.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {item.type}
                            </Badge>
                            {'link' in item && item.link ? (
                              'internal' in item && item.internal ? (
                                <Link href={item.link}>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600 hover:border-[hsl(280,70%,60%)] hover:text-[hsl(280,70%,60%)]"
                                  >
                                    Explore Study
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-gray-600"
                                  onClick={() => window.open(item.link, '_blank')}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600"
                                disabled={'status' in item && item.status === "Coming Soon"}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Latest Insights Section */}
          <div className="mt-16 pt-12 border-t border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700">
                <Newspaper className="w-6 h-6 text-[hsl(199,89%,48%)]" />
              </div>
              <h2 className="text-2xl font-bold">Latest Insights</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {latestInsights.map((article, idx) => (
                <Link key={idx} href={`/blog/${article.slug}`}>
                  <Card className="bg-gray-800 border-gray-700 hover:border-[hsl(199,89%,48%)] transition-all cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-lg text-white hover:text-[hsl(199,89%,48%)] transition-colors">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="ghost" size="sm" className="text-[hsl(199,89%,48%)] hover:text-[hsl(199,89%,38%)] p-0">
                        Read Article →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] rounded-xl p-8">
            <Shield className="w-12 h-12 mx-auto mb-4 text-white" />
            <h2 className="text-2xl font-bold mb-4 text-white">Need Expert Guidance?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Have questions about reality capture for your specific project? Schedule a free consultation to discuss your needs.
            </p>
            <Link href="/#contact">
              <Button size="lg" className="bg-white text-[hsl(24,95%,53%)] hover:bg-gray-100 font-semibold">
                Schedule Free Consultation
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
