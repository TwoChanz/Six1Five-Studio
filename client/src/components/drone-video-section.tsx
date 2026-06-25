import { useRef, useState } from "react";
import { Play } from "lucide-react";

export default function DroneVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <section id="work" className="py-20 bg-[hsl(218,11%,12%)]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Aerial <span className="text-[var(--accent-blue)]">Showcase</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
          Full drone footage from a recent Nashville-area capture — 1920×1080 aerial overview.
        </p>

        <div className="max-w-5xl mx-auto relative rounded-xl overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-white/10">
          {/* Click-to-play poster overlay — visible until first play */}
          {!isPlaying && (
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 z-10 flex items-center justify-center group"
              aria-label="Play drone footage"
            >
              {/* Poster as background via the video's poster attribute on the element below,
                  so this div just provides the play button affordance */}
              <div className="w-20 h-20 rounded-full bg-black/60 border-2 border-white/70 flex items-center justify-center group-hover:bg-[var(--primary-blue)]/80 group-hover:border-[var(--primary-blue)] transition-all duration-300 backdrop-blur-sm shadow-xl">
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </div>
            </button>
          )}

          {/* Lazy-loaded video with native controls */}
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            controls
            muted
            preload="none"
            poster="/video/chaney-hero-poster.jpg"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          >
            <source src="/video/chaney-hero-1080p.webm" type="video/webm" />
            <source src="/video/chaney-hero-1080p.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        </div>
      </div>
    </section>
  );
}
