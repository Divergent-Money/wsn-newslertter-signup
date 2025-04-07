
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ArticleFull from '@/components/newsletters/ArticleFull';
import { 
  fetchArticleBySlug, 
  getUserSubscriptionTier, 
  isArticleBookmarked, 
  toggleArticleBookmark,
  SubscriptionTier
} from '@/services/newsletterArchiveService';
import { useToast } from '@/components/ui/use-toast';

const ArticleView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [userTier, setUserTier] = useState<SubscriptionTier>('free');
  const [bookmarked, setBookmarked] = useState(false);
  
  const { data: article, isLoading, isError } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchArticleBySlug(slug || ''),
    enabled: !!slug,
  });
  
  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const tier = await getUserSubscriptionTier();
        setUserTier(tier);
      } catch (error) {
        console.error('Error fetching user tier:', error);
        setUserTier('free');
      }
    };
    
    fetchUserTier();
  }, []);
  
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!article) return;
      
      try {
        const isBookmarked = await isArticleBookmarked(article.id);
        setBookmarked(isBookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };
    
    checkBookmarkStatus();
  }, [article]);
  
  const handleToggleBookmark = async (articleId: string) => {
    try {
      const isNowBookmarked = await toggleArticleBookmark(articleId);
      setBookmarked(isNowBookmarked);
      
      toast({
        title: isNowBookmarked ? "Article saved" : "Article removed from saved",
        description: isNowBookmarked 
          ? "This article has been added to your bookmarks." 
          : "This article has been removed from your bookmarks.",
        duration: 3000,
      });
    } catch (error: any) {
      if (error.message === 'User not authenticated') {
        toast({
          title: "Authentication required",
          description: "Please sign in to bookmark articles.",
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Action failed",
          description: "There was a problem updating your bookmarks.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center p-12">Loading article...</div>;
  }
  
  if (isError || !article) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-500 mb-4">Article not found or unable to load.</p>
        <Button asChild>
          <Link to="/newsletters">Return to Archive</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-supernova-navy to-black text-white py-12 px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost" size="sm" className="mb-6">
            <Link to="/newsletters">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archive
            </Link>
          </Button>
          
          <ArticleFull 
            article={article} 
            userTier={userTier}
            isBookmarked={bookmarked}
            onBookmark={handleToggleBookmark}
          />
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
