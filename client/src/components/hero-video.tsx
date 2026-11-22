import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/scroll";
import { analytics } from "@/lib/analytics";

/**
 * The four things a client actually receives. Kept short and concrete —
 * this list is the first thing a visitor reads after the headline.
 */
const deliverables = [
  "Interactive 3D site models",
  "Orthomosaic maps & elevation data",
  "Aerial photography & video",
  "Browser-based delivery — no software",
];

export default function HeroVideo() {
  const handleCta = (target: "contact" | "work", label: string) => {
    analytics.ctaClick(label, "hero");
    scrollToSection(target);
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[hsl(218,11%,15%)]"
    >
      {/*
        Layer 0 — always-present fallback.
        The video/poster files in /public/video are not committed to git, so on a
        fresh deploy they may be missing. This gradient + grid guarantees the hero
        is never a flat black rectangle.
      */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(210,85%,22%)_0%,hsl(218,11%,15%)_55%,hsl(218,11%,10%)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />

      {/* Layer 1 — background video, hidden when prefers-reduced-motion is set */}
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

      {/* Layer 1b — static poster for prefers-reduced-motion (toggled via CSS) */}
      <div
        className="hero-video-poster absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/video/chaney-hero-poster.jpg')" }}
        aria-hidden="true"
      />

      {/* Layer 2 — dark scrim so text stays legible over any scene */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[hsl(218,11%,15%)] z-10" />

      {/* Layer 3 — content */}
      <div className="relative z-20 text-center px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto pt-24 pb-16">
        <p className="text-sm sm:text-base uppercase tracking-[0.2em] text-[var(--logo-blue)] mb-5 font-semibold">
          Six1Five Studio · Middle Tennessee
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white mb-6 drop-shadow-lg">
          See your site{" "}
          <span className="text-[var(--logo-blue)]">before you walk it.</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-gray-100 leading-relaxed mb-10 max-w-3xl mx-auto drop-shadow">
          Drone mapping and interactive 3D models for construction teams, land
          listings, and property owners — opened in a browser, shared with a link.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => handleCta("contact", "Request a Quote")}
            className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-10 py-6 text-lg font-semibold rounded-lg transition-colors shadow-lg"
          >
            Request a Quote
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCta("work", "View Our Work")}
            className="border-white/40 bg-white/5 hover:bg-white/15 text-white px-10 py-6 text-lg font-semibold rounded-lg transition-colors backdrop-blur-sm"
          >
            View Our Work
          </Button>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 max-w-2xl mx-auto text-left">
          {deliverables.map((item) => (
            <li key={item} className="flex items-start gap-3 text-gray-100">
              <span className="mt-1 flex-shrink-0 rounded-full bg-[var(--logo-blue)]/20 p-1">
                <Check className="w-4 h-4 text-[var(--logo-blue)]" aria-hidden="true" />
              </span>
              <span className="text-base sm:text-lg">{item}</span>
            </li>
          ))}
        </ul>
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
