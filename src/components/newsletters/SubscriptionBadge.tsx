
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { SubscriptionTier } from '@/services/newsletterArchiveService';
import { Crown, Flame, CircleUser } from 'lucide-react';

interface SubscriptionBadgeProps {
  tier: SubscriptionTier;
  className?: string;
  showIcon?: boolean;
}

const SubscriptionBadge: React.FC<SubscriptionBadgeProps> = ({ tier, className, showIcon = true }) => {
  const tierConfig = {
    free: {
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      label: "Free Tier",
      icon: CircleUser
    },
    blaze: {
      color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
      label: "Blaze Tier",
      icon: Flame
    },
    premium: {
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
      label: "Premium Tier",
      icon: Crown
    }
  };

  const Icon = tierConfig[tier].icon;

  return (
    <Badge className={`${tierConfig[tier].color} flex items-center gap-1 ${className}`} variant="outline">
      {showIcon && <Icon className="h-3 w-3" />}
      {tierConfig[tier].label}
    </Badge>
  );
};

export default SubscriptionBadge;
