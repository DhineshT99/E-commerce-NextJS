import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// define CartItem type
interface CartItem {
  id: string;
  name: string;
  price: number;  
  quantity: number;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover", 
});
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const items = data.items as CartItem[];

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    // map items to Stripe line items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "cad",
        product_data: { name: item.name },
        unit_amount: item.price, // amount in cents
      },
      quantity: item.quantity,
    }));

    // create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    });

    console.log("Stripe session created:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
  let message = "Unknown error";

  if (error instanceof Error) {
    message = error.message;
  }

  console.error("Error creating Stripe session:", message);
  return NextResponse.json({ error: message }, { status: 500 });
}
}
