import { useEffect, useRef, useState } from "react";
import { ExternalLink, Box } from "lucide-react";
import { Link } from "wouter";
import featuredData from "@/data/featured-models.json";
import { analytics } from "@/lib/analytics";

interface FeaturedModel {
  id: string;
  title: string;
  useCase: string;
  description: string;
  sketchfabModelId: string;
  fullModelUrl: string;
  /** Optional CSS brightness multiplier for the embed (1 = untouched, 0.85 = slightly darker). */
  brightness?: number;
}

interface FeaturedModelsData {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  models: FeaturedModel[];
}

const data = featuredData as FeaturedModelsData;

/**
 * Build the Sketchfab embed URL. `autostart=0` keeps the heavy WebGL context
 * from spinning up until the visitor clicks; `ui_theme=dark` matches the site.
 */
function sketchfabEmbedUrl(modelId: string): string {
  const params = new URLSearchParams({
    autostart: "0",
    preload: "1",
    ui_theme: "dark",
    ui_infos: "0",
    ui_watermark: "0",
    ui_stop: "0",
  });
  return `https://sketchfab.com/models/${modelId}/embed?${params.toString()}`;
}

/**
 * A single embedded model. The iframe is only mounted once the card scrolls
 * near the viewport (IntersectionObserver), so two embeds on the homepage
 * don't cost anything until someone actually scrolls to them.
 */
function FeaturedModelCard({ model, index }: { model: FeaturedModel; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <article className="grid lg:grid-cols-5 gap-8 items-center">
      {/* Viewer — takes 3/5 of the row on desktop */}
      <div
        ref={containerRef}
        className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl"
      >
        <div className="aspect-video relative">
          {shouldLoad ? (
            <iframe
              title={model.title}
              src={sketchfabEmbedUrl(model.sketchfabModelId)}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
              loading="lazy"
              style={
                model.brightness !== undefined
                  ? { filter: `brightness(${model.brightness})` }
                  : undefined
              }
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <Box className="w-10 h-10 animate-pulse" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Copy — 2/5 of the row */}
      <div className="lg:col-span-2">
        <p className="text-5xl font-bold text-white/10 leading-none mb-3 select-none">
          {stepNumber}
        </p>
        <p className="text-sm uppercase tracking-wider text-[var(--logo-blue)] font-semibold mb-2">
          {model.useCase}
        </p>
        <h3 className="text-2xl font-bold text-white mb-3">{model.title}</h3>
        <p className="text-gray-400 leading-relaxed mb-6">{model.description}</p>
        <a
          href={model.fullModelUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analytics.externalLink(model.fullModelUrl, `Featured model: ${model.title}`)}
          className="inline-flex items-center gap-2 text-[var(--accent-blue)] hover:text-white font-medium transition-colors"
        >
          View full-resolution model
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

export default function FeaturedModelsSection() {
  return (
    <section id="work" className="py-20 bg-[hsl(218,11%,13%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--logo-blue)] font-semibold mb-3">
            {data.sectionLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {data.sectionTitle}
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">{data.sectionDescription}</p>
        </div>

        <div className="space-y-16">
          {data.models.map((model, index) => (
            <FeaturedModelCard key={model.id} model={model} index={index} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors border border-white/15 hover:border-white/40 rounded-lg px-6 py-3"
          >
            See the full portfolio →
          </Link>
        </div>
      </div>
    </section>
  );
}
