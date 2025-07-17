import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, Play, Layers, Building } from "lucide-react";
import type { ProjectConfig } from "@shared/projects";

interface ProjectCardProps {
  project: ProjectConfig;
  isReverse?: boolean;
}

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

export default function ProjectCard({ project, isReverse = false }: ProjectCardProps) {
  const IconComponent = getIconForCategory(project.category);
  const iconColor = getColorForCategory(project.category);

  return (
    <div className={`grid lg:grid-cols-2 gap-12 items-center ${isReverse ? 'lg:grid-flow-col-dense' : ''}`}>
      {/* Project Info */}
      <div className={isReverse ? 'lg:col-start-2' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-3xl font-semibold">{project.title}</h3>
          <Badge variant="secondary" className="bg-[hsl(24,95%,53%)] text-white">
            {project.category}
          </Badge>
        </div>
        
        <p className="text-gray-400 mb-6 leading-relaxed">
          {project.description}
        </p>
        
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-6">
            <span className={`${iconColor} font-semibold mr-3`}>Tags:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((tag, i) => (
                <Badge key={i} variant="outline" className="border-gray-400 text-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Tools */}
        {project.tools && project.tools.length > 0 && (
          <div className="mb-6">
            <span className={`${iconColor} font-semibold mr-3`}>Tools:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tools.map((tool, i) => (
                <Badge key={i} variant="outline" className="border-gray-400 text-gray-200">
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex gap-3">
          <Link href={`/project/${project.slug}`}>
            <button className="bg-[hsl(24,95%,53%)] hover:bg-[hsl(24,95%,48%)] text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <Eye className="w-4 h-4 mr-2 inline" />
              View Project
            </button>
          </Link>
          <Link href="/gallery">
            <button className="border border-gray-500 text-gray-200 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors">
              View All Projects
            </button>
          </Link>
        </div>
      </div>
      
      {/* Static Image Thumbnail - Clickable */}
      <Link href={`/project/${project.slug}`} className={`relative block ${isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
        <div className="bg-gray-800 rounded-xl p-6 scanline-effect relative group cursor-pointer overflow-hidden">
          <img 
            src={project.thumbnail} 
            alt={project.title} 
            className="rounded-lg w-full h-auto transition-transform duration-300 group-hover:scale-105" 
          />
          
          {/* Overlay with hover effect */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-xl group-hover:bg-black/60 transition-all duration-300">
            <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <IconComponent className={`w-16 h-16 ${iconColor} mb-4 mx-auto`} />
              <p className="text-white font-semibold mb-2">View 3D Model</p>
              <p className="text-gray-300 text-sm mb-4">Interactive {project.viewerType} experience</p>
              <div className="inline-flex items-center text-white bg-black/60 hover:bg-black/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <ArrowRight className="w-4 h-4 mr-2" />
                Explore Project
              </div>
            </div>
          </div>

          {/* Badge indicators */}
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className="bg-black/70 text-white border-0">
              {project.category}
            </Badge>
          </div>
          
          {/* 3D indicator */}
          <div className="absolute top-4 right-4 z-10 bg-black/70 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2">
            <Eye className="w-3 h-3" />
            3D Ready
          </div>
        </div>
      </Link>
    </div>
  );
}