import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Eye, Download, ExternalLink, Layers, Box, Zap } from "lucide-react";

// Import the uploaded images
import houseRender1 from "@assets/2025-07-24_10.17.03_1753534885802.png";
import houseRender2 from "@assets/2025-07-24_10.17.33_1753534885815.png";
import houseRender3 from "@assets/2025-07-24_10.17.22_1753534885818.png";
import segmentationUI from "@assets/2025-07-24_10.25.14_1753534885819.png";
import houseKit from "@assets/Realistic House Kit Screenshot_1753534885821.webp";

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  image: string;
  caption: string;
  icon: React.ComponentType<any>;
}

const workflowSteps: WorkflowStep[] = [
  {
    id: "input",
    title: "Realistic Inputs",
    description: "High-quality architectural renders or photo references serve as the foundation for 3D reconstruction.",
    image: houseRender1,
    caption: "Client-provided architectural renders",
    icon: Eye
  },
  {
    id: "segmentation", 
    title: "AI Segmentation Workflow",
    description: "Advanced AI algorithms segment building components, merge regions, and create bounding boxes for precise mesh generation.",
    image: segmentationUI,
    caption: "Interactive segmentation interface with merged regions and exploded view analysis",
    icon: Layers
  },
  {
    id: "reconstruction",
    title: "3D Gaussian Reconstruction", 
    description: "Transform segmented 2D components into dense 3D Gaussian representations with component separation.",
    image: houseRender2,
    caption: "Combined 3D Gaussians with component-based architecture",
    icon: Box
  },
  {
    id: "assets",
    title: "Modular 3D Assets",
    description: "Generate reusable building component kits for virtual environments, games, and architectural simulations.",
    image: houseKit,
    caption: "Reusable house parts kit for scalable production workflows",
    icon: Zap
  }
];

export default function AIWorkflowShowcase() {
  const [activeStep, setActiveStep] = useState("input");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayDemo = () => {
    setIsPlaying(true);
    // Cycle through steps automatically
    const steps = ["input", "segmentation", "reconstruction", "assets"];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % steps.length;
      setActiveStep(steps[currentIndex]);
      
      if (currentIndex === 0) {
        setIsPlaying(false);
        clearInterval(interval);
      }
    }, 2500);
  };

  return (
    <section className="py-20 bg-[hsl(218,11%,15%)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[hsl(199,89%,48%)] text-white">AI-Powered Workflow</Badge>
          <h2 className="text-4xl font-bold mb-6">
            2D to <span className="text-[hsl(199,89%,48%)]">3D Gaussian</span> Transformation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolutionary AI workflow that transforms architectural renders into modular 3D assets using advanced segmentation and Gaussian reconstruction technology.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button 
              onClick={handlePlayDemo}
              disabled={isPlaying}
              className="bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,43%)] text-white px-6 py-3"
            >
              <Play className="w-4 h-4 mr-2" />
              {isPlaying ? "Playing Demo..." : "Play Workflow Demo"}
            </Button>
            <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Download Sample Assets
            </Button>
          </div>
        </div>

        {/* Interactive Workflow */}
        <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 mb-8">
            {workflowSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <TabsTrigger 
                  key={step.id} 
                  value={step.id}
                  className="flex flex-col items-center gap-2 py-4 text-xs sm:text-sm data-[state=active]:bg-[hsl(199,89%,48%)] data-[state=active]:text-white"
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="hidden sm:block">{step.title}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {workflowSteps.map((step) => (
            <TabsContent key={step.id} value={step.id}>
              <Card className="bg-[#1e1e1e] border-gray-700 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative">
                    <img 
                      src={step.image} 
                      alt={step.title}
                      className="w-full h-64 lg:h-96 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <p className="text-white text-sm font-medium">{step.caption}</p>
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-center">
                    <CardHeader className="p-0 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <step.icon className="w-8 h-8 text-[hsl(199,89%,48%)]" />
                        <CardTitle className="text-2xl text-white">{step.title}</CardTitle>
                      </div>
                      <CardDescription className="text-gray-300 text-lg leading-relaxed">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-0">
                      {step.id === "input" && (
                        <div className="space-y-4">
                          <h4 className="text-white font-semibold">Input Requirements:</h4>
                          <ul className="text-gray-300 space-y-2">
                            <li>• High-resolution architectural renders (4K+ recommended)</li>
                            <li>• Multiple viewing angles for comprehensive coverage</li>
                            <li>• Clear building component separation</li>
                            <li>• Consistent lighting and material definition</li>
                          </ul>
                        </div>
                      )}
                      
                      {step.id === "segmentation" && (
                        <div className="space-y-4">
                          <h4 className="text-white font-semibold">AI Processing Features:</h4>
                          <ul className="text-gray-300 space-y-2">
                            <li>• Intelligent component recognition</li>
                            <li>• Automated region merging</li>
                            <li>• Bounding box generation</li>
                            <li>• Exploded view analysis</li>
                          </ul>
                        </div>
                      )}
                      
                      {step.id === "reconstruction" && (
                        <div className="space-y-4">
                          <h4 className="text-white font-semibold">3D Output Formats:</h4>
                          <ul className="text-gray-300 space-y-2">
                            <li>• .PLY point cloud data</li>
                            <li>• Combined 3D Gaussian models</li>
                            <li>• Component-separated assets</li>
                            <li>• Web-ready GLB/GLTF exports</li>
                          </ul>
                        </div>
                      )}
                      
                      {step.id === "assets" && (
                        <div className="space-y-4">
                          <h4 className="text-white font-semibold">Application Uses:</h4>
                          <ul className="text-gray-300 space-y-2">
                            <li>• Virtual neighborhood development</li>
                            <li>• Game environment creation</li>
                            <li>• Architectural simulation</li>
                            <li>• VR/AR experiences</li>
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Technical Specifications */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="bg-[#1e1e1e] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-[hsl(199,89%,48%)]" />
                AI Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Advanced semantic segmentation</li>
                <li>• Neural radiance field processing</li>
                <li>• Gaussian splatting algorithms</li>
                <li>• Real-time component analysis</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e1e1e] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-[hsl(158,64%,52%)]" />
                Output Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• High-fidelity 3D reconstruction</li>
                <li>• Photorealistic texture mapping</li>
                <li>• Optimized polygon counts</li>
                <li>• Industry-standard file formats</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e1e1e] border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[hsl(24,95%,53%)]" />
                Workflow Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• 90% faster than traditional modeling</li>
                <li>• Automated component separation</li>
                <li>• Scalable production pipeline</li>
                <li>• Consistent quality output</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-[hsl(199,89%,48%)] to-[hsl(158,64%,52%)] border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Ready to Transform Your Renders?</CardTitle>
              <CardDescription className="text-white/90 text-lg">
                Get started with AI-powered 3D reconstruction for your architectural projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-white text-[hsl(199,89%,48%)] hover:bg-gray-100">
                  Request Demo Project
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Technical Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}