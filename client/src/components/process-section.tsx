import { Plane, Cpu, Link2, type LucideIcon } from "lucide-react";

interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Three steps, ending on the one that closes the sale: the deliverable is a
 * link, not a file the client has to figure out how to open.
 */
const steps: ProcessStep[] = [
  {
    icon: Plane,
    title: "Capture",
    description:
      "I plan the flight around your site and the accuracy you need, then fly it with overlapping nadir and oblique passes. Ground control points are set when survey-tied results matter.",
  },
  {
    icon: Cpu,
    title: "Process",
    description:
      "Imagery is processed with photogrammetry into an orthomosaic, a digital surface model, and a textured 3D model. I check alignment and clean the result before anything goes out.",
  },
  {
    icon: Link2,
    title: "Deliver",
    description:
      "You get a private link that opens the 3D model in any browser — paste it in an MLS listing, text it to a buyer, or drop it in a PM's email. GeoTIFFs and point clouds come alongside for anyone who needs to measure.",
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 bg-[hsl(218,11%,13%)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--logo-blue)] font-semibold mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            From the first flight to a link in your inbox.
          </h2>
        </div>

        <ol className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const number = String(index + 1).padStart(2, "0");
            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8"
              >
                <span className="absolute top-6 right-6 text-4xl font-bold text-white/10 leading-none select-none">
                  {number}
                </span>
                <Icon className="w-8 h-8 text-[var(--logo-blue)] mb-5" aria-hidden="true" />
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
