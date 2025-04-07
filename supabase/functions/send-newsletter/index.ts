
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Handle requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.json();
    const { newsletterId, emailSubject, emailType, testEmailAddress } = body;
    
    if (!newsletterId) {
      throw new Error("Newsletter ID is required");
    }

    // Initialize Supabase client with service role key (accessed from environment variable)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // 1. Fetch the newsletter article
    const { data: newsletter, error: newsletterError } = await supabase
      .from('newsletter_articles')
      .select('*')
      .eq('id', newsletterId)
      .single();
      
    if (newsletterError || !newsletter) {
      throw new Error(`Failed to fetch newsletter: ${newsletterError?.message || "Newsletter not found"}`);
    }
    
    // If this is a test email, just send to the specified address
    if (testEmailAddress) {
      console.log(`Sending test newsletter "${emailSubject}" to ${testEmailAddress}`);
      
      // Here you would integrate with your preferred email service API
      // For example, with SendGrid, Mailgun, Resend, etc.
      // This is a placeholder for the actual email sending logic
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Test newsletter sent to ${testEmailAddress}`,
          recipientCount: 1
        }),
        { 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          } 
        }
      );
    }
    
    // 2. Fetch subscribers based on the newsletter's minimum tier
    const { data: subscribers, error: subscribersError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .gte('tier', newsletter.min_tier)
      .eq('payment_status', 'active');
      
    if (subscribersError) {
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }
    
    // 3. Get email addresses from profiles
    const userIds = subscribers.map(sub => sub.user_id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email')
      .in('id', userIds);
      
    if (profilesError) {
      throw new Error(`Failed to fetch user emails: ${profilesError.message}`);
    }
    
    const emailAddresses = profiles.map(profile => profile.email).filter(Boolean);
    
    if (emailAddresses.length === 0) {
      throw new Error("No eligible subscribers found with valid email addresses");
    }
    
    // 4. Prepare content based on email type
    let emailContent = newsletter.content;
    
    if (emailType === 'summary') {
      // For summary, use just the newsletter summary instead of full content
      emailContent = `<h1>${newsletter.title}</h1><p>${newsletter.summary}</p>
        <p><a href="${Deno.env.get("FRONTEND_URL")}/newsletters/${newsletter.slug}">Read the full newsletter</a></p>`;
    }
    
    // 5. Log the email sending process (in a real implementation you'd connect to an email service)
    console.log(`Sending ${emailType} newsletter "${emailSubject}" to ${emailAddresses.length} subscribers`);
    console.log(`Newsletter ID: ${newsletterId}, Title: ${newsletter.title}`);
    
    // In a real implementation, you would send the emails using a service like SendGrid, Mailgun, Resend, etc.
    // For example with Resend:
    // 
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // const emailResponse = await resend.emails.send({
    //   from: "WealthSuperNova <newsletter@wealthsupernova.com>",
    //   to: recipientEmail,
    //   subject: emailSubject,
    //   html: emailContent
    // });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter scheduled for delivery to ${emailAddresses.length} subscribers`,
        recipientCount: emailAddresses.length
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error("Error in send-newsletter function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders 
        } 
      }
    );
  }
});
