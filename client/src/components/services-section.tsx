import { Map, HardHat, Camera, Check, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import servicesData from "@/data/services.json";
import { scrollToSection } from "@/lib/scroll";
import { analytics } from "@/lib/analytics";

type ServiceColor = "drone-orange" | "sky-blue" | "tech-green";

interface ServiceData {
  icon: string;
  title: string;
  subtitle: string;
  color: ServiceColor | string;
  workflow: string[];
}

interface ServicesData {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  services: ServiceData[];
}

const data = servicesData as ServicesData;

// Icon names in services.json map to Lucide components here. Add to this
// map if you introduce a new icon in the JSON.
const iconMap: Record<string, LucideIcon> = {
  Map,
  HardHat,
  Camera,
};

// Brand accent per service — one Tailwind text class, one HSL for borders.
const colorMap: Record<string, { text: string; hsl: string }> = {
  "drone-orange": { text: "text-[hsl(24,95%,53%)]", hsl: "hsl(24,95%,53%)" },
  "sky-blue": { text: "text-[hsl(199,89%,48%)]", hsl: "hsl(199,89%,48%)" },
  "tech-green": { text: "text-[hsl(158,64%,52%)]", hsl: "hsl(158,64%,52%)" },
};

function ServiceRow({ service, index }: { service: ServiceData; index: number }) {
  const Icon = iconMap[service.icon] ?? Map;
  const accent = colorMap[service.color] ?? colorMap["sky-blue"];
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="grid md:grid-cols-12 gap-6 md:gap-10 py-10 border-t border-white/10 first:border-t-0">
      {/* Number + icon */}
      <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-4">
        <span className="text-5xl md:text-6xl font-bold text-white/10 leading-none select-none">
          {number}
        </span>
        <Icon className={`w-8 h-8 ${accent.text}`} aria-hidden="true" />
      </div>

      {/* Title + subtitle */}
      <div className="md:col-span-5">
        <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
        <p className="text-gray-400 leading-relaxed">{service.subtitle}</p>
      </div>

      {/* Deliverables list */}
      <ul className="md:col-span-5 space-y-2.5">
        {service.workflow.map((item) => (
          <li key={item} className="flex items-start gap-3 text-gray-300">
            <Check
              className="w-4 h-4 mt-1 flex-shrink-0"
              style={{ color: accent.hsl }}
              aria-hidden="true"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function ServicesSection() {
  const handleCta = () => {
    analytics.ctaClick(data.ctaButtonText, "services_section");
    scrollToSection("contact");
  };

  return (
    <section id="services" className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--logo-blue)] font-semibold mb-3">
            {data.sectionLabel}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{data.sectionTitle}</h2>
          <p className="text-gray-400 text-lg leading-relaxed">{data.sectionDescription}</p>
        </div>

        <div>
          {data.services.map((service, index) => (
            <ServiceRow key={service.title} service={service} index={index} />
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-2xl font-bold text-white mb-2">{data.ctaTitle}</h3>
            <p className="text-gray-400">{data.ctaDescription}</p>
          </div>
          <Button
            onClick={handleCta}
            className="bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white px-8 py-6 text-base font-semibold rounded-lg transition-colors flex-shrink-0"
          >
            {data.ctaButtonText}
          </Button>
        </div>
      </div>
    </section>
  );
}
