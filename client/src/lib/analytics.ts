// Google Analytics 4 helper functions

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics not configured. Set VITE_GA_MEASUREMENT_ID environment variable.');
    return;
  }

  // Load GA script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true, // GDPR compliance
  });

  console.log('Google Analytics initialized:', GA_MEASUREMENT_ID);
};

// Track page views
export const trackPageView = (url: string) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  window.gtag('event', eventName, eventParams);
};

// Common event tracking helpers
export const analytics = {
  // Contact form submission
  contactFormSubmit: (projectType: string) => {
    trackEvent('contact_form_submit', {
      event_category: 'engagement',
      event_label: projectType,
    });
  },

  // Portfolio item view
  portfolioView: (projectTitle: string, category: string) => {
    trackEvent('portfolio_view', {
      event_category: 'engagement',
      event_label: projectTitle,
      project_category: category,
    });
  },

  // 3D model interaction
  modelInteraction: (modelId: string, action: 'view' | 'fullscreen') => {
    trackEvent('model_interaction', {
      event_category: 'engagement',
      event_label: modelId,
      action_type: action,
    });
  },

  // CTA clicks
  ctaClick: (ctaName: string, location: string) => {
    trackEvent('cta_click', {
      event_category: 'conversion',
      event_label: ctaName,
      cta_location: location,
    });
  },

  // File upload
  fileUpload: (fileCount: number, totalSize: number) => {
    trackEvent('file_upload', {
      event_category: 'engagement',
      file_count: fileCount,
      total_size_mb: Math.round(totalSize / 1024 / 1024 * 100) / 100,
    });
  },

  // Gallery filter
  galleryFilter: (category: string) => {
    trackEvent('gallery_filter', {
      event_category: 'engagement',
      filter_category: category,
    });
  },

  // External link clicks
  externalLink: (url: string, linkText: string) => {
    trackEvent('external_link', {
      event_category: 'engagement',
      event_label: linkText,
      destination_url: url,
    });
  },
};
