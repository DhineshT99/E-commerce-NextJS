import { supabase } from "@/lib/supabase";

export interface CartItem {
  id: string;
  name: string;
  price: number; // in paise
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  user_id: string;
  total: number; 
  items: { name: string; quantity: number; price: number }[]; 
  order_date?: string;
}

export interface NewOrder {
  user_id: string;
  total: number;
  items: { name: string; quantity: number; price: number }[]; 
}

export async function placeOrder(
  userId: string,
  cartItems: CartItem[]
): Promise<Order | null> {
  if (!userId || cartItems.length === 0) {
     console.error("Cannot place order: Missing user or empty cart.");
     return null;
  }

  try {
     // Calculate total in paise (prevents floating point errors)
     const totalInPaise = cartItems.reduce(
       (sum, item) => sum + (item.price ?? 0) * item.quantity,
       0
     );

     // Prepare items for database, keeping price in paise for consistency
     const itemsToSave: NewOrder["items"] = cartItems.map((item) => ({
       name: item.name,
       quantity: item.quantity,
       price: item.price, 
     }));

     // Insert into Supabase orders table
     const { data, error } = await supabase 
       .from("orders")
       .insert([
          {
            user_id: userId,
            total: totalInPaise, 
            items: itemsToSave,  
          },
       ])
       .select("*"); 
     
    // Type assertion to resolve complex Supabase/Next.js type issues
    const resultData = data as Order[] | null;

     if (error) {
       console.error("Error placing order:", error.message);
       return null;
     }

     if (!resultData || resultData.length === 0) {
       console.error("Order inserted but returned data is empty");
       return null;
     }

     return resultData[0];
  } catch (err) {
     console.error("Unexpected error placing order:", err instanceof Error ? err.message : err);
     return null;
  }
}
