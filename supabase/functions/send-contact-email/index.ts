import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  console.log('[send-contact-email] Function invoked');
  console.log('[send-contact-email] Request method:', req.method);
  console.log('[send-contact-email] Request URL:', req.url);

  if (req.method === "OPTIONS") {
    console.log('[send-contact-email] Handling OPTIONS preflight request');
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    console.log('[send-contact-email] Parsing request body');
    const { name, email, message }: ContactFormData = await req.json();
    console.log('[send-contact-email] Received data:', { name, email, messageLength: message?.length });

    if (!name || !email || !message) {
      console.warn('[send-contact-email] Missing required fields:', { hasName: !!name, hasEmail: !!email, hasMessage: !!message });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const emailContent = {
      to: "info@lordsmithlamps.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #8B4513; margin-bottom: 5px; }
            .value { background: white; padding: 15px; border-radius: 4px; border: 1px solid #ddd; }
            .footer { margin-top: 20px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Name:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="label">Message:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class="footer">
                Sent from Lord Smith Lamps Contact Form
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
Sent from Lord Smith Lamps Contact Form
      `,
    };

    console.log('[send-contact-email] Checking for RESEND_API_KEY');
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      console.error('[send-contact-email] RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
    console.log('[send-contact-email] RESEND_API_KEY found');

    const emailPayload = {
      from: "Lord Smith Lamps <noreply@lordsmithlamps.com>",
      to: emailContent.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };
    console.log('[send-contact-email] Preparing email payload:', {
      from: emailPayload.from,
      to: emailPayload.to,
      subject: emailPayload.subject,
      htmlLength: emailPayload.html.length,
      textLength: emailPayload.text.length
    });

    console.log('[send-contact-email] Calling Resend API...');
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    console.log('[send-contact-email] Resend API response status:', resendResponse.status);
    console.log('[send-contact-email] Resend API response ok:', resendResponse.ok);

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error('[send-contact-email] Resend API error status:', resendResponse.status);
      console.error('[send-contact-email] Resend API error response:', errorText);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: errorText }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const resendData = await resendResponse.json();
    console.log('[send-contact-email] Resend API success response:', resendData);

    console.log('[send-contact-email] Email sent successfully');
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", emailId: resendData.id }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error('[send-contact-email] Caught error:', error);
    console.error('[send-contact-email] Error type:', error?.constructor?.name);
    console.error('[send-contact-email] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[send-contact-email] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
