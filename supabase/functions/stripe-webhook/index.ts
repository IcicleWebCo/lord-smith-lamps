import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Stripe from "npm:stripe@14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CartItem {
  product_id: string;
  quantity: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeSecretKey || !stripeWebhookSecret) {
      throw new Error("Stripe keys are not configured");
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-10-28.acacia",
    });

    const signature = req.headers.get("Stripe-Signature");

    if (!signature) {
      return new Response(
        JSON.stringify({ error: "No signature provided" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        stripeWebhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
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

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;

        if (!userId) {
          console.error("No user_id in session metadata");
          return new Response(
            JSON.stringify({ error: "Missing user_id" }),
            {
              status: 400,
              headers: {
                ...corsHeaders,
                "Content-Type": "application/json",
              },
            }
          );
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          { expand: ["data.price.product"] }
        );

        const totalAmount = session.amount_total ? session.amount_total / 100 : 0;
        const subtotalAmount = session.metadata?.subtotal ? parseFloat(session.metadata.subtotal) : 0;
        const taxAmount = session.metadata?.tax ? parseFloat(session.metadata.tax) : 0;
        const shippingAmount = session.metadata?.shipping ? parseFloat(session.metadata.shipping) : 0;

        let cartItems: CartItem[] = [];
        if (session.metadata?.cart_items) {
          try {
            cartItems = JSON.parse(session.metadata.cart_items);
          } catch (e) {
            console.error("Error parsing cart_items from metadata:", e);
          }
        }

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            total_amount: totalAmount,
            subtotal_amount: subtotalAmount,
            tax_amount: taxAmount,
            shipping_amount: shippingAmount,
            stripe_payment_intent_id: session.payment_intent as string,
            status: "completed",
            order_date: new Date().toISOString(),
          })
          .select()
          .single();

        if (orderError || !order) {
          console.error("Error creating order:", orderError);
          throw new Error("Failed to create order");
        }

        for (const cartItem of cartItems) {
          const { data: productData } = await supabase
            .from("products")
            .select("name, price")
            .eq("id", cartItem.product_id)
            .single();

          if (!productData) {
            console.warn(`Product not found: ${cartItem.product_id}`);
            continue;
          }

          const productName = productData.name;
          const unitAmount = productData.price;
          const quantity = cartItem.quantity;
          const subtotal = unitAmount * quantity;

          const { error: itemError } = await supabase
            .from("order_items")
            .insert({
              order_id: order.id,
              product_id: cartItem.product_id,
              product_name: productName,
              product_price: unitAmount,
              quantity: quantity,
              subtotal: subtotal,
            });

          if (itemError) {
            console.error("Error creating order item:", itemError);
          }

          const { data: product } = await supabase
            .from("products")
            .select("quantity")
            .eq("id", cartItem.product_id)
            .single();

          if (product && product.quantity >= quantity) {
            const newQuantity = product.quantity - quantity;
            const { error: updateError } = await supabase
              .from("products")
              .update({ quantity: newQuantity })
              .eq("id", cartItem.product_id);

            if (updateError) {
              console.error("Error updating product quantity:", updateError);
            } else {
              console.log(`Updated product ${cartItem.product_id} quantity: ${product.quantity} -> ${newQuantity}`);
            }
          } else {
            console.warn(`Insufficient inventory for product ${cartItem.product_id}`);
          }
        }

        console.log(`Order ${order.id} created successfully for user ${userId}`);

        const { data: userData } = await supabase.auth.admin.getUserById(userId);

        if (userData?.user?.email) {
          const userName = userData.user.user_metadata?.name || userData.user.email.split('@')[0];

          try {
            const emailResponse = await fetch(
              `${supabaseUrl}/functions/v1/send-order-confirmation`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${supabaseServiceKey}`,
                },
                body: JSON.stringify({
                  orderId: order.id,
                  userEmail: userData.user.email,
                  userName: userName,
                }),
              }
            );

            if (emailResponse.ok) {
              console.log(`Order confirmation email sent to ${userData.user.email}`);
            } else {
              console.error("Failed to send order confirmation email");
            }
          } catch (emailError) {
            console.error("Error sending order confirmation email:", emailError);
          }
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal server error" 
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
