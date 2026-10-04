import { useEffect } from "react";
import { Link } from "wouter";
import {
  Linkedin,
  Box,
  FileText,
  Github,
  Instagram,
  Youtube,
  Globe,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SEOHead } from "@/components/seo-head";
import linksData from "@/data/links.json";
import { analytics } from "@/lib/analytics";
import logoCircular from "@/assets/logo-circular-large.webp";
import profileImage from "@assets/2025-07-15_10.39.28_1752594500456.png";

/* ---------- Types for links.json ---------- */

interface SocialLink {
  icon: string;
  label: string;
  url: string;
}

interface LinkItem {
  title: string;
  subtitle?: string;
  url: string;
  internal: boolean;
  accent?: boolean;
}

interface FeaturedLink extends LinkItem {
  image: string;
  imageAlt: string;
}

interface LinksData {
  name: string;
  tagline: string;
  avatarAlt: string;
  socials: SocialLink[];
  featured: FeaturedLink;
  links: LinkItem[];
}

const data = linksData as LinksData;

// Icon names used in links.json. Add here if you add a new social.
const socialIconMap: Record<string, LucideIcon> = {
  Linkedin,
  Box,
  FileText,
  Github,
  Instagram,
  Youtube,
  Globe,
};

/* ---------- Small building blocks ---------- */

/**
 * Renders either a Wouter <Link> (internal route) or an <a> (external URL)
 * with identical styling, so the JSON decides routing and the markup doesn't
 * have to care.
 */
function SmartLink({
  item,
  className,
  children,
  source,
}: {
  item: LinkItem;
  className: string;
  children: React.ReactNode;
  source: string;
}) {
  const track = () => analytics.ctaClick(item.title, source);

  if (item.internal) {
    return (
      <Link href={item.url} onClick={track} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      className={className}
    >
      {children}
    </a>
  );
}

function FeaturedCard({ item }: { item: FeaturedLink }) {
  return (
    <SmartLink
      item={item}
      source="links_featured"
      className="group block rounded-2xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-[var(--logo-blue)]/60 transition-colors shadow-xl"
    >
      <div className="aspect-[4/3] sm:aspect-video overflow-hidden bg-black/40">
        <img
          src={item.image}
          alt={item.imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="eager"
        />
      </div>
      <div className="px-5 py-4 flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-white leading-snug">{item.title}</p>
          {item.subtitle && <p className="text-sm text-gray-400 mt-1">{item.subtitle}</p>}
        </div>
        <ArrowUpRight
          className="w-5 h-5 text-gray-500 group-hover:text-[var(--logo-blue)] flex-shrink-0 mt-0.5 transition-colors"
          aria-hidden="true"
        />
      </div>
    </SmartLink>
  );
}

function LinkRow({ item }: { item: LinkItem }) {
  const base =
    "group flex items-center justify-between gap-4 rounded-xl px-5 py-4 border transition-colors";
  const tone = item.accent
    ? "bg-[var(--primary-blue)] border-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white"
    : "bg-white/[0.04] border-white/10 hover:border-white/30 text-white";

  return (
    <SmartLink item={item} source="links_row" className={`${base} ${tone}`}>
      <div className="min-w-0">
        <p className="font-semibold leading-snug truncate">{item.title}</p>
        {item.subtitle && (
          <p className={`text-sm mt-0.5 truncate ${item.accent ? "text-white/80" : "text-gray-400"}`}>
            {item.subtitle}
          </p>
        )}
      </div>
      <ArrowUpRight
        className={`w-5 h-5 flex-shrink-0 transition-colors ${
          item.accent ? "text-white/80" : "text-gray-500 group-hover:text-[var(--logo-blue)]"
        }`}
        aria-hidden="true"
      />
    </SmartLink>
  );
}

/* ---------- Page ---------- */

export default function Links() {
  useEffect(() => {
    document.title = `${data.name} — Links | Six1Five Studio`;
  }, []);

  return (
    <>
      <SEOHead
        title={`${data.name} — Links | Six1Five Studio`}
        description="All of Chandler Hopkins' Six1Five links in one place: drone mapping portfolio, pricing, free sample dataset, newsletter, and more."
      />

      <main className="min-h-screen bg-[hsl(218,11%,12%)] text-white font-sans">
        {/* Soft radial glow behind the header so the page isn't flat */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,hsl(210,85%,22%)_0%,transparent_65%)]"
          aria-hidden="true"
        />

        <div className="relative max-w-md mx-auto px-4 pt-14 pb-20">
          {/* Header */}
          <header className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-5">
              <img
                src={profileImage}
                alt={data.avatarAlt}
                className="w-24 h-24 rounded-full object-cover ring-2 ring-white/15 shadow-xl"
              />
              <img
                src={logoCircular}
                alt=""
                aria-hidden="true"
                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full ring-2 ring-[hsl(218,11%,12%)] bg-black"
              />
            </div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-gray-400 mt-1">{data.tagline}</p>

            <ul className="flex items-center gap-5 mt-5">
              {data.socials.map((social) => {
                const Icon = socialIconMap[social.icon] ?? Globe;
                return (
                  <li key={social.label}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      onClick={() => analytics.externalLink(social.url, social.label)}
                      className="text-gray-300 hover:text-[var(--logo-blue)] transition-colors"
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </header>

          {/* Featured card — the one link that shows the product */}
          <div className="mb-4">
            <FeaturedCard item={data.featured} />
          </div>

          {/* Compact rows */}
          <ul className="space-y-3">
            {data.links.map((item) => (
              <li key={item.title}>
                <LinkRow item={item} />
              </li>
            ))}
          </ul>

          <footer className="mt-12 text-center text-xs text-gray-500">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              six1fivestudio.com
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}
