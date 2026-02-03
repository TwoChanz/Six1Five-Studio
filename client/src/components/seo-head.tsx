import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  canonicalUrl?: string;
  noindex?: boolean;
}

/**
 * SEO Head component for managing meta tags
 *
 * Usage:
 * <SEOHead
 *   title="Page Title - Six1Five Studio"
 *   description="Page description for SEO"
 *   keywords="keyword1, keyword2, keyword3"
 *   ogImage="/images/og-image.jpg"
 * />
 */
export function SEOHead({
  title,
  description,
  keywords,
  ogImage = 'https://six1fivestudio.com/images/og-default.webp',
  ogType = 'website',
  canonicalUrl,
  noindex = false,
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, content: string) => {
      let element = document.querySelector(selector);

      if (!element) {
        element = document.createElement('meta');
        const [attr, value] = selector.includes('property=')
          ? ['property', selector.match(/property="([^"]+)"/)?.[1]]
          : ['name', selector.match(/name="([^"]+)"/)?.[1]];

        if (value) {
          element.setAttribute(attr, value);
          document.head.appendChild(element);
        }
      }

      if (element) {
        element.setAttribute('content', content);
      }
    };

    // Basic meta tags
    updateMetaTag('meta[name="description"]', description);

    if (keywords) {
      updateMetaTag('meta[name="keywords"]', keywords);
    }

    if (noindex) {
      updateMetaTag('meta[name="robots"]', 'noindex, nofollow');
    } else {
      updateMetaTag('meta[name="robots"]', 'index, follow');
    }

    // Open Graph meta tags (Facebook, LinkedIn)
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:type"]', ogType);
    updateMetaTag('meta[property="og:image"]', ogImage);

    if (canonicalUrl) {
      updateMetaTag('meta[property="og:url"]', canonicalUrl);
    }

    updateMetaTag('meta[property="og:site_name"]', 'Six1Five Studio');
    updateMetaTag('meta[property="og:locale"]', 'en_US');

    // Twitter Card meta tags
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', ogImage);

    // Additional SEO tags
    updateMetaTag('meta[name="author"]', 'Six1Five Studio');
    updateMetaTag('meta[name="theme-color"]', '#1a1e29'); // Dark theme color

    // Canonical URL (helps prevent duplicate content issues)
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', canonicalUrl);
    }

    // Mobile optimization
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
      document.head.appendChild(viewport);
    }

  }, [title, description, keywords, ogImage, ogType, canonicalUrl, noindex]);

  return null; // This component doesn't render anything visible
}

/**
 * Helper function to generate full URL for canonical links
 * @param path - The path without domain (e.g., "/gallery")
 * @returns Full URL (e.g., "https://six1fivestudio.com/gallery")
 */
export function getCanonicalUrl(path: string): string {
  // In production, this should be your actual domain
  const domain = import.meta.env.PROD
    ? 'https://six1fivestudio.com' // Update this with your actual domain
    : 'http://localhost:5000';

  return `${domain}${path}`;
}
