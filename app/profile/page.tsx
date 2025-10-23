"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the shape of an order table row
interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
}

interface Order {
  id: string;
  user_id: string;
  order_date: string;
  total: number;
  items: OrderItem[];
}

// Define Supabase user structure
interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          setLoading(false);
          return;
        }

        // 1. Get base auth user
        const currentUser: SupabaseUser = {
          id: data.user.id,
          email: data.user.email ?? "unknown@example.com",
        };

        // 2. Fetch from 'profiles' table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", data.user.id)
          .maybeSingle();

        if (profileError) {
          console.warn("Error fetching profile:", profileError.message);
        }

        if (profileData?.name) currentUser.name = profileData.name;
        setUser(currentUser);

        // 3. Fetch user's orders
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", data.user.id)
          .order("order_date", { ascending: false });

        if (orderError) {
          console.warn("Error fetching orders:", orderError.message);
        }

        setOrders(
          (orderData ?? []).map((order) => ({
            ...order,
            // Ensure items is always an array
            items:
              typeof order.items === "string"
                ? JSON.parse(order.items || "[]")
                : Array.isArray(order.items)
                ? order.items
                : [],
          }))
        );
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  }

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!user) return <p className="p-4">Please sign in to view your profile.</p>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>User Name :</strong> {user.name}
          </p>
          <p>
            <strong>E-mail :</strong> {user.email}
          </p>
        </CardContent>
      </Card>

        <Button className="bg-red-600 text-white" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  );
}
