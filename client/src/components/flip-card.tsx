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
    <div className="flip-card h-80 w-full">
      <div className="flip-card-inner">
        <div className="flip-card-front bg-gray-800 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">
          <IconComponent className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${service.color === 'drone-orange' ? 'text-[hsl(24,95%,53%)]' : service.color === 'sky-blue' ? 'text-[hsl(199,89%,48%)]' : 'text-[hsl(158,64%,52%)]'} mb-4 lg:mb-6`} />
          <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 lg:mb-4 text-center leading-tight">{service.title}</h3>
          <p className="text-gray-400 text-center text-sm sm:text-base leading-tight">{service.subtitle}</p>
        </div>
        <div className={`flip-card-back ${service.bgColor} p-4 sm:p-6 lg:p-8 text-center text-white flex flex-col justify-between`}>
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-3 lg:mb-4">
              {service.title === "Photogrammetry" ? "Pipeline" : service.title === "LiDAR Integration" ? "Tools" : "Workflow"}
            </h3>
            <ul className="space-y-1 sm:space-y-2 text-left text-sm sm:text-base">
              {service.workflow.map((item, index) => (
                <li key={index} className="leading-tight">{item}</li>
              ))}
            </ul>
          </div>
          <Button className="mt-4 lg:mt-6 bg-white text-gray-900 hover:bg-gray-100 px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
