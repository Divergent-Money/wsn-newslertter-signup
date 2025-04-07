
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
    const { newsletterId, emailSubject, emailType } = body;
    
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
    
    // 2. Fetch subscribers based on the newsletter's minimum tier
    const { data: subscribers, error: subscribersError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .gte('tier', newsletter.min_tier);
      
    if (subscribersError) {
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }
    
    // 3. For each subscriber, get their email from auth.users (requires service role)
    const userIds = subscribers.map(sub => sub.user_id);
    const { data: users, error: usersError } = await supabase
      .from('profiles')  // Assuming you have a profiles table linked to auth.users
      .select('id, email')
      .in('id', userIds);
      
    if (usersError || !users) {
      throw new Error(`Failed to fetch user emails: ${usersError?.message || "No users found"}`);
    }
    
    // 4. Log the email sending process (in a real implementation you'd connect to an email service)
    console.log(`Would send email "${emailSubject}" to ${users.length} subscribers`);
    console.log(`Email Type: ${emailType}, Newsletter: ${newsletter.title}`);
    
    // In a real implementation, you would call your email service here
    // For example with Resend, SendGrid, etc.
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter scheduled for delivery to ${users.length} subscribers`,
        recipientCount: users.length
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
