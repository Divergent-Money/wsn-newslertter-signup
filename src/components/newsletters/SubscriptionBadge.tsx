
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { SubscriptionTier } from '@/services/newsletterArchiveService';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  className?: string;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ tier, className }) => {
  const tierConfig = {
    free: {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      label: "Free Tier"
    },
    blaze: {
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      label: "Blaze Tier"
    },
    premium: {
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      label: "Premium Tier"
    }
  };

  return (
    <Badge className={`${tierConfig[tier].color} ${className}`} variant="outline">
      {tierConfig[tier].label}
    </Badge>
  );
};

export default SubscriptionBadge;
