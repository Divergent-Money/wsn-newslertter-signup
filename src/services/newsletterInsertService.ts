
import { supabase } from "@/lib/supabase";
import { NewsletterArticle } from "./newsletterArchiveService";
import { toast } from "@/hooks/use-toast";

/**
 * Inserts a new newsletter article into the database
 */
export const insertNewsletterArticle = async (article: Omit<NewsletterArticle, "id" | "created_at" | "updated_at">) => {
  console.log("Inserting newsletter article:", article);
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create newsletter articles",
        variant: "destructive",
        duration: 5000
      });
      throw new Error("You must be logged in to create newsletter articles");
    }
    
    // Make sure we're using the right Supabase client
    const { data, error } = await supabase
      .from('newsletter_articles')
      .insert(article)
      .select()
      .single();
      
    if (error) {
      console.error("Error inserting article:", error);
      toast({
        title: "Error creating article",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
        duration: 5000
      });
      throw new Error(`Failed to insert article: ${error.message}`);
    }
    
    toast({
      title: "Article created",
      description: "Newsletter article was created successfully",
      duration: 3000
    });
    
    return data;
  } catch (error: any) {
    console.error("Error in insertNewsletterArticle:", error);
    throw error;
  }
};

/**
 * Uploads an image to Supabase storage and returns the public URL
 */
export const uploadArticleImage = async (file: File, folderName: string = "newsletter_images") => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload images",
        variant: "destructive",
        duration: 5000
      });
      throw new Error("You must be logged in to upload images");
    }
    
    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG, GIF, or WebP image",
        variant: "destructive",
        duration: 5000
      });
      throw new Error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
    }
    
    // Max size: 5MB
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
        duration: 5000
      });
      throw new Error('File is too large. Maximum size is 5MB.');
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${folderName}/${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      toast({
        title: "Error uploading file",
        description: uploadError.message || "An unknown error occurred",
        variant: "destructive",
        duration: 5000
      });
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error: any) {
    console.error("Error in uploadArticleImage:", error);
    throw error;
  }
};
