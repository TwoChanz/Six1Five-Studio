import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const emailFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
});

type EmailFormData = z.infer<typeof emailFormSchema>;

interface DatasetDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatasetDownloadModal({
  isOpen,
  onClose,
}: DatasetDownloadModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadLink, setDownloadLink] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/dataset-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      const result = await response.json();

      setDownloadLink(result.downloadUrl || "/downloads/stockpile-photogrammetry-sample-dataset.zip");
      setIsSubmitted(true);

      // Track analytics
      if (window.gtag) {
        window.gtag("event", "dataset_download", {
          event_category: "engagement",
          event_label: "stockpile_sample",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setDownloadLink("");
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-700">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Download className="w-6 h-6 text-[hsl(158,64%,52%)]" />
                Get Instant Access
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-base">
                Enter your details to download the free stockpile photogrammetry dataset (109 MB)
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Smith"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                {errors.name && (
                  <p className="text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@company.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
                {errors.email && (
                  <p className="text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Company Field (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">
                  Company <span className="text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="company"
                  {...register("company")}
                  placeholder="ABC Construction"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,42%)] text-white font-semibold"
                >
                  {isSubmitting ? (
                    "Processing..."
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Get Download Link
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                We'll never share your email. Unsubscribe anytime.
              </p>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[hsl(158,64%,52%)]" />
                Success! Check Your Email
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-base">
                We've sent the download link to your email. You can also download directly below.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="p-4 bg-[hsl(158,64%,52%)]/10 border border-[hsl(158,64%,52%)]/30 rounded-lg">
                <p className="text-sm text-gray-300 mb-3">
                  <strong className="text-white">What's included:</strong>
                </p>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                  <li>28 high-resolution aerial photos (DNG format)</li>
                  <li>Ground Control Points (GCP) file</li>
                  <li>Camera calibration data</li>
                  <li>Processing instructions PDF</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <a
                  href={downloadLink}
                  download
                  className="flex-1"
                  onClick={() => {
                    // Small delay before closing so download can start
                    setTimeout(handleClose, 500);
                  }}
                >
                  <Button className="w-full bg-[hsl(158,64%,52%)] hover:bg-[hsl(158,64%,42%)] text-white font-semibold">
                    <Download className="w-4 h-4 mr-2" />
                    Download Now (109 MB)
                  </Button>
                </a>
              </div>

              <Button
                variant="ghost"
                onClick={handleClose}
                className="w-full text-gray-400 hover:text-white"
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
