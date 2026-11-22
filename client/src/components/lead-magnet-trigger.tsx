import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Gift } from "lucide-react";
import LeadMagnet from "@/components/lead-magnet";

interface LeadMagnetTriggerProps {
  source: string;
  variant?: "default" | "outline" | "cta";
  text?: string;
  className?: string;
}

export default function LeadMagnetTrigger({
  source,
  variant = "default",
  text = "Download Free Guide",
  className = ""
}: LeadMagnetTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonStyles = () => {
    switch (variant) {
      case "outline":
        return "border-[hsl(199,89%,48%)] text-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,48%)] hover:text-white";
      case "cta":
        return "bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] hover:opacity-90 text-white font-semibold";
      default:
        return "bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white";
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`${getButtonStyles()} ${className}`}
      >
        {variant === "cta" ? <Gift className="w-4 h-4 mr-2" /> : <Download className="w-4 h-4 mr-2" />}
        {text}
      </Button>

      <LeadMagnet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        source={source}
      />
    </>
  );
}
