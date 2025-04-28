
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Resend client
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
      
      // Prepare email content based on email type
      let emailContent = newsletter.content;
      
      if (emailType === 'summary') {
        // For summary, use just the newsletter summary instead of full content
        emailContent = `<h1>${newsletter.title}</h1><p>${newsletter.summary}</p>
          <p><a href="${Deno.env.get("FRONTEND_URL")}/newsletters/${newsletter.slug}">Read the full newsletter</a></p>`;
      }
      
      // Convert basic HTML to email-friendly HTML
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${newsletter.title}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { color: #1a2e44; }
            img { max-width: 100%; height: auto; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>${newsletter.title}</h1>
          ${emailContent}
          <div class="footer">
            <p>WealthSuperNova Newsletter<br>
            © ${new Date().getFullYear()} WealthSuperNova. All rights reserved.</p>
            <p><a href="${Deno.env.get("FRONTEND_URL")}/account/preferences">Manage your subscription preferences</a></p>
          </div>
        </body>
        </html>
      `;
      
      // Send the email using Resend
      const emailResponse = await resend.emails.send({
        from: "WealthSuperNova <newsletter@wealth-supernova.com>",
        to: testEmailAddress,
        subject: emailSubject || `${newsletter.title} - WealthSuperNova Newsletter`,
        html: htmlContent,
      });
      
      console.log("Test email sent:", emailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Test newsletter sent to ${testEmailAddress}`,
          recipientCount: 1,
          emailId: emailResponse.id
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
      .select('email, id')
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
    
    // Create a base HTML template for the email
    const createEmailHtml = (recipientId: string) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newsletter.title}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #1a2e44; }
          img { max-width: 100%; height: auto; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <h1>${newsletter.title}</h1>
        ${emailContent}
        <div class="footer">
          <p>WealthSuperNova Newsletter<br>
          © ${new Date().getFullYear()} WealthSuperNova. All rights reserved.</p>
          <p><a href="${Deno.env.get("FRONTEND_URL")}/account/preferences?uid=${recipientId}">Manage your subscription preferences</a></p>
        </div>
      </body>
      </html>
    `;
    
    // 5. Send emails using Resend (for production, you'd batch these or use a queue)
    console.log(`Sending ${emailType} newsletter "${emailSubject}" to ${emailAddresses.length} subscribers`);
    
    // For demo purposes, we'll just send to the first 5 recipients to avoid rate limits
    const batchSize = 5;
    const recipientBatch = emailAddresses.slice(0, Math.min(batchSize, emailAddresses.length));
    
    // Track successful sends
    let successCount = 0;
    
    // For each recipient in the batch, send a personalized email
    for (let i = 0; i < recipientBatch.length; i++) {
      const recipient = recipientBatch[i];
      const recipientProfile = profiles.find(p => p.email === recipient);
      
      if (!recipientProfile) continue;
      
      try {
        const emailResult = await resend.emails.send({
          from: "WealthSuperNova <newsletter@wealth-supernova.com>",
          to: recipient,
          subject: emailSubject || `${newsletter.title} - WealthSuperNova Newsletter`,
          html: createEmailHtml(recipientProfile.id),
        });
        
        console.log(`Email sent to ${recipient}: ${emailResult.id}`);
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${recipient}:`, emailError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter sent to ${successCount} recipients (${emailAddresses.length} total subscribers).`,
        recipientCount: emailAddresses.length,
        sentCount: successCount,
        note: "For demo purposes, only sending to a small subset of subscribers."
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
