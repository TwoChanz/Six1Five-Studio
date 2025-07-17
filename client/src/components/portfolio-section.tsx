import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@shared/projects";



export default function PortfolioSection() {
  const featuredProjects = getFeaturedProjects();
  const isLoading = false; // Static data, no loading needed


  return (
    <section id="portfolio" className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">
          Featured <span className="text-[hsl(199,89%,48%)]">Captures</span>
        </h2>
        
        {isLoading ? (
          <div className="space-y-16">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Skeleton className="h-8 mb-4 bg-gray-700" />
                  <Skeleton className="h-24 mb-6 bg-gray-700" />
                  <div className="space-y-2 mb-8">
                    <Skeleton className="h-4 bg-gray-700" />
                    <Skeleton className="h-4 bg-gray-700" />
                    <Skeleton className="h-4 bg-gray-700" />
                  </div>
                  <Skeleton className="h-12 w-32 bg-gray-700" />
                </div>
                <Skeleton className="aspect-video bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {featuredProjects.map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isReverse={index % 2 === 1}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Link href="/gallery">
            <Button className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500">
              Explore Full Gallery
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
