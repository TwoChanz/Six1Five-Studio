import { useState, useRef, useCallback, useEffect } from "react";

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  /** Aspect ratio as width/height (e.g., 16/9, 4/3, 1). Auto-detects from image if not provided. */
  aspectRatio?: number;
}

export function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
  aspectRatio,
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [detectedAspectRatio, setDetectedAspectRatio] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detect aspect ratio from the after image if not provided
  useEffect(() => {
    if (!aspectRatio) {
      const img = new Image();
      img.onload = () => {
        setDetectedAspectRatio(img.width / img.height);
      };
      img.src = afterImage;
    }
  }, [afterImage, aspectRatio]);

  // Track container width for proper image sizing
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Use provided aspect ratio, detected ratio, or fallback to 4:3
  const finalAspectRatio = aspectRatio || detectedAspectRatio || (4/3);
  const paddingBottom = `${(1 / finalAspectRatio) * 100}%`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl cursor-ew-resize select-none ${className}`}
      style={{ paddingBottom }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Before Image (Full width, static background on left) */}
      <div className="absolute inset-0">
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* After Image (Revealed from right side as slider moves left) */}
      <div
        className="absolute top-0 bottom-0 right-0 overflow-hidden"
        style={{ width: `${100 - sliderPosition}%` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="h-full object-cover object-right"
          style={{ 
            width: containerWidth > 0 ? `${containerWidth}px` : '100vw',
            marginLeft: `${-sliderPosition}%`
          }}
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gray-200">
          <div className="flex items-center gap-0.5">
            <svg
              className="w-3 h-3 text-gray-600 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm font-medium z-20">
        {beforeLabel}
      </div>
      <div className="absolute top-4 right-4 px-3 py-1.5 bg-drone-orange/90 backdrop-blur-sm rounded-full text-white text-sm font-medium z-20">
        {afterLabel}
      </div>

      {/* Instruction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white/80 text-xs z-20 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isDragging ? 0 : 0.8 }}
      >
        ← Drag to compare →
      </div>
    </div>
  );
}

