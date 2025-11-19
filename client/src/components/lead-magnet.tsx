import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { analytics } from "@/lib/analytics";

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadMagnetProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string; // Track where the lead magnet was triggered from
}

export default function LeadMagnet({ isOpen, onClose, source = "unknown" }: LeadMagnetProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const submitLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData) => {
      const response = await apiRequest("POST", "/api/leads", {
        ...data,
        source,
        resourceRequested: "Reality Capture ROI & Planning Guide",
      });
      return await response.json();
    },
    onSuccess: () => {
      setIsSuccess(true);
      analytics.ctaClick("Download Lead Magnet", source);

      // Simulate PDF download (in production, this would be a real PDF from your server)
      const link = document.createElement('a');
      link.href = '/resources/reality-capture-guide.pdf';
      link.download = 'Reality-Capture-ROI-Planning-Guide.pdf';
      link.click();

      toast({
        title: "Success!",
        description: "Your guide is downloading. Check your email for additional resources.",
      });

      // Reset form and close dialog after 3 seconds
      setTimeout(() => {
        reset();
        setIsSuccess(false);
        onClose();
      }, 3000);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.response?.data?.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LeadFormData) => {
    submitLeadMutation.mutate(data);
  };

  const handleClose = () => {
    if (!submitLeadMutation.isPending) {
      reset();
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        {!isSuccess ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-[hsl(24,95%,53%)]/20">
                  <FileText className="w-8 h-8 text-[hsl(24,95%,53%)]" />
                </div>
              </div>
              <DialogTitle className="text-2xl text-center">
                Free Reality Capture Guide
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-center">
                Download our comprehensive ROI calculator and planning guide for reality capture projects
              </DialogDescription>
            </DialogHeader>

            {/* Value Proposition */}
            <div className="bg-gray-900/50 rounded-lg p-4 my-4 border border-gray-700">
              <h4 className="font-semibold mb-3 text-[hsl(199,89%,48%)]">What's Inside:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(158,64%,52%)] mt-0.5 flex-shrink-0" />
                  <span>ROI calculation framework for drone mapping & LiDAR projects</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(158,64%,52%)] mt-0.5 flex-shrink-0" />
                  <span>Technology selection decision tree (Photogrammetry vs LiDAR)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(158,64%,52%)] mt-0.5 flex-shrink-0" />
                  <span>Project timeline estimation templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(158,64%,52%)] mt-0.5 flex-shrink-0" />
                  <span>Budget planning checklist for AEC stakeholders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[hsl(158,64%,52%)] mt-0.5 flex-shrink-0" />
                  <span>Case studies with real-world cost savings</span>
                </li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Smith"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  disabled={submitLeadMutation.isPending}
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Work Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@company.com"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  disabled={submitLeadMutation.isPending}
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="company" className="text-gray-300">
                  Company (Optional)
                </Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="ABC Construction"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  disabled={submitLeadMutation.isPending}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] hover:opacity-90 text-white font-semibold"
                disabled={submitLeadMutation.isPending}
              >
                {submitLeadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download Free Guide
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                No spam, ever. Unsubscribe anytime. We respect your privacy.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-[hsl(158,64%,52%)]/20">
                <CheckCircle2 className="w-12 h-12 text-[hsl(158,64%,52%)]" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-2">Download Starting!</h3>
            <p className="text-gray-300 mb-4">
              Your guide is downloading now. We've also sent a copy to your email along with additional resources.
            </p>
            <p className="text-sm text-gray-400">
              This window will close automatically...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
