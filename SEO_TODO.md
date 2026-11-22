# SEO Implementation Progress

## Pages to Update

### ✅ Completed
- [x] Gallery (gallery.tsx) - Done

### 🔄 In Progress
- [ ] Home (home.tsx) - Primary landing page
- [ ] Pricing (pricing.tsx) - Important for conversions
- [ ] Blog (blog.tsx) - Content marketing
- [ ] Blog Post (blog-post.tsx) - Individual articles
- [ ] Resources (resources.tsx) - Lead generation
- [ ] FAQ (faq.tsx) - Long-tail SEO

### ⚠️ Special Cases
- [ ] Admin (admin.tsx) - Add noindex
- [ ] Not Found (not-found.tsx) - Add noindex
- [ ] Insights (insights.tsx) - Check if duplicate of blog

## SEO Component Usage Pattern

```tsx
import { SEOHead, getCanonicalUrl } from "@/components/seo-head";

// In component return:
<SEOHead
  title="Page Title - Six1Five Studio"
  description="150-160 character description for search engines"
  keywords="keyword1, keyword2, keyword3"
  canonicalUrl={getCanonicalUrl('/page-path')}
  ogImage="/images/og-page.jpg"
/>
```

## Page-Specific SEO Data

### Home
- Title: "Six1Five Studio | Professional Reality Capture & 3D Scanning Services"
- Description: "Expert drone mapping, LiDAR scanning, and photogrammetry services for AEC, real estate, and construction. Precision 3D data capture and digital twin solutions."
- Keywords: "reality capture, drone mapping, LiDAR scanning, photogrammetry, 3D scanning services, AEC technology, construction surveying, digital twins"
- Path: "/"

### Pricing
- Title: "Pricing - Six1Five Studio | Reality Capture Service Rates"
- Description: "Transparent pricing for professional drone mapping, LiDAR scanning, and photogrammetry services. Starting at $500. Get a free quote for your project."
- Keywords: "reality capture pricing, drone mapping cost, LiDAR rates, photogrammetry prices, surveying costs"
- Path: "/pricing"

### Blog
- Title: "Blog - Six1Five Studio | Reality Capture Insights & Industry News"
- Description: "Expert insights on drone mapping, LiDAR technology, construction tech, BIM integration, and the future of reality capture in the AEC industry."
- Keywords: "reality capture blog, drone technology articles, LiDAR insights, construction technology news, AEC innovation"
- Path: "/blog"

### Resources
- Title: "Resources - Six1Five Studio | Free Reality Capture Guides & Tools"
- Description: "Free reality capture resources, guides, and tools. Learn about drone mapping, LiDAR scanning, photogrammetry best practices, and industry regulations."
- Keywords: "reality capture resources, drone mapping guide, LiDAR tutorial, photogrammetry tools, surveying best practices"
- Path: "/resources"

### FAQ
- Title: "FAQ - Six1Five Studio | Reality Capture Questions Answered"
- Description: "Frequently asked questions about drone mapping, LiDAR scanning, photogrammetry, project timelines, deliverables, and pricing. Get your questions answered."
- Keywords: "reality capture FAQ, drone mapping questions, LiDAR help, photogrammetry guide, surveying questions"
- Path: "/faq"
