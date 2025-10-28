import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OrderItem {
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}

interface ShippingAddress {
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface EmailRequest {
  orderId: string;
  userEmail: string;
  userName: string;
  trackingNumber?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { orderId, userEmail, userName, trackingNumber }: EmailRequest = await req.json();

    if (!orderId || !userEmail || !userName) {
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error("Order not found");
    }

    const { data: address, error: addressError } = await supabase
      .from("shipping_addresses")
      .select("*")
      .eq("user_id", order.user_id)
      .eq("is_default", true)
      .maybeSingle();

    const items = order.order_items as OrderItem[];
    
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #4a3728;">${item.product_name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #4a3728; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #4a3728; text-align: right;">$${item.product_price.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #4a3728; text-align: right;">$${item.subtotal.toFixed(2)}</td>
        </tr>
      `
      )
      .join("");

    const trackingHtml = trackingNumber
      ? `
        <div style="background-color: #065f46; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #6ee7b7; font-size: 14px; font-weight: bold;">TRACKING NUMBER</p>
          <p style="margin: 0; color: #d1fae5; font-size: 20px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 2px;">${trackingNumber}</p>
        </div>
      `
      : "";

    const shippingAddressHtml = address
      ? `
        <tr>
          <td style="padding: 0 30px 20px 30px;">
            <div style="background-color: #2d2419; padding: 20px; border-radius: 8px;">
              <h3 style="margin: 0 0 12px 0; color: #fbbf24; font-size: 16px;">📍 Shipping To</h3>
              <p style="margin: 0; color: #e7dcc8; font-size: 14px; line-height: 1.8;">
                <strong>${address.full_name}</strong><br>
                ${address.address_line1}<br>
                ${address.address_line2 ? `${address.address_line2}<br>` : ""}
                ${address.city}, ${address.state} ${address.postal_code}<br>
                ${address.country}
              </p>
            </div>
          </td>
        </tr>
      `
      : "";

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Shipped - Lord Smith Lamps</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #1a1410;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1410;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #2d2419; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
              
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #d97706 0%, #ea580c 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #fef3c7; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">🔥 Lord Smith Lamps</h1>
                  <p style="margin: 10px 0 0 0; color: #fed7aa; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Handcrafted Upcycled Lamps</p>
                </td>
              </tr>
              
              <!-- Shipping Message -->
              <tr>
                <td style="padding: 40px 30px; text-align: center; background-color: #3d2f1f;">
                  <div style="display: inline-block; background-color: #1e40af; color: #bfdbfe; padding: 12px 24px; border-radius: 8px; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                    📦 Order Shipped!
                  </div>
                  <h2 style="margin: 20px 0 10px 0; color: #fef3c7; font-size: 24px;">Great news, ${userName}!</h2>
                  <p style="margin: 0; color: #e7dcc8; font-size: 16px; line-height: 1.6;">
                    Your handcrafted lamp${items.length > 1 ? "s have" : " has"} been shipped and ${items.length > 1 ? "are" : "is"} on the way to you.
                  </p>
                  ${trackingHtml}
                </td>
              </tr>
              
              <!-- Order Details -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #2d2419; border-radius: 8px; overflow: hidden;">
                    <tr>
                      <td style="padding: 20px; border-bottom: 2px solid #4a3728;">
                        <h3 style="margin: 0; color: #fbbf24; font-size: 18px;">Order Summary</h3>
                        <p style="margin: 8px 0 0 0; color: #d4c5b0; font-size: 14px;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <thead>
                            <tr style="color: #fbbf24; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #4a3728;">Item</th>
                              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #4a3728;">Qty</th>
                              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #4a3728;">Price</th>
                              <th style="padding: 12px; text-align: right; border-bottom: 2px solid #4a3728;">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody style="color: #e7dcc8; font-size: 14px;">
                            ${itemsHtml}
                            <tr style="border-top: 2px solid #4a3728;">
                              <td colspan="3" style="padding: 12px; text-align: right; color: #d4c5b0;">Subtotal:</td>
                              <td style="padding: 12px; text-align: right; color: #e7dcc8;">$${items.reduce((sum, item) => sum + parseFloat(item.subtotal.toString()), 0).toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td colspan="3" style="padding: 12px; text-align: right; color: #d4c5b0;">Shipping:</td>
                              <td style="padding: 12px; text-align: right; color: #e7dcc8;">$${items.reduce((sum, item) => sum + parseFloat(item.subtotal.toString()), 0) === 0 ? '0.00' : (items.reduce((sum, item) => sum + parseFloat(item.subtotal.toString()), 0) * 0.1).toFixed(2)}</td>
                            </tr>
                            <tr>
                              <td colspan="3" style="padding: 12px; text-align: right; color: #d4c5b0;">Tax (9.5%):</td>
                              <td style="padding: 12px; text-align: right; color: #e7dcc8;">$${(items.reduce((sum, item) => sum + parseFloat(item.subtotal.toString()), 0) * 0.095).toFixed(2)}</td>
                            </tr>
                            <tr style="border-top: 2px solid #4a3728;">
                              <td colspan="3" style="padding: 20px 12px 12px 12px; text-align: right; font-weight: bold; color: #fbbf24; font-size: 16px;">Total:</td>
                              <td style="padding: 20px 12px 12px 12px; text-align: right; font-weight: bold; color: #fbbf24; font-size: 18px;">$${parseFloat(order.total_amount).toFixed(2)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              
              ${shippingAddressHtml}
              
              <!-- Delivery Info -->
              <tr>
                <td style="padding: 0 30px 40px 30px;">
                  <div style="background-color: #3d2f1f; border-left: 4px solid #1e40af; padding: 20px; border-radius: 8px;">
                    <h3 style="margin: 0 0 12px 0; color: #fbbf24; font-size: 16px;">🚚 Delivery Information</h3>
                    <p style="margin: 0 0 12px 0; color: #e7dcc8; font-size: 14px; line-height: 1.6;">
                      Your package is now in transit${trackingNumber ? " and you can track its progress using the tracking number above" : ""}. Please allow 3-5 business days for delivery.
                    </p>
                    <p style="margin: 0; color: #d4c5b0; font-size: 13px; line-height: 1.6;">
                      <strong style="color: #fbbf24;">Important:</strong> Someone should be available to receive the package. Signature may be required upon delivery.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #1a1410; text-align: center; border-top: 1px solid #4a3728;">
                  <p style="margin: 0 0 12px 0; color: #a8927a; font-size: 14px;">
                    Questions about your shipment? Contact us anytime.
                  </p>
                  <p style="margin: 0; color: #8b7355; font-size: 12px; line-height: 1.6;">
                    Thank you for supporting handcrafted, sustainable lighting.<br>
                    Every lamp tells a story of transformation and craftsmanship.
                  </p>
                  <p style="margin: 20px 0 0 0; color: #6b5a47; font-size: 11px;">
                    © 2025 Lord Smith Lamps. All rights reserved.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Lord Smith Lamps <orders@lordsmithlamps.com>",
        to: [userEmail],
        subject: `Your order has shipped! 📦 - Order #${orderId.slice(0, 8).toUpperCase()}`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const result = await emailResponse.json();

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending shipping notification:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
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