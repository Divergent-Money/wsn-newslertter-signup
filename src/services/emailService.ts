
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

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
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("You must be logged in to send newsletters");
    }
    
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
      toast({
        title: "Error sending newsletter",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
        duration: 5000
      });
      throw new Error(`Failed to send newsletter: ${error.message}`);
    }
    
    return data;
  } catch (error: any) {
    console.error("Error in sendNewsletterToSubscribers:", error);
    toast({
      title: "Error sending newsletter",
      description: error.message || "An unknown error occurred",
      variant: "destructive",
      duration: 5000
    });
    throw error;
  }
};
