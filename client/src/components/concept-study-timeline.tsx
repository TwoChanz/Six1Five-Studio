import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Phase {
  number: number;
  title: string;
  description: string;
  imagePath: string;
}

interface ConceptStudyTimelineProps {
  images: string[];
  title: string;
}

// Phase metadata for the Parthenon study
const phaseMetadata: Record<number, { title: string; description: string }> = {
  1: {
    title: "East Elevation Photo",
    description: "Original photographic documentation of the Parthenon's iconic east façade, capturing current conditions and architectural details."
  },
  2: {
    title: "Line Drawing Analysis",
    description: "Technical line drawing highlighting key structural elements, proportions, and classical architectural features."
  },
  3: {
    title: "Axonometric View",
    description: "Three-dimensional axonometric projection revealing the building's volumetric form and spatial relationships."
  },
  4: {
    title: "Structural Load Paths",
    description: "Analysis of structural load distribution through columns, walls, and foundation systems using color-coded load path visualization."
  },
  5: {
    title: "Solar Study",
    description: "Comprehensive solar analysis showing sun exposure patterns throughout the day - morning, noon, and evening conditions."
  },
  6: {
    title: "Sun Path Plan",
    description: "Plan view diagram mapping solar trajectories and shadow patterns across different seasons and times of day."
  },
  8: {
    title: "Solar Retrofit Concept",
    description: "Conceptual integration of modern photovoltaic technology with historic architecture - exploring sustainable adaptation."
  }
};

export default function ConceptStudyTimeline({ images, title }: ConceptStudyTimelineProps) {
  const [activePhase, setActivePhase] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Parse phase numbers from image paths
  const phases: Phase[] = images.map((imagePath, index) => {
    const phaseMatch = imagePath.match(/Phase-(\d+)/);
    const phaseNumber = phaseMatch ? parseInt(phaseMatch[1]) : index + 1;
    const metadata = phaseMetadata[phaseNumber] || {
      title: `Phase ${phaseNumber}`,
      description: "Analysis phase"
    };

    return {
      number: phaseNumber,
      title: metadata.title,
      description: metadata.description,
      imagePath
    };
  });

  const currentPhase = phases[activePhase];

  const handleNext = () => {
    if (activePhase < phases.length - 1) {
      changePhase(activePhase + 1);
    }
  };

  const handlePrevious = () => {
    if (activePhase > 0) {
      changePhase(activePhase - 1);
    }
  };

  const changePhase = (newIndex: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActivePhase(newIndex);
      setIsTransitioning(false);
    }, 200);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhase]);

  // Auto-scroll timeline marker into view
  useEffect(() => {
    if (timelineRef.current) {
      const activeMarker = timelineRef.current.children[activePhase] as HTMLElement;
      if (activeMarker) {
        activeMarker.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }
  }, [activePhase]);

  return (
    <div className="space-y-8">
      {/* Main Image Display */}
      <div className="relative">
        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-900 shadow-2xl">
          <img
            ref={imageRef}
            src={currentPhase.imagePath}
            alt={`${title} - ${currentPhase.title}`}
            className={cn(
              "w-full h-full object-contain transition-opacity duration-200",
              isTransitioning ? "opacity-0" : "opacity-100"
            )}
          />

          {/* Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            <Button
              onClick={handlePrevious}
              disabled={activePhase === 0}
              className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white disabled:opacity-30"
              size="icon"
              aria-label="Previous phase"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              onClick={handleNext}
              disabled={activePhase === phases.length - 1}
              className="pointer-events-auto bg-black/50 hover:bg-black/70 text-white disabled:opacity-30"
              size="icon"
              aria-label="Next phase"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>

          {/* Phase Counter */}
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
            <span className="text-white font-semibold">
              Phase {currentPhase.number} of {phases.length}
            </span>
          </div>
        </div>

        {/* Phase Info */}
        <div className="mt-6 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">{currentPhase.number}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">
                {currentPhase.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {currentPhase.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline */}
      <div className="relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-700 rounded-full" />

        <div
          ref={timelineRef}
          className="relative flex items-center justify-between gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }}
        >
          {phases.map((phase, index) => (
            <button
              key={index}
              onClick={() => changePhase(index)}
              className={cn(
                "relative flex-shrink-0 group transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(24,95%,53%)] focus:ring-offset-2 focus:ring-offset-gray-900 rounded-full"
              )}
              aria-label={`Go to ${phase.title}`}
            >
              {/* Timeline Marker */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-4 transition-all duration-300",
                  "flex items-center justify-center font-bold",
                  index === activePhase
                    ? "bg-gradient-to-br from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] border-white scale-110 shadow-lg shadow-[hsl(24,95%,53%)]/50"
                    : index < activePhase
                    ? "bg-gray-600 border-gray-500 hover:scale-105"
                    : "bg-gray-800 border-gray-600 hover:scale-105"
                )}
              >
                <span className={cn(
                  "text-sm",
                  index === activePhase ? "text-white" : "text-gray-400"
                )}>
                  {phase.number}
                </span>
              </div>

              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {phase.title}
              </div>

              {/* Progress Connector */}
              {index < phases.length - 1 && (
                <div
                  className={cn(
                    "absolute left-full top-1/2 -translate-y-1/2 h-1 transition-all duration-500",
                    index < activePhase ? "bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)]" : "bg-gray-700"
                  )}
                  style={{ width: "calc(100% + 1rem)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard Hint */}
      <div className="text-center text-sm text-gray-500">
        <p>Use arrow keys ← → or click timeline markers to navigate phases</p>
      </div>
    </div>
  );
}
