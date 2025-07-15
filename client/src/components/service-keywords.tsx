import { useEffect, useRef } from "react";
import { Camera, Radar, Layers, Bot, CircuitBoard, Building } from "lucide-react";

const services = [
  { icon: Camera, name: "Photogrammetry", color: "text-[hsl(24,95%,53%)]" },
  { icon: Radar, name: "LiDAR Scanning", color: "text-[hsl(199,89%,48%)]" },
  { icon: Layers, name: "3D Reconstruction", color: "text-[hsl(158,64%,52%)]" },
  { icon: Bot, name: "Bot Mapping", color: "text-[hsl(24,95%,53%)]" },
  { icon: CircuitBoard, name: "Virtual Tours", color: "text-[hsl(199,89%,48%)]" },
  { icon: Building, name: "Scan-to-BIM", color: "text-[hsl(158,64%,52%)]" },
];

export default function ServiceKeywords() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const keywords = entry.target.querySelectorAll('.service-keyword');
            keywords.forEach((keyword, index) => {
              setTimeout(() => {
                keyword.classList.add('animate-pulse');
              }, index * 100);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div key={service.name} className="text-center service-keyword">
                <IconComponent className={`w-10 h-10 ${service.color} mb-4 mx-auto`} />
                <h3 className="font-mono text-lg">{service.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
