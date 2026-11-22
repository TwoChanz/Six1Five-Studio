import { useEffect, useRef, useState } from "react";
import { ExternalLink, ArrowRight, Box } from "lucide-react";
import { Link } from "wouter";
import featuredData from "@/data/featured-models.json";
import { ImageComparisonSlider } from "@/components/image-comparison-slider";
import { analytics } from "@/lib/analytics";
import { scrollToSection } from "@/lib/scroll";

/* ---------- Types for featured-models.json ---------- */

interface CaptureLink {
  label: string;
  /** External URL, a route like "/gallery", or a section id like "contact". */
  url: string;
  external: boolean;
}

interface CaptureBase {
  id: string;
  title: string;
  useCase: string;
  description: string;
  link?: CaptureLink;
}

interface SketchfabCapture extends CaptureBase {
  kind: "sketchfab";
  sketchfabModelId: string;
  /** Optional CSS brightness multiplier for the embed (1 = untouched, 0.85 = slightly darker). */
  brightness?: number;
}

interface CompareCapture extends CaptureBase {
  kind: "compare";
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  beforeAlt?: string;
  afterAlt?: string;
}

type FeaturedCapture = SketchfabCapture | CompareCapture;

interface FeaturedData {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  captures: FeaturedCapture[];
}

const data = featuredData as FeaturedData;

/* ---------- Viewers ---------- */

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
 * Sketchfab iframe that only mounts once its container scrolls near the
 * viewport, so embeds further down the page cost nothing until needed.
 */
function SketchfabViewer({ capture }: { capture: SketchfabCapture }) {
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

  return (
    <div ref={containerRef} className="aspect-video relative">
      {shouldLoad ? (
        <iframe
          title={capture.title}
          src={sketchfabEmbedUrl(capture.sketchfabModelId)}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
          style={
            capture.brightness !== undefined
              ? { filter: `brightness(${capture.brightness})` }
              : undefined
          }
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <Box className="w-10 h-10 animate-pulse" aria-hidden="true" />
        </div>
      )}
    </div>
  );
}

function CompareViewer({ capture }: { capture: CompareCapture }) {
  return (
    <ImageComparisonSlider
      beforeImage={capture.beforeImage}
      afterImage={capture.afterImage}
      beforeLabel={capture.beforeLabel}
      afterLabel={capture.afterLabel}
      beforeAlt={capture.beforeAlt}
      afterAlt={capture.afterAlt}
      className="rounded-none"
    />
  );
}

/* ---------- Link + card ---------- */

function CaptureLinkButton({ link, title }: { link: CaptureLink; title: string }) {
  const className =
    "inline-flex items-center gap-2 text-[var(--accent-blue)] hover:text-white font-medium transition-colors";

  if (link.external) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => analytics.externalLink(link.url, `Featured capture: ${title}`)}
        className={className}
      >
        {link.label}
        <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </a>
    );
  }

  // Internal: a route if it starts with "/", otherwise a same-page section id.
  if (link.url.startsWith("/")) {
    return (
      <Link href={link.url} onClick={() => analytics.ctaClick(link.label, "featured_captures")} className={className}>
        {link.label}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        analytics.ctaClick(link.label, "featured_captures");
        scrollToSection(link.url);
      }}
      className={className}
    >
      {link.label}
      <ArrowRight className="w-4 h-4" aria-hidden="true" />
    </button>
  );
}

function FeaturedCaptureCard({ capture, index }: { capture: FeaturedCapture; index: number }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="grid lg:grid-cols-5 gap-8 items-center">
      {/* Viewer — 3/5 of the row on desktop */}
      <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
        {capture.kind === "sketchfab" ? (
          <SketchfabViewer capture={capture} />
        ) : (
          <CompareViewer capture={capture} />
        )}
      </div>

      {/* Copy — 2/5 */}
      <div className="lg:col-span-2">
        <p className="text-5xl font-bold text-white/10 leading-none mb-3 select-none">{number}</p>
        <p className="text-sm uppercase tracking-wider text-[var(--logo-blue)] font-semibold mb-2">
          {capture.useCase}
        </p>
        <h3 className="text-2xl font-bold text-white mb-3">{capture.title}</h3>
        <p className="text-gray-400 leading-relaxed mb-6">{capture.description}</p>
        {capture.link && <CaptureLinkButton link={capture.link} title={capture.title} />}
      </div>
    </article>
  );
}

/* ---------- Section ---------- */

export default function FeaturedModelsSection() {
  return (
    <section id="work" className="py-20 bg-[hsl(218,11%,13%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--logo-blue)] font-semibold mb-3">
            {data.sectionLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{data.sectionTitle}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{data.sectionDescription}</p>
        </div>

        <div className="space-y-16">
          {data.captures.map((capture, index) => (
            <FeaturedCaptureCard key={capture.id} capture={capture} index={index} />
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
