interface SketchfabEmbedProps {
  modelId: string;
  title: string;
  className?: string;
}

export function SketchfabEmbed({ modelId, title, className = '' }: SketchfabEmbedProps) {
  return (
    <div className={`relative bg-gray-900 rounded-xl overflow-hidden ${className}`}>
      <iframe
        src={`https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&ui_controls=1&ui_infos=0&ui_stop=0&ui_watermark=0`}
        width="100%"
        height="400"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        title={title}
        className="rounded-lg"
      />
      
      {/* Model info badge */}
      <div className="absolute bottom-4 left-4 z-10 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
        Sketchfab Model
      </div>
    </div>
  );
}