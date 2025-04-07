
import { supabase } from "@/lib/supabase";
import { NewsletterArticle } from "./newsletterArchiveService";

/**
 * Inserts a new newsletter article into the database
 */
export const insertNewsletterArticle = async (article: Omit<NewsletterArticle, "id" | "created_at" | "updated_at">) => {
  const { data, error } = await supabase
    .from('newsletter_articles')
    .insert(article)
    .select()
    .single();
    
  if (error) {
    console.error("Error inserting article:", error);
    throw new Error(`Failed to insert article: ${error.message}`);
  }
  
  return data;
};

/**
 * Uploads an image to Supabase storage and returns the public URL
 */
export const uploadArticleImage = async (file: File, folderName: string = "newsletter_images") => {
  // Validate file type and size
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
  }
  
  // Max size: 5MB
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
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
    throw new Error(`Failed to upload file: ${uploadError.message}`);
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('public')
    .getPublicUrl(filePath);
    
  return publicUrl;
};
