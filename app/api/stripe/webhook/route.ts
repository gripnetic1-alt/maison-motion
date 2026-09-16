import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = headers().get("stripe-signature");
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET || !signature) {
    return NextResponse.json({ received: true, mode: "mock", message: "Webhook ignoré en mode local." });
  }
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    // TODO: persist customer/subscription status in Supabase on these events.
    if (["checkout.session.completed", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) {
      console.info(`[stripe] sync ${event.type}`);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid signature" }, { status: 400 });
  }
}
