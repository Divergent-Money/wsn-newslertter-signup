
import { supabase } from "@/lib/supabase";
import { NewsletterFormValues } from "@/schemas/newsletterSchema";

export const submitNewsletterSignup = async (data: NewsletterFormValues) => {
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([
      { 
        name: data.name,
        email: data.email,
        access_code: data.accessCode,
        investment_level: data.investmentLevel,
        interests: data.interests,
        referral_source: data.referralSource,
        created_at: new Date().toISOString(),
        source: 'homepage_newsletter_form',
        page_location: window.location.href
      }
    ]);
    
  if (error) {
    throw error;
  }
};
