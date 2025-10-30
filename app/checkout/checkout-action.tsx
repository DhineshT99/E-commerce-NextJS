"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function checkoutAction(formData: FormData) {
  // ✅ Create Stripe instance using your actual account version
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-09-30.clover", // match the version shown in your error
  });

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // ✅ Parse and validate form data
  const items = JSON.parse(formData.get("items") as string) as {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items provided for checkout.");
  }

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Insert order record in Supabase
  const { data: order, error } = await supabase
    .from("orders")
    .insert([
      {
        user_id: user.id,
        items,
        total,
        status: "pending",
        order_date: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error("Failed to create order");
  }

  // ✅ Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price, // price in paise
      },
      quantity: item.quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    metadata: { order_id: order.id },
  });

  redirect(session.url!);
}
