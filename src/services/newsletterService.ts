
import { supabase } from "@/lib/supabase";
import { NewsletterFormValues } from "@/schemas/newsletterSchema";

/**
 * Submits a newsletter signup to the Supabase database
 * 
 * @param data Form values from the newsletter signup form
 * @returns Promise that resolves when the insertion is complete
 */
export const submitNewsletterSignup = async (data: NewsletterFormValues) => {
  try {
    console.log("Newsletter signup data:", data);
    
    // Prepare the data object with all required fields
    const subscriberData = {
      name: data.name,
      email: data.email,
      access_code: data.accessCode || '',
      investment_level: data.investmentLevel || '$100K-$500K',
      interests: Array.isArray(data.interests) ? data.interests : [],
      referral_source: data.referralSource || '',
      created_at: new Date().toISOString(),
      source: 'homepage_newsletter_form',
      page_location: typeof window !== 'undefined' ? window.location.href : null
    };
    
    console.log("Prepared subscriber data:", subscriberData);
    
    // Insert new subscriber or update existing one
    const { data: insertedData, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        subscriberData,
        { 
          onConflict: 'email',
          ignoreDuplicates: false
        }
      )
      .select('id')
      .single();
      
    if (insertError) {
      console.error('Error in newsletter signup (detailed):', {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      throw new Error(`Signup error: ${insertError.message}`);
    }
    
    const subscriberId = insertedData?.id;
    if (!subscriberId) {
      throw new Error('Failed to retrieve subscriber ID');
    }
    
    console.log("Successfully inserted subscriber with ID:", subscriberId);
    
    // Try to send a welcome email using the edge function (if it exists)
    try {
      console.log("Attempting to send welcome email for subscriber:", subscriberId);
      const { error: welcomeEmailError } = await supabase.functions.invoke('send-newsletter', {
        body: {
          subscriberId,
          emailType: 'welcome',
          emailSubject: 'Welcome to WealthSuperNova Newsletter'
        }
      });
      
      if (welcomeEmailError) {
        console.error('Welcome email could not be sent:', welcomeEmailError);
        // We don't throw here as the signup was successful
      } else {
        console.log("Welcome email sent successfully");
      }
    } catch (emailError) {
      console.error('Error invoking welcome email function:', emailError);
      // We don't throw here as the signup was successful
    }
    
    return { isNewSubscriber: true, id: subscriberId };
  } catch (error) {
    console.error('Newsletter signup failed:', error);
    throw error;
  }
};

/**
 * Sends a welcome email to a new subscriber
 * 
 * @param subscriberId ID of the subscriber to send email to
 * @returns Promise that resolves when the email is sent
 */
export const sendWelcomeEmail = async (subscriberId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-newsletter', {
      body: {
        subscriberId,
        emailType: 'welcome',
        emailSubject: 'Welcome to WealthSuperNova Newsletter'
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
