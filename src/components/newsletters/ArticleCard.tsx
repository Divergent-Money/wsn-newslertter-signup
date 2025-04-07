
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookmarkIcon, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { NewsletterArticle, SubscriptionTier } from '@/services/newsletterArchiveService';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: NewsletterArticle;
  userTier: SubscriptionTier;
  isBookmarked?: boolean;
  onBookmark?: (articleId: string) => void;
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  userTier,
  isBookmarked = false,
  onBookmark,
  className 
}) => {
  const canAccessFullArticle = (
    article.min_tier === 'free' || 
    (article.min_tier === 'blaze' && (userTier === 'blaze' || userTier === 'premium')) ||
    (article.min_tier === 'premium' && userTier === 'premium')
  );

  const tierColors = {
    free: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    blaze: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    premium: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
  };
  
  return (
    <Card className={cn("h-full flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={tierColors[article.min_tier]} variant="outline">
            {article.min_tier.charAt(0).toUpperCase() + article.min_tier.slice(1)}
          </Badge>
          {article.is_featured && (
            <Badge className="bg-supernova-gold text-black">Featured</Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-2">{article.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(article.publish_date).toLocaleDateString()}
          <span className="mx-1">•</span>
          <Clock className="h-3 w-3" />
          {article.read_time_minutes} min read
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {article.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        {canAccessFullArticle ? (
          <Button asChild variant="default" size="sm" className="mr-2">
            <Link to={`/newsletters/${article.slug}`}>Read Article</Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm" className="mr-2">
            <Link to="/premium-version">Upgrade to Access</Link>
          </Button>
        )}
        {onBookmark && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onBookmark(article.id)}
            className={isBookmarked ? "text-supernova-gold" : ""}
          >
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
