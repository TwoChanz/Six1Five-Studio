export default function DroneVideoSection() {
  return (
    <section id="work" className="py-20 bg-[hsl(218,11%,12%)]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Aerial <span className="text-[var(--accent-blue)]">Showcase</span>
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto text-lg">
          Full drone footage from a recent Nashville-area capture — 1920×1080 aerial overview.
        </p>

        <div className="max-w-5xl mx-auto rounded-xl overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-white/10">
          <video
            className="w-full aspect-video object-cover"
            controls
            muted
            preload="none"
            poster="/video/chaney-hero-poster.jpg"
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
