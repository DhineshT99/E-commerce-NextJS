import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with the current API version automatically inferred
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const runtime = "nodejs"; // ensures Node.js runtime for raw body parsing

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return new NextResponse("Missing Stripe signature or webhook secret", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("✅ Payment successful for session:", session.id);

        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment intent succeeded:", paymentIntent.id);
        break;
      }

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("⚠️ Error handling webhook:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
