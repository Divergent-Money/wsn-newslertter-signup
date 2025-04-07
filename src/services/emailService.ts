
import { supabase } from "@/lib/supabase";

/**
 * Sends a newsletter via email to subscribers
 */
export const sendNewsletterToSubscribers = async (
  newsletterId: string, 
  options?: { 
    emailSubject?: string,
    emailType?: 'full' | 'summary' | 'preview',
    testEmailAddress?: string
  }
) => {
  const { emailSubject, emailType = 'full', testEmailAddress } = options || {};
  
  const { data, error } = await supabase.functions.invoke('send-newsletter', {
    body: {
      newsletterId,
      emailSubject,
      emailType,
      testEmailAddress,
    }
  });
  
  if (error) {
    console.error("Error sending newsletter:", error);
    throw new Error(`Failed to send newsletter: ${error.message}`);
  }
  
  return data;
};
