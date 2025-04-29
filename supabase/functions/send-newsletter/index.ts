
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
    const { 
      newsletterId, 
      emailSubject, 
      emailType,
      testEmailAddress,
      subscriberId 
    } = body;
    
    // Initialize Supabase client with service role key (accessed from environment variable)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Handle welcome email flow for new subscribers
    if (emailType === 'welcome' && subscriberId) {
      return await sendWelcomeEmail(supabase, subscriberId);
    }
    
    // Regular newsletter flow requires a newsletter ID
    if (!newsletterId && emailType !== 'welcome') {
      throw new Error("Newsletter ID is required for non-welcome emails");
    }

    // 1. Fetch the newsletter article if it's not a welcome email
    let newsletter = null;
    if (newsletterId) {
      const { data: fetchedNewsletter, error: newsletterError } = await supabase
        .from('newsletter_articles')
        .select('*')
        .eq('id', newsletterId)
        .single();
        
      if (newsletterError || !fetchedNewsletter) {
        throw new Error(`Failed to fetch newsletter: ${newsletterError?.message || "Newsletter not found"}`);
      }
      
      newsletter = fetchedNewsletter;
    }
    
    // If this is a test email, just send to the specified address
    if (testEmailAddress) {
      console.log(`Sending test ${emailType} email to ${testEmailAddress}`);
      
      // Prepare email content based on email type
      let emailContent = "";
      let emailTitle = "";
      
      if (emailType === 'welcome') {
        emailTitle = "Welcome to WealthSuperNova";
        emailContent = createWelcomeEmailContent();
      } else if (newsletter) {
        emailTitle = newsletter.title;
        
        if (emailType === 'summary') {
          // For summary, use just the newsletter summary instead of full content
          emailContent = `<h1>${newsletter.title}</h1><p>${newsletter.summary}</p>
            <p><a href="${Deno.env.get("FRONTEND_URL")}/newsletters/${newsletter.slug}">Read the full newsletter</a></p>`;
        } else {
          emailContent = newsletter.content;
        }
      }
      
      // Convert basic HTML to email-friendly HTML
      const htmlContent = createEmailTemplate(emailTitle, emailContent);
      
      // Send the email using Resend
      const emailResponse = await resend.emails.send({
        from: "WealthSuperNova <newsletter@wealth-supernova.com>",
        to: testEmailAddress,
        subject: emailSubject || `${emailTitle} - WealthSuperNova`,
        html: htmlContent,
      });
      
      console.log("Test email sent:", emailResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Test email sent to ${testEmailAddress}`,
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
    
    // For welcome emails, we only need to fetch the specific subscriber
    if (emailType === 'welcome' && subscriberId) {
      const { data: subscriber, error: subscriberError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .eq('id', subscriberId)
        .single();
        
      if (subscriberError || !subscriber) {
        throw new Error(`Failed to fetch subscriber: ${subscriberError?.message || "Subscriber not found"}`);
      }
      
      const emailTitle = "Welcome to WealthSuperNova";
      const emailContent = createWelcomeEmailContent();
      const htmlContent = createEmailTemplate(emailTitle, emailContent);
      
      // Send the email using Resend
      const emailResponse = await resend.emails.send({
        from: "WealthSuperNova <newsletter@wealth-supernova.com>",
        to: subscriber.email,
        subject: emailSubject || `${emailTitle} - WealthSuperNova Newsletter`,
        html: htmlContent,
      });
      
      // Update the subscriber record to mark confirmation email as sent
      await supabase
        .from('newsletter_subscribers')
        .update({
          confirmation_sent_at: new Date().toISOString()
        })
        .eq('id', subscriberId);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Welcome email sent to ${subscriber.email}`,
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
    
    // 2. If sending a regular newsletter, fetch subscribers from both sources
    
    // 2a. Get paid subscribers based on the newsletter's minimum tier
    const { data: paidSubscribers, error: subscribersError } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .gte('tier', newsletter.min_tier)
      .eq('payment_status', 'active');
      
    if (subscribersError) {
      console.error(`Failed to fetch paid subscribers: ${subscribersError.message}`);
      // Continue with other subscribers
    }
    
    // 2b. Get email addresses from profiles for paid subscribers
    let paidUserEmails = [];
    if (paidSubscribers && paidSubscribers.length > 0) {
      const userIds = paidSubscribers.map(sub => sub.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email, id')
        .in('id', userIds);
        
      if (profilesError) {
        console.error(`Failed to fetch user emails: ${profilesError.message}`);
      } else if (profiles) {
        paidUserEmails = profiles.map(profile => ({
          email: profile.email,
          id: profile.id,
          source: 'paid'
        })).filter(item => item.email);
      }
    }
    
    // 2c. Get free newsletter subscribers
    const { data: freeSubscribers, error: freeSubError } = await supabase
      .from('newsletter_subscribers')
      .select('email, id, name')
      .eq('is_confirmed', true);
      
    if (freeSubError) {
      console.error(`Failed to fetch free subscribers: ${freeSubError.message}`);
    }
    
    let freeUserEmails = [];
    if (freeSubscribers && freeSubscribers.length > 0) {
      freeUserEmails = freeSubscribers.map(sub => ({
        email: sub.email,
        id: sub.id,
        name: sub.name,
        source: 'free'
      }));
    }
    
    // 2d. Combine both subscriber types
    const allRecipients = [...paidUserEmails, ...freeUserEmails];
    
    if (allRecipients.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No eligible subscribers found with valid email addresses"
        }),
        { 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders 
          },
          status: 404
        }
      );
    }
    
    // 3. Prepare content based on email type
    let emailContent = newsletter.content;
    
    if (emailType === 'summary') {
      // For summary, use just the newsletter summary instead of full content
      emailContent = `<h1>${newsletter.title}</h1><p>${newsletter.summary}</p>
        <p><a href="${Deno.env.get("FRONTEND_URL")}/newsletters/${newsletter.slug}">Read the full newsletter</a></p>`;
    }
    
    // 4. Send emails using Resend (for production, you'd batch these or use a queue)
    console.log(`Sending ${emailType} newsletter "${emailSubject}" to ${allRecipients.length} subscribers`);
    
    // For demo purposes, we'll just send to the first 5 recipients to avoid rate limits
    const batchSize = 5;
    const recipientBatch = allRecipients.slice(0, Math.min(batchSize, allRecipients.length));
    
    // Track successful sends
    let successCount = 0;
    
    // For each recipient in the batch, send a personalized email
    for (let i = 0; i < recipientBatch.length; i++) {
      const recipient = recipientBatch[i];
      
      try {
        // Create a personalized email for each recipient
        const htmlContent = createEmailTemplate(
          newsletter.title, 
          emailContent,
          recipient.name,
          recipient.source === 'paid' 
            ? `${Deno.env.get("FRONTEND_URL")}/account/preferences?uid=${recipient.id}`
            : `${Deno.env.get("FRONTEND_URL")}/preferences?sid=${recipient.id}`
        );
        
        const emailResult = await resend.emails.send({
          from: "WealthSuperNova <newsletter@wealth-supernova.com>",
          to: recipient.email,
          subject: emailSubject || `${newsletter.title} - WealthSuperNova Newsletter`,
          html: htmlContent,
        });
        
        console.log(`Email sent to ${recipient.email}: ${emailResult.id}`);
        successCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${recipient.email}:`, emailError);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter sent to ${successCount} recipients (${allRecipients.length} total subscribers).`,
        recipientCount: allRecipients.length,
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

// Helper function to send a welcome email to a new subscriber
async function sendWelcomeEmail(supabase, subscriberId) {
  const { data: subscriber, error: subscriberError } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .eq('id', subscriberId)
    .single();
    
  if (subscriberError || !subscriber) {
    throw new Error(`Failed to fetch subscriber: ${subscriberError?.message || "Subscriber not found"}`);
  }
  
  const emailTitle = "Welcome to WealthSuperNova";
  const emailContent = createWelcomeEmailContent(subscriber.name);
  const htmlContent = createEmailTemplate(
    emailTitle, 
    emailContent, 
    subscriber.name
  );
  
  // Send the welcome email
  const emailResponse = await resend.emails.send({
    from: "WealthSuperNova <newsletter@wealth-supernova.com>",
    to: subscriber.email,
    subject: `${emailTitle} - Thank You for Subscribing`,
    html: htmlContent,
  });
  
  // Update the subscriber record to mark confirmation email as sent
  await supabase
    .from('newsletter_subscribers')
    .update({
      confirmation_sent_at: new Date().toISOString(),
      is_confirmed: true // Auto-confirm for now
    })
    .eq('id', subscriberId);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: `Welcome email sent to ${subscriber.email}`,
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

// Helper function to create welcome email content
function createWelcomeEmailContent(name = "") {
  const greeting = name ? `Hello ${name},` : "Hello,";
  
  return `
    <h1>Welcome to WealthSuperNova!</h1>
    <p>${greeting}</p>
    <p>Thank you for subscribing to our exclusive newsletter. We're excited to have you join our community of sophisticated investors and financial independence seekers.</p>
    <p>What you can expect:</p>
    <ul>
      <li>Bi-weekly financial insights and market analysis</li>
      <li>Exclusive investment opportunities</li>
      <li>Wealth-building strategies you won't find elsewhere</li>
      <li>Early access to premium features as we roll them out</li>
    </ul>
    <p>Your first newsletter will arrive in your inbox soon.</p>
    <p>In the meantime, if you have any questions or specific topics you'd like us to cover, feel free to reply to this email.</p>
    <p>To financial success,</p>
    <p>The WealthSuperNova Team</p>
  `;
}

// Helper function to create a base HTML template for emails
function createEmailTemplate(title, content, recipientName = "", preferencesUrl = "") {
  const greeting = recipientName ? `<p>Hello ${recipientName},</p>` : "";
  const preferencesLink = preferencesUrl 
    ? `<p><a href="${preferencesUrl}">Manage your subscription preferences</a></p>` 
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        h1 { color: #1a2e44; }
        img { max-width: 100%; height: auto; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 200px; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2 style="color: #D4AF37; font-weight: bold;">WealthSuperNova</h2>
      </div>
      ${greeting}
      ${content}
      <div class="footer">
        <p>WealthSuperNova Newsletter<br>
        © ${new Date().getFullYear()} WealthSuperNova. All rights reserved.</p>
        ${preferencesLink}
      </div>
    </body>
    </html>
  `;
}
