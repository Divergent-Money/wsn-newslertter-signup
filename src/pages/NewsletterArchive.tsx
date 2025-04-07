
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ArticleCard from '@/components/newsletters/ArticleCard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, BookmarkCheck } from 'lucide-react';
import { NewsletterArticle, SubscriptionTier, getUserSubscriptionTier, fetchNewsletterArticles, isArticleBookmarked, toggleArticleBookmark } from '@/services/newsletterArchiveService';
import { useToast } from '@/components/ui/use-toast';

const NewsletterArchive = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [userTier, setUserTier] = useState<SubscriptionTier>('free');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Record<string, boolean>>({});
  
  // Fetch all articles
  const { data: articles, isLoading, isError, refetch } = useQuery({
    queryKey: ['newsletterArticles'],
    queryFn: fetchNewsletterArticles
  });
  
  // Fetch user's subscription tier
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
  
  // Fetch bookmarked status for each article
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!articles) return;
      
      const bookmarks: Record<string, boolean> = {};
      
      for (const article of articles) {
        try {
          const isBookmarked = await isArticleBookmarked(article.id);
          bookmarks[article.id] = isBookmarked;
        } catch (error) {
          console.error('Error fetching bookmark status:', error);
        }
      }
      
      setBookmarkedArticles(bookmarks);
    };
    
    fetchBookmarks();
  }, [articles]);
  
  // Handle toggling bookmark
  const handleToggleBookmark = async (articleId: string) => {
    try {
      const isNowBookmarked = await toggleArticleBookmark(articleId);
      setBookmarkedArticles(prev => ({
        ...prev,
        [articleId]: isNowBookmarked
      }));
      
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
  
  // Filter and search articles
  const filteredArticles = articles?.filter(article => {
    // Filter by tab selection
    if (filter === 'featured' && !article.is_featured) return false;
    if (filter === 'bookmarked' && !bookmarkedArticles[article.id]) return false;
    
    // Filter by category
    if (category !== 'all' && article.category !== category) return false;
    
    // Filter by search term
    if (search && !article.title.toLowerCase().includes(search.toLowerCase()) && 
        !article.summary.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Extract unique categories from articles
  const categories = articles 
    ? [...new Set(articles.map(article => article.category).filter(Boolean))]
    : [];
  
  if (isLoading) {
    return <div className="flex justify-center p-12">Loading newsletter archive...</div>;
  }
  
  if (isError) {
    return (
      <div className="p-12 text-center">
        <p className="text-red-500 mb-4">Failed to load newsletter articles.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-supernova-navy to-black text-white py-12 px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="font-display text-4xl font-bold mb-4">Newsletter Archive</h1>
          <p className="text-white/70 max-w-2xl">
            Browse our collection of premium financial insights and market analysis. 
            Access is based on your membership tier.
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-8">
          <Tabs defaultValue="all" onValueChange={setFilter} className="mb-6">
            <TabsList className="bg-white/5">
              <TabsTrigger value="all">All Articles</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="bookmarked">Saved Articles</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search articles..."
                className="pl-9 bg-white/5 border-white/10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 max-w-xs">
              <Filter className="h-4 w-4 text-white/50" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-supernova-navy border-white/10">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat || ''}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Message for current tier */}
        <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
          <p>
            You are currently on the <span className="font-bold text-supernova-gold">
              {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Tier
            </span>. 
            {userTier !== 'premium' && (
              <span className="ml-2">
                <Button asChild variant="link" className="text-supernova-gold p-0">
                  <a href="/premium-version">Upgrade your membership</a>
                </Button> for full archive access.
              </span>
            )}
          </p>
        </div>
        
        {/* Articles grid */}
        {filteredArticles?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                userTier={userTier}
                isBookmarked={bookmarkedArticles[article.id]}
                onBookmark={handleToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookmarkCheck className="h-16 w-16 mx-auto text-white/30 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-white/70">
              {filter === 'bookmarked' 
                ? "You haven't saved any articles yet." 
                : "Try adjusting your filters or search criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterArchive;
