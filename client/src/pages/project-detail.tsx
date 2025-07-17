import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Eye, Calendar, Layers, Building, Play } from "lucide-react";
import { getQueryFn } from "@/lib/queryClient";
import { ModelViewer } from "@/components/model-viewer";
import { GLBModelViewer } from "@/components/glb-model-viewer";
import type { PortfolioItem } from "@shared/schema";
import Navbar from "@/components/navbar";

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

const SketchfabEmbed = ({ modelId, title }: { modelId: string; title: string }) => (
  <div className="aspect-video relative bg-gray-800 rounded-lg overflow-hidden">
    <iframe
      src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&camera=0`}
      title={title}
      frameBorder="0"
      allow="autoplay; fullscreen; vr"
      allowFullScreen
      className="w-full h-full"
      loading="lazy"
    />
  </div>
);

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['/api/portfolio/slug', slug],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!slug,
  });

  const IconComponent = project ? getIconForCategory(project.category) : Building;
  const iconColor = project ? getColorForCategory(project.category) : 'text-[hsl(158,64%,52%)]';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="mb-8">
              <Skeleton className="h-10 w-32 mb-4 bg-gray-700" />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <Skeleton className="h-12 mb-4 bg-gray-700" />
                <Skeleton className="h-6 w-24 mb-6 bg-gray-700" />
                <Skeleton className="h-32 mb-8 bg-gray-700" />
                <Skeleton className="h-8 w-48 mb-4 bg-gray-700" />
                <div className="grid grid-cols-3 gap-2 mb-8">
                  <Skeleton className="h-6 bg-gray-700" />
                  <Skeleton className="h-6 bg-gray-700" />
                  <Skeleton className="h-6 bg-gray-700" />
                </div>
                <Skeleton className="h-12 w-40 bg-gray-700" />
              </div>
              
              <Skeleton className="aspect-video bg-gray-700 rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
        <Navbar />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
              <p className="text-gray-400 mb-8">The project you're looking for doesn't exist or has been removed.</p>
              <Link href="/">
                <Button className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(218,11%,15%)] text-white font-sans">
      <Navbar />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-6">
          {/* Back navigation */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Project Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className={`w-8 h-8 ${iconColor}`} />
                <h1 className="text-4xl font-bold">{project.title}</h1>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="secondary" className="bg-[hsl(24,95%,53%)] text-white">
                  {project.category}
                </Badge>
                {project.createdAt && (
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>

              {/* Tools */}
              {project.tools && project.tools.length > 0 && (
                <div className="mb-8">
                  <h3 className={`${iconColor} font-semibold text-lg mb-3 flex items-center gap-2`}>
                    <Layers className="w-5 h-5" />
                    Tools Used
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {project.tools.map((tool, i) => (
                      <Badge key={i} variant="outline" className="border-gray-500 text-gray-200 justify-start">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Services */}
              {project.services && project.services.length > 0 && (
                <div className="mb-8">
                  <h3 className={`${iconColor} font-semibold text-lg mb-3 flex items-center gap-2`}>
                    <Building className="w-5 h-5" />
                    Services Provided
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.services.map((service, i) => (
                      <Badge key={i} variant="secondary" className="bg-gray-700 text-gray-200">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* External Link */}
              {project.sketchfabModelId && (
                <div className="flex gap-3">
                  <a 
                    href={`https://sketchfab.com/3d-models/${project.sketchfabModelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Sketchfab
                  </a>
                </div>
              )}
            </div>

            {/* 3D Viewer */}
            <div className="lg:sticky lg:top-24">
              {project.viewerType === 'polycam' && project.modelFile ? (
                <div className="bg-gray-800 rounded-xl p-4">
                  <iframe
                    src={project.modelFile}
                    title={`${project.title} 3D Capture`}
                    style={{
                      height: '600px',
                      width: '100%',
                      borderRadius: '12px',
                      border: '0'
                    }}
                    frameBorder="0"
                    allowFullScreen
                  />
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">Polycam 3D Capture</p>
                  </div>
                </div>
              ) : project.viewerType === 'local' && project.modelFile && project.modelFormat === 'glb' ? (
                <div className="bg-gray-800 rounded-xl p-4">
                  <GLBModelViewer 
                    src={project.modelFile} 
                    title={project.title} 
                    className="rounded-lg"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">Interactive 3D Model</p>
                  </div>
                </div>
              ) : project.sketchfabModelId ? (
                <div className="bg-gray-800 rounded-xl p-4">
                  <SketchfabEmbed modelId={project.sketchfabModelId} title={project.title} />
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">Sketchfab 3D Model</p>
                  </div>
                </div>
              ) : project.modelFile && project.modelFormat ? (
                <div className="bg-gray-800 rounded-xl p-4">
                  <ModelViewer 
                    modelFile={project.modelFile} 
                    modelFormat={project.modelFormat as 'glb' | 'gltf' | 'obj'} 
                    title={project.title} 
                    className="rounded-lg h-96"
                  />
                  <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    Interactive 3D
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-sm">Interactive 3D Model</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 rounded-xl p-6 text-center">
                  <img 
                    src={project.featuredImage || "https://images.unsplash.com/photo-1577223625816-7546f13df25d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"} 
                    alt={project.title} 
                    className="rounded-lg w-full h-auto mb-4" 
                  />
                  <p className="text-gray-400">3D model not available for this project</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Project Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.images.map((image, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl overflow-hidden">
                    <img 
                      src={image} 
                      alt={`${project.title} - Image ${index + 1}`} 
                      className="w-full h-64 object-cover" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}