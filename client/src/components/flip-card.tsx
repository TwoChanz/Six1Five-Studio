import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ServiceData {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  workflow: string[];
}

interface FlipCardProps {
  service: ServiceData;
}

export default function FlipCard({ service }: FlipCardProps) {
  const IconComponent = service.icon;

  return (
    <div className="flip-card h-80">
      <div className="flip-card-inner">
        <div className="flip-card-front bg-gray-800 p-8 flex flex-col items-center justify-center">
          <IconComponent className={`w-16 h-16 ${service.color === 'drone-orange' ? 'text-[hsl(24,95%,53%)]' : service.color === 'sky-blue' ? 'text-[hsl(199,89%,48%)]' : 'text-[hsl(158,64%,52%)]'} mb-6`} />
          <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
          <p className="text-gray-400 text-center">{service.subtitle}</p>
        </div>
        <div className={`flip-card-back ${service.bgColor} p-8 text-center text-white`}>
          <h3 className="text-2xl font-semibold mb-4">
            {service.title === "Photogrammetry" ? "Pipeline" : service.title === "LiDAR Integration" ? "Tools" : "Workflow"}
          </h3>
          <ul className="space-y-2 text-left">
            {service.workflow.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <Button className="mt-6 bg-white text-gray-900 hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
