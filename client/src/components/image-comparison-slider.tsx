import { useCallback, useEffect, useRef, useState } from "react";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Alt text for screen readers; labels are used if omitted. */
  beforeAlt?: string;
  afterAlt?: string;
  className?: string;
  /** Aspect ratio as width/height (e.g. 16/9). Auto-detected from the after image if omitted. */
  aspectRatio?: number;
  /** Initial divider position, 0–100. Default 50. */
  initialPosition?: number;
}

/**
 * Before/after image comparison.
 *
 * Both images are laid out identically at full container size; the "after"
 * layer is clipped with `clip-path: inset(0 0 0 X%)`. Because neither image
 * is ever resized or offset, the two halves stay perfectly registered no
 * matter where the divider is — which matters for orthomosaics, where a few
 * pixels of drift makes the comparison meaningless.
 *
 * Supports mouse, touch, and keyboard (arrow keys, Home/End) via role="slider".
 */
export function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  beforeAlt,
  afterAlt,
  className = "",
  aspectRatio,
  initialPosition = 50,
}: ImageComparisonSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [detectedRatio, setDetectedRatio] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect aspect ratio from the after image when not supplied.
  useEffect(() => {
    if (aspectRatio) return;
    const img = new Image();
    img.onload = () => setDetectedRatio(img.naturalWidth / img.naturalHeight);
    img.src = afterImage;
  }, [afterImage, aspectRatio]);

  const updateFromClientX = useCallback((clientX: number) => {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  // Pointer events cover mouse + touch + pen in one code path.
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateFromClientX(e.clientX);
  };
  const endDrag = () => setIsDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number | undefined> = {
      ArrowLeft: position - step,
      ArrowRight: position + step,
      Home: 0,
      End: 100,
    };
    const next = map[e.key];
    if (next === undefined) return;
    e.preventDefault();
    setPosition(Math.max(0, Math.min(100, next)));
  };

  const ratio = aspectRatio ?? detectedRatio ?? 4 / 3;

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
      className={`relative w-full overflow-hidden rounded-xl select-none touch-none outline-none focus-visible:ring-2 focus-visible:ring-[var(--logo-blue)] ${
        isDragging ? "cursor-grabbing" : "cursor-ew-resize"
      } ${className}`}
      style={{ aspectRatio: String(ratio) }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      {/* Before — full frame */}
      <img
        src={beforeImage}
        alt={beforeAlt ?? beforeLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="lazy"
      />

      {/* After — full frame, clipped from the left to the divider */}
      <img
        src={afterImage}
        alt={afterAlt ?? afterLabel}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
        draggable={false}
        loading="lazy"
      />

      {/* Divider + handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)] z-10 pointer-events-none"
        style={{ left: `calc(${position}% - 1px)` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white shadow-xl border border-gray-300 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm font-medium z-20 pointer-events-none">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[var(--tech-orange)]/90 backdrop-blur-sm text-white text-xs sm:text-sm font-medium z-20 pointer-events-none">
        {afterLabel}
      </span>

      {/* Hint, fades once the visitor interacts */}
      <span
        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white/80 text-xs z-20 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isDragging ? 0 : 0.85 }}
      >
        ← Drag to compare →
      </span>
    </div>
  );
}
