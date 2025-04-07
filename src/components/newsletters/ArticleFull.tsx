
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkIcon, Calendar, Clock, User, Bookmark, Share2 } from "lucide-react";
import { NewsletterArticle, SubscriptionTier, recordArticleEngagement } from '@/services/newsletterArchiveService';

interface ArticleFullProps {
  article: NewsletterArticle;
  userTier: SubscriptionTier;
  isBookmarked?: boolean;
  onBookmark?: (articleId: string) => void;
}

const ArticleFull: React.FC<ArticleFullProps> = ({ 
  article, 
  userTier, 
  isBookmarked, 
  onBookmark 
}) => {
  const canAccessFullArticle = (
    article.min_tier === 'free' || 
    (article.min_tier === 'blaze' && (userTier === 'blaze' || userTier === 'premium')) ||
    (article.min_tier === 'premium' && userTier === 'premium')
  );

  useEffect(() => {
    // Record article view if user can access it
    if (canAccessFullArticle) {
      recordArticleEngagement(article.id).catch(console.error);
    }
  }, [article.id, canAccessFullArticle]);

  const tierColors = {
    free: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    blaze: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100",
    premium: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
  };

  return (
    <article className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Badge className={tierColors[article.min_tier]} variant="outline">
          {article.min_tier.charAt(0).toUpperCase() + article.min_tier.slice(1)} Tier
        </Badge>
        {article.is_featured && (
          <Badge className="bg-supernova-gold text-black">Featured</Badge>
        )}
      </div>

      <h1 className="text-3xl font-display font-bold mb-4">{article.title}</h1>
      
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <User className="h-4 w-4 mr-1" />
        <span className="mr-4">{article.author}</span>
        <Calendar className="h-4 w-4 mr-1" />
        <span className="mr-4">{new Date(article.publish_date).toLocaleDateString()}</span>
        <Clock className="h-4 w-4 mr-1" />
        <span>{article.read_time_minutes} min read</span>
      </div>

      {article.feature_image_url && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img 
            src={article.feature_image_url} 
            alt={article.title} 
            className="w-full h-auto object-cover" 
          />
        </div>
      )}

      {canAccessFullArticle ? (
        <div className="prose max-w-none mb-8">
          {/* Parse and render HTML content */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      ) : (
        <Card className="p-8 mb-8 text-center bg-white/5 backdrop-blur-sm border-white/10">
          <h3 className="text-xl font-bold mb-4">
            This content is available to {article.min_tier} tier subscribers
          </h3>
          <p className="mb-6">
            Upgrade your subscription to access this premium financial insight.
          </p>
          <Button asChild className="bg-supernova-gold hover:bg-supernova-gold/90 text-black">
            <a href="/premium-version">Upgrade Subscription</a>
          </Button>
        </Card>
      )}

      {canAccessFullArticle && (
        <div className="flex justify-between items-center py-4 border-t border-b border-white/10">
          <div className="flex gap-2">
            {article.tags && article.tags.map((tag, i) => (
              <Badge key={i} variant="outline">{tag}</Badge>
            ))}
          </div>
          <div className="flex gap-2">
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark(article.id)}
                className={isBookmarked ? "text-supernova-gold" : ""}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.share({
                title: article.title,
                text: article.summary,
                url: window.location.href
              }).catch(console.error)
            }}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      )}
    </article>
  );
};

export default ArticleFull;
