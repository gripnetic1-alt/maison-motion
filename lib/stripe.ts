import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" }) : null;

export const planPrices = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "mock_starter",
  pro: process.env.STRIPE_PRICE_PRO ?? "mock_pro",
  agency: process.env.STRIPE_PRICE_AGENCY ?? "mock_agency",
} as const;

export async function createCheckoutSession(plan: keyof typeof planPrices, customerEmail: string) {
  if (!stripe) return { mode: "mock" as const, url: `/dashboard?checkout=mock&plan=${plan}` };
  return stripe.checkout.sessions.create({ mode: "subscription", customer_email: customerEmail, line_items: [{ price: planPrices[plan], quantity: 1 }], success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`, cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled` });
}
