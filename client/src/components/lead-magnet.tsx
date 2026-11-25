import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Download, FileText, CheckCircle2, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { analytics } from "@/lib/analytics";
import { HONEYPOT_FIELD, LEAD_MAGNETS, type LeadMagnetId, type LeadResponse } from "@shared/lead-magnets";

// Client-side checks mirror the server's (shared/lead-magnets.ts) so people
// see problems before submitting. The server validates again regardless.
const leadFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name is too long"),
  email: z.string().trim().max(254, "Email is too long").email("Please enter a valid email address"),
  company: z.string().trim().max(120, "Company name is too long").optional(),
  [HONEYPOT_FIELD]: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadMagnetProps {
  isOpen: boolean;
  onClose: () => void;
  source?: string; // Where the form was opened from (pricing_page, portfolio_detail, ...)
  resource?: LeadMagnetId;
}

const GUIDE_CONTENTS = [
  "What a drone capture actually delivers, and what it can't",
  "Five places it saves money or time on a project",
  "A fill-in ROI worksheet with worked examples",
  "When drone mapping is not worth paying for",
  "Ten questions to ask any drone provider",
];

/** Turns the "429: {...}" style errors from apiRequest into a friendly sentence. */
function errorMessage(error: unknown): string {
  const text = error instanceof Error ? error.message : "";
  if (text.startsWith("429")) {
    return "Too many requests from your network. Please wait a few minutes and try again.";
  }
  if (text.startsWith("400")) {
    return "Please check your name and email and try again.";
  }
  return "Something went wrong. Please try again, or use the contact form.";
}

/** Starts a browser download of the file without leaving the page. */
function startDownload(url: string, fileName: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export default function LeadMagnet({ isOpen, onClose, source = "unknown", resource = "roi-guide" }: LeadMagnetProps) {
  const [download, setDownload] = useState<LeadResponse | null>(null);
  const { toast } = useToast();
  const magnet = LEAD_MAGNETS[resource];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const submitLeadMutation = useMutation({
    mutationFn: async (data: LeadFormData): Promise<LeadResponse> => {
      const response = await apiRequest("POST", "/api/leads", { ...data, source, resource });
      return (await response.json()) as LeadResponse;
    },
    onSuccess: (result) => {
      setDownload(result);
      analytics.ctaClick("Download Lead Magnet", source);
      startDownload(result.downloadUrl, result.fileName);
    },
    onError: (error) => {
      toast({
        title: "Couldn't get your guide",
        description: errorMessage(error),
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
      setDownload(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700 text-white">
        {!download ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-[hsl(24,95%,53%)]/20">
                  <FileText className="w-8 h-8 text-[hsl(24,95%,53%)]" />
                </div>
              </div>
              <DialogTitle className="text-2xl text-center">
                Free {magnet.title}
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-center">
                Is drone mapping worth it for your project? Run your own numbers with this 7-page guide and worksheet.
              </DialogDescription>
            </DialogHeader>

            {/* What's inside */}
            <div className="bg-gray-900/50 rounded-lg p-4 my-4 border border-gray-700">
              <h4 className="font-semibold mb-3 text-[hsl(199,89%,48%)]">What's inside:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {GUIDE_CONTENTS.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(158,64%,52%)] mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {/* Honeypot: hidden from people and screen readers, filled in by bots. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="lead-website">Website</label>
                <input id="lead-website" type="text" tabIndex={-1} autoComplete="off" {...register(HONEYPOT_FIELD)} />
              </div>

              <div>
                <Label htmlFor="lead-name" className="text-gray-300">
                  Name *
                </Label>
                <Input
                  id="lead-name"
                  autoComplete="name"
                  {...register("name")}
                  placeholder="Jordan Smith"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  disabled={submitLeadMutation.isPending}
                />
                {errors.name && (
                  <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lead-email" className="text-gray-300">
                  Email *
                </Label>
                <Input
                  id="lead-email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="jordan@company.com"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  disabled={submitLeadMutation.isPending}
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lead-company" className="text-gray-300">
                  Company or role (optional)
                </Label>
                <Input
                  id="lead-company"
                  autoComplete="organization"
                  {...register("company")}
                  placeholder="ABC Construction, project manager"
                  className="bg-gray-900 border-gray-600 text-white mt-1"
                  disabled={submitLeadMutation.isPending}
                />
                {errors.company && (
                  <p className="text-sm text-red-400 mt-1">{errors.company.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] hover:opacity-90 text-white font-semibold"
                disabled={submitLeadMutation.isPending}
              >
                {submitLeadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Getting your guide...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Get the free guide
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                Your details go to Six1Five Studio only and are never sold or shared.
              </p>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 rounded-full bg-[hsl(158,64%,52%)]/20">
                <CheckCircle2 className="w-12 h-12 text-[hsl(158,64%,52%)]" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Your guide is ready</DialogTitle>
            <DialogDescription className="text-gray-300 mb-6">
              The download should start on its own. If it doesn't, use the button below.
            </DialogDescription>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-[hsl(24,95%,53%)] to-[hsl(199,89%,48%)] hover:opacity-90 text-white font-semibold"
              >
                <a href={download.downloadUrl} download={download.fileName}>
                  <Download className="w-4 h-4 mr-2" />
                  Download the guide (PDF)
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full border-gray-500 text-gray-200 hover:bg-gray-700">
                <a href={download.downloadUrl} target="_blank" rel="noopener noreferrer">
                  Open it in a new tab
                </a>
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-6">
              Want a second opinion on your numbers?{" "}
              <a href="/#contact" className="text-[hsl(199,89%,48%)] underline" onClick={handleClose}>
                Send me a note
              </a>
              .
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
