import { Button } from "@/components/ui/button";

export default function HeroVideo() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background video — hidden when prefers-reduced-motion is set */}
      <video
        className="hero-video-bg absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/chaney-hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/video/chaney-hero-1080p.webm" type="video/webm" />
        <source src="/video/chaney-hero-1080p.mp4" type="video/mp4" />
      </video>

      {/* Static poster for prefers-reduced-motion — shown only via CSS media query */}
      <div
        className="hero-video-poster absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/video/chaney-hero-poster.jpg')" }}
        aria-hidden="true"
      />

      {/* Dark gradient scrim so text stays legible over any scene */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/70 z-10" />

      {/* Content overlay */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6 drop-shadow-lg">
          Reality Capture,{" "}
          <span className="text-[var(--logo-blue)]">From Above</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-100 leading-relaxed mb-10 max-w-3xl mx-auto drop-shadow">
          Drone mapping, LiDAR &amp; photogrammetry for AEC, real estate, and land — Nashville, TN.
        </p>

        <Button
          onClick={() => scrollToSection("work")}
          className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-10 py-4 text-lg font-semibold rounded-lg transition-colors shadow-lg"
        >
          View Our Work
        </Button>
      </div>

      {/* prefers-reduced-motion: hide video, show static poster instead */}
      <style>{`
        .hero-video-poster { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .hero-video-bg { display: none; }
          .hero-video-poster { display: block; }
        }
      `}</style>
    </section>
  );
}
