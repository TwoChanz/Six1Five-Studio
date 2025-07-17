import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Eye, Calendar, Layers, Building, Play } from "lucide-react";
import { ModelViewer } from "@/components/model-viewer";
import { GLBModelViewer } from "@/components/glb-model-viewer";
import ProjectViewer from "@/components/ProjectViewer";
import TagBadge from "@/components/TagBadge";
import { getProjectBySlug } from "@shared/projects";
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
  
  const project = slug ? getProjectBySlug(slug) : undefined;

  const IconComponent = project ? getIconForCategory(project.category) : Building;
  const iconColor = project ? getColorForCategory(project.category) : 'text-[hsl(158,64%,52%)]';

  if (!project) {
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
              </div>

              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-gray-300 leading-relaxed text-lg">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className={`${iconColor} font-semibold text-lg mb-3 flex items-center gap-2`}>
                    <Eye className="w-5 h-5" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <TagBadge key={i} tag={tag} />
                    ))}
                  </div>
                </div>
              )}

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

              {/* External Link */}
              {project.viewerType === 'sketchfab' && project.viewerUrl && (
                <div className="flex gap-3">
                  <a 
                    href={project.viewerUrl.replace('/embed', '')}
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
            <ProjectViewer project={project} />
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gray-800 rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-4">Interested in Similar Work?</h2>
              <p className="text-gray-400 mb-6">
                Get in touch to discuss your reality capture project requirements
              </p>
              <a 
                href="mailto:contact@six1fivestudio.com?subject=Project%20Inquiry%20-%20Reality%20Capture"
                className="inline-flex items-center bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Get Quote
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}