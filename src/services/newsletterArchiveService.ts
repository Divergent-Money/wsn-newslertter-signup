
import { supabase } from "@/lib/supabase";

export type SubscriptionTier = 'free' | 'blaze' | 'premium';

export type NewsletterArticle = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  publish_date: string;
  feature_image_url?: string;
  min_tier: SubscriptionTier;
  is_featured: boolean;
  author: string;
  read_time_minutes: number;
  category?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
};

export type UserSubscription = {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  tier_update_date: string;
  subscription_start_date: string;
  subscription_end_date?: string;
};

// Fetch all articles based on user's subscription level
export const fetchNewsletterArticles = async () => {
  const { data: userSubscription, error: subscriptionError } = await supabase
    .from('user_subscriptions')
    .select('tier')
    .single();

  if (subscriptionError) {
    console.error('Error fetching user subscription:', subscriptionError);
    // If there's an error, assume free tier (unauthenticated or no sub record)
    const { data, error } = await supabase
      .from('newsletter_articles')
      .select('*')
      .eq('min_tier', 'free')
      .order('publish_date', { ascending: false });
      
    if (error) throw error;
    return data as NewsletterArticle[];
  }

  // User subscription found, fetch appropriate content based on tier
  const { data, error } = await supabase
    .from('newsletter_articles')
    .select('*')
    .order('publish_date', { ascending: false });
    
  if (error) throw error;
  return data as NewsletterArticle[];
};

// Fetch a single article by slug
export const fetchArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('newsletter_articles')
    .select('*')
    .eq('slug', slug)
    .single();
    
  if (error) throw error;
  return data as NewsletterArticle;
};

// Get user's current subscription tier
export const getUserSubscriptionTier = async (): Promise<SubscriptionTier> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    return 'free'; // Not logged in
  }
  
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('tier')
    .single();
    
  if (error) {
    console.error('Error fetching subscription tier:', error);
    return 'free'; // Default to free on error
  }
  
  return data.tier;
};

// Record article engagement
export const recordArticleEngagement = async (articleId: string, readPercentage: number = 100) => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) return; // Not logged in, don't record
  
  const { error } = await supabase
    .from('article_engagement')
    .upsert({
      user_id: session.session.user.id,
      article_id: articleId,
      read_at: new Date().toISOString(),
      read_percentage: readPercentage,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id,article_id'
    });
    
  if (error) console.error('Error recording engagement:', error);
};

// Toggle bookmark for an article
export const toggleArticleBookmark = async (articleId: string) => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) throw new Error('User not authenticated');
  
  // Check if article is already bookmarked
  const { data: existingBookmark, error: checkError } = await supabase
    .from('user_bookmarks')
    .select('id')
    .eq('user_id', session.session.user.id)
    .eq('article_id', articleId)
    .single();
    
  if (checkError && checkError.code !== 'PGRST116') { // Not found is ok
    throw checkError;
  }
  
  if (existingBookmark) {
    // Remove bookmark
    const { error } = await supabase
      .from('user_bookmarks')
      .delete()
      .eq('id', existingBookmark.id);
      
    if (error) throw error;
    return false; // No longer bookmarked
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('user_bookmarks')
      .insert({
        user_id: session.session.user.id,
        article_id: articleId
      });
      
    if (error) throw error;
    return true; // Now bookmarked
  }
};

// Check if article is bookmarked
export const isArticleBookmarked = async (articleId: string) => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) return false;
  
  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('id')
    .eq('user_id', session.session.user.id)
    .eq('article_id', articleId)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking bookmark status:', error);
  }
  
  return !!data;
};
