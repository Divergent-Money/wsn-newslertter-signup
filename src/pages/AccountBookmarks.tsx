
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookmarkedArticle {
  id: string;
  title: string;
  summary: string;
  slug: string;
  feature_image_url?: string;
  author: string;
  publish_date: string;
}

const AccountBookmarks = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<BookmarkedArticle[]>([]);

  // Fetch bookmarked articles when component mounts
  useEffect(() => {
    const fetchBookmarkedArticles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get the user's bookmarks
        const { data: bookmarks, error: bookmarksError } = await supabase
          .from('user_bookmarks')
          .select('article_id')
          .eq('user_id', user.id);
        
        if (bookmarksError) {
          console.error("Error fetching bookmarks:", bookmarksError);
          return;
        }
        
        if (!bookmarks || bookmarks.length === 0) {
          setBookmarkedArticles([]);
          setLoading(false);
          return;
        }
        
        const articleIds = bookmarks.map(b => b.article_id);
        
        // Get the article details for each bookmark
        const { data: articles, error: articlesError } = await supabase
          .from('newsletter_articles')
          .select('id, title, summary, slug, feature_image_url, author, publish_date')
          .in('id', articleIds);
        
        if (articlesError) {
          console.error("Error fetching articles:", articlesError);
          return;
        }
        
        setBookmarkedArticles(articles as BookmarkedArticle[]);
      } catch (error) {
        console.error("Error in fetchBookmarkedArticles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookmarkedArticles();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto py-10 px-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Articles</CardTitle>
            <CardDescription>You need to be logged in to view this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-supernova-gold">Saved Articles</h1>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-supernova-gold"></div>
          </div>
        ) : bookmarkedArticles.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Saved Articles</CardTitle>
              <CardDescription>
                You haven't saved any articles yet. Browse our newsletters and click the bookmark icon to save articles for later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                to="/newsletters" 
                className="inline-flex items-center text-supernova-gold hover:underline"
              >
                Browse Newsletters
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {bookmarkedArticles.map((article) => (
              <Link key={article.id} to={`/newsletters/${article.slug}`}>
                <Card className="h-full hover:border-supernova-gold/50 transition-colors">
                  <div className="relative">
                    {article.feature_image_url && (
                      <div 
                        className="h-40 w-full bg-center bg-cover rounded-t-lg" 
                        style={{ backgroundImage: `url(${article.feature_image_url})` }}
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <Bookmark className="h-5 w-5 fill-supernova-gold text-supernova-gold" />
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription>
                      By {article.author} • {new Date(article.publish_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-3">{article.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountBookmarks;
