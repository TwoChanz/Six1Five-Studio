import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReviewForm from "@/components/review-form";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { ReactNode, useState } from "react";

interface ReviewDialogProps {
  trigger?: ReactNode;
  triggerText?: string;
}

export default function ReviewDialog({ trigger, triggerText = "Leave a Review" }: ReviewDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="bg-[var(--primary-orange)] hover:bg-[var(--primary-orange)]/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-2 border-[var(--primary-orange)]/30"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-[hsl(218,11%,15%)] border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Share Your Experience</DialogTitle>
          <DialogDescription className="text-gray-400">
            I'd love to hear about your experience working with Six1Five Studio.
            Your feedback helps me improve and helps others understand the quality of my work.
          </DialogDescription>
        </DialogHeader>
        <ReviewForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
