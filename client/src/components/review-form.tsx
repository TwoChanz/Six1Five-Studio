import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const reviewSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  company: z.string().optional(),
  role: z.string().optional(),
  rating: z.number().min(1).max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters").max(1000, "Review must be less than 1000 characters"),
  projectType: z.string().min(1, "Please select a service type"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSuccess?: () => void;
}

export default function ReviewForm({ onSuccess }: ReviewFormProps) {
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const submitReview = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback! Your review will be published after approval.",
      });
      reset();
      setSelectedRating(0);
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    submitReview.mutate(data);
  };

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    setValue("rating", rating, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Your full name"
            className="bg-gray-800 border-gray-700"
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your@email.com"
            className="bg-gray-800 border-gray-700"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label htmlFor="company">Company (Optional)</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="Your company name"
            className="bg-gray-800 border-gray-700"
            autoComplete="organization"
          />
        </div>

        {/* Role */}
        <div className="space-y-2">
          <Label htmlFor="role">Your Role (Optional)</Label>
          <Input
            id="role"
            {...register("role")}
            placeholder="e.g., Project Manager, Architect"
            className="bg-gray-800 border-gray-700"
            autoComplete="organization-title"
          />
        </div>

        {/* Service Type */}
        <div className="space-y-2">
          <Label htmlFor="projectType">
            Service Used <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={(value) => setValue("projectType", value, { shouldValidate: true })}>
            <SelectTrigger id="projectType" className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select the service you used" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Drone Mapping">Drone Mapping</SelectItem>
              <SelectItem value="LiDAR Scanning">LiDAR Scanning</SelectItem>
              <SelectItem value="Photogrammetry">Photogrammetry</SelectItem>
              <SelectItem value="Thermal Imaging">Thermal Imaging</SelectItem>
              <SelectItem value="Construction Monitoring">Construction Monitoring</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.projectType && (
            <p className="text-sm text-red-500">{errors.projectType.message}</p>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label id="rating-label">
            Rating <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2" role="radiogroup" aria-labelledby="rating-label" aria-required="true">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleRatingClick(rating)}
                onMouseEnter={() => setHoverRating(rating)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] rounded"
                role="radio"
                aria-checked={selectedRating === rating}
                aria-label={`${rating} star${rating !== 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    rating <= (hoverRating || selectedRating)
                      ? "fill-[var(--primary-orange)] text-[var(--primary-orange)]"
                      : "text-gray-600"
                  }`}
                />
              </button>
            ))}
            {selectedRating > 0 && (
              <span className="ml-2 text-sm text-gray-400" aria-live="polite">
                {selectedRating} star{selectedRating !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-sm text-red-500" role="alert">{errors.rating.message}</p>
          )}
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="reviewText">
            Your Review <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="reviewText"
            {...register("reviewText")}
            placeholder="Share your experience working with Six1Five Studio..."
            rows={6}
            className="bg-gray-800 border-gray-700 resize-none"
          />
          {errors.reviewText && (
            <p className="text-sm text-red-500">{errors.reviewText.message}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={submitReview.isPending}
        className="w-full bg-[var(--primary-blue)] hover:bg-[var(--navy-blue)] text-white"
      >
        {submitReview.isPending ? "Submitting..." : "Submit Review"}
      </Button>

      <p className="text-sm text-gray-400 text-center">
        Your review will be published after approval by our team.
      </p>
    </form>
  );
}
