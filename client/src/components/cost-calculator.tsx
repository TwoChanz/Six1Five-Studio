import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, ArrowRight, CheckCircle2 } from "lucide-react";
import { analytics } from "@/lib/analytics";

type ServiceType = 'drone-mapping' | 'lidar-scanning' | 'photogrammetry' | 'full-package';
type ProjectSize = 'small' | 'medium' | 'large' | 'xlarge';
type Complexity = 'basic' | 'standard' | 'advanced';

interface PriceEstimate {
  min: number;
  max: number;
  features: string[];
  timeframe: string;
}

const serviceOptions = [
  { id: 'drone-mapping', label: 'Drone Mapping', icon: '🚁', desc: 'Aerial orthomosaics & terrain models' },
  { id: 'lidar-scanning', label: 'LiDAR Scanning', icon: '📡', desc: 'High-precision point clouds' },
  { id: 'photogrammetry', label: 'Photogrammetry', icon: '📷', desc: '3D models from photos' },
  { id: 'full-package', label: 'Full Package', icon: '⭐', desc: 'Complete reality capture suite' },
];

const sizeOptions = [
  { id: 'small', label: 'Small', area: 'Up to 10 acres', multiplier: 1 },
  { id: 'medium', label: 'Medium', area: '10-50 acres', multiplier: 2 },
  { id: 'large', label: 'Large', area: '50-200 acres', multiplier: 3.5 },
  { id: 'xlarge', label: 'Extra Large', area: '200+ acres', multiplier: 5 },
];

const complexityOptions = [
  { id: 'basic', label: 'Basic', desc: 'Standard deliverables', multiplier: 1 },
  { id: 'standard', label: 'Standard', desc: 'Enhanced processing & analysis', multiplier: 1.5 },
  { id: 'advanced', label: 'Advanced', desc: 'Custom outputs & integrations', multiplier: 2 },
];

// Base pricing (adjust these to match your actual rates)
const basePricing: Record<ServiceType, { min: number; max: number; features: string[]; timeframe: string }> = {
  'drone-mapping': {
    min: 500,
    max: 1500,
    features: ['Orthomosaic map', 'Elevation model', 'GeoTIFF exports', '2D measurements'],
    timeframe: '3-5 days',
  },
  'lidar-scanning': {
    min: 1500,
    max: 4000,
    features: ['Point cloud data', 'Classified LAS files', 'CAD-ready exports', 'Sub-inch accuracy'],
    timeframe: '5-7 days',
  },
  'photogrammetry': {
    min: 800,
    max: 2500,
    features: ['3D textured model', 'Point cloud', 'Measurements', 'Interactive viewer'],
    timeframe: '4-6 days',
  },
  'full-package': {
    min: 2500,
    max: 8000,
    features: ['All drone services', 'LiDAR + Photogrammetry', 'Integrated deliverables', 'Priority support'],
    timeframe: '1-2 weeks',
  },
};

export default function CostCalculator() {
  const [selectedService, setSelectedService] = useState<ServiceType>('drone-mapping');
  const [selectedSize, setSelectedSize] = useState<ProjectSize>('medium');
  const [selectedComplexity, setSelectedComplexity] = useState<Complexity>('standard');
  const [showEstimate, setShowEstimate] = useState(false);

  const calculateEstimate = (): PriceEstimate => {
    const base = basePricing[selectedService];
    const sizeMultiplier = sizeOptions.find(s => s.id === selectedSize)?.multiplier || 1;
    const complexityMultiplier = complexityOptions.find(c => c.id === selectedComplexity)?.multiplier || 1;

    const min = Math.round(base.min * sizeMultiplier * complexityMultiplier);
    const max = Math.round(base.max * sizeMultiplier * complexityMultiplier);

    return {
      min,
      max,
      features: base.features,
      timeframe: base.timeframe,
    };
  };

  const handleCalculate = () => {
    setShowEstimate(true);
    analytics.ctaClick('Calculate Cost', 'cost_calculator');
  };

  const estimate = calculateEstimate();

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[hsl(24,95%,53%)]/10 to-[hsl(199,89%,48%)]/10 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[hsl(24,95%,53%)]/20">
            <Calculator className="w-6 h-6 text-[hsl(24,95%,53%)]" />
          </div>
          <div>
            <CardTitle className="text-2xl">Project Cost Estimator</CardTitle>
            <CardDescription className="text-gray-400">
              Get an instant estimate for your reality capture project
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            1. Select Service Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {serviceOptions.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service.id as ServiceType);
                  setShowEstimate(false);
                }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedService === service.id
                    ? 'border-[hsl(24,95%,53%)] bg-[hsl(24,95%,53%)]/10'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-900/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{service.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{service.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{service.desc}</div>
                  </div>
                  {selectedService === service.id && (
                    <CheckCircle2 className="w-5 h-5 text-[hsl(24,95%,53%)]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Project Size Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            2. Project Size
          </label>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {sizeOptions.map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setSelectedSize(size.id as ProjectSize);
                  setShowEstimate(false);
                }}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedSize === size.id
                    ? 'border-[hsl(199,89%,48%)] bg-[hsl(199,89%,48%)]/10'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-900/50'
                }`}
              >
                <div className="font-semibold text-white text-sm">{size.label}</div>
                <div className="text-xs text-gray-400 mt-1">{size.area}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Complexity Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-3">
            3. Project Complexity
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {complexityOptions.map((complexity) => (
              <button
                key={complexity.id}
                onClick={() => {
                  setSelectedComplexity(complexity.id as Complexity);
                  setShowEstimate(false);
                }}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedComplexity === complexity.id
                    ? 'border-[hsl(158,64%,52%)] bg-[hsl(158,64%,52%)]/10'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-900/50'
                }`}
              >
                <div className="font-semibold text-white text-sm">{complexity.label}</div>
                <div className="text-xs text-gray-400 mt-1">{complexity.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] hover:opacity-90 text-white font-semibold py-6 text-lg"
          size="lg"
        >
          <DollarSign className="w-5 h-5 mr-2" />
          Calculate Estimate
        </Button>

        {/* Estimate Display */}
        {showEstimate && (
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-[hsl(24,95%,53%)]/20 to-[hsl(199,89%,48%)]/20 border-2 border-[hsl(24,95%,53%)] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400 mb-2">Estimated Project Cost</div>
              <div className="text-4xl font-bold text-white">
                ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
              </div>
              <Badge className="mt-3 bg-[hsl(199,89%,48%)] text-white">
                {estimate.timeframe} turnaround
              </Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="text-sm font-semibold text-gray-300">Included Features:</div>
              {estimate.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(158,64%,52%)]" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-600">
              <p className="text-xs text-gray-400 text-center mb-4">
                *Estimate based on typical projects. Final pricing may vary based on specific requirements, site access, and deliverable complexity.
              </p>
              <Button
                onClick={() => {
                  const section = document.getElementById('contact');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                  analytics.ctaClick('Get Exact Quote', 'cost_calculator_result');
                }}
                className="w-full bg-white text-[hsl(24,95%,53%)] hover:bg-gray-100 font-semibold"
              >
                Get Exact Quote
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
