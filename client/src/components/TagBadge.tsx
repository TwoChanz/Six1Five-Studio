import { Badge } from "@/components/ui/badge";

interface TagBadgeProps {
  tag: string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
}

const getTagColor = (tag: string) => {
  const tagLower = tag.toLowerCase();
  
  if (tagLower.includes('photogrammetry') || tagLower.includes('3d')) {
    return 'bg-[hsl(24,95%,53%)] text-white';
  }
  
  if (tagLower.includes('heritage') || tagLower.includes('historic')) {
    return 'bg-[hsl(158,64%,52%)] text-white';
  }
  
  if (tagLower.includes('construction') || tagLower.includes('architecture')) {
    return 'bg-[hsl(199,89%,48%)] text-white';
  }
  
  if (tagLower.includes('drone') || tagLower.includes('aerial')) {
    return 'bg-[hsl(280,100%,70%)] text-white';
  }
  
  return 'bg-gray-700 text-gray-200';
};

export default function TagBadge({ tag, variant = 'default', className = '' }: TagBadgeProps) {
  const colorClass = variant === 'default' ? getTagColor(tag) : '';
  
  return (
    <Badge 
      variant={variant} 
      className={`${colorClass} ${className} transition-colors hover:opacity-80`}
    >
      {tag}
    </Badge>
  );
}