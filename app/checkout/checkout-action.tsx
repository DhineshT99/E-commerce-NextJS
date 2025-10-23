// /app/checkout/checkout-action.ts

"use server";

import { CartItem } from "@/context/CartContext";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";


export const checkoutAction = async (formData: FormData): Promise<void> => {
    const itemsJson = formData.get("items") as string;
    const items = JSON.parse(itemsJson) as CartItem[];
    
    const totalInCents = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const line_items = items.map((item: CartItem) => ({
      price_data: {
        currency: "cad",
        product_data: { name: item.name },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));
       const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
    });

    redirect(session.url!);
};