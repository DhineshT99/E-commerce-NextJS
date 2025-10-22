"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart, items } = useCart();

  useEffect(() => {
    async function placeOrder() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const total = items.reduce((a, i) => a + i.price * i.quantity, 0);
      await supabase.from("orders").insert({
        user_id: user.id,
        total,
        items,
      });
      clearCart();
    }
    placeOrder();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p>Your order has been placed successfully.</p>
      <Link href="/profile" className="text-blue-600 hover:underline mt-2 block">
        View My Orders
      </Link>
    </div>
  );
}
