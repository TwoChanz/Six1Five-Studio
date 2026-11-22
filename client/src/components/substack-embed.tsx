import { useEffect, useRef } from 'react';

interface SubstackEmbedProps {
  embedCode: string;
  className?: string;
}

/**
 * SubstackEmbed Component
 * 
 * Renders Substack post embeds by injecting the embed HTML and loading the Substack embed script.
 * 
 * @param embedCode - The full Substack embed code including the div and script tag
 * @param className - Optional additional CSS classes
 */
export function SubstackEmbed({ embedCode, className = '' }: SubstackEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !embedCode) return;

    // Extract just the div content (without script tag)
    const divMatch = embedCode.match(/<div class="substack-post-embed">[\s\S]*?<\/div>/);
    if (!divMatch) {
      console.error('Invalid Substack embed code');
      return;
    }

    // Inject the embed div HTML
    containerRef.current.innerHTML = divMatch[0];

    // Load the Substack embed script if not already loaded
    if (!scriptLoadedRef.current && !document.querySelector('script[src*="substack.com/embedjs"]')) {
      const script = document.createElement('script');
      script.src = 'https://substack.com/embedjs/embed.js';
      script.async = true;
      script.charset = 'utf-8';
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }

    // If script is already loaded, manually trigger initialization
    if (scriptLoadedRef.current && (window as any).SubstackEmbed) {
      (window as any).SubstackEmbed.init();
    }
  }, [embedCode]);

  if (!embedCode) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className={`substack-embed-wrapper ${className}`}
      style={{
        margin: '2rem 0',
        padding: '1rem',
        borderRadius: '8px',
        background: 'rgba(255, 255, 255, 0.05)',
      }}
    />
  );
}







