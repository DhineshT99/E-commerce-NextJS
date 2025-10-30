"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SupabaseUser {
  id: string;
  email: string;
  name?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number; // paise
  imageUrl?: string;
}

interface Order {
  id: string;
  order_date: string;
  total: number; // paise
  items: OrderItem[];
}

const formatPaiseToRupees = (paise: number): string => {
  return (paise / 100).toFixed(2);
};

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
          setLoading(false);
          return;
        }

        const baseUser: SupabaseUser = {
          id: data.user.id,
          email: data.user.email ?? "unknown@example.com",
        };

        const { data: profileData } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!profileData?.name) {
          const defaultName = data.user.email?.split("@")[0] ?? "User";
          baseUser.name = defaultName;
          await supabase.from("profiles").upsert({
            id: data.user.id,
            name: defaultName,
            email: data.user.email,
          });
        } else {
          baseUser.name = profileData.name;
        }

        setUser(baseUser);

        const { data: ordersData } = await supabase
          .from("orders")
          .select("id, order_date, total, items")
          .eq("user_id", data.user.id)
          .order("order_date", { ascending: false });

        if (ordersData) setOrders(ordersData as Order[]);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/signin";
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-lg text-gray-500">Loading...</p>
    );

  if (!user)
    return (
      <p className="text-center mt-10 text-lg text-gray-600">
        Please sign in to view your profile.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="destructive" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      {/* User Info */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            User Details
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 space-y-2">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            🛒 Your Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-gray-500 italic">No orders found yet.</p>
          ) : (
            <div className="space-y-8">
              {orders.map((order) => {
                const totalInPaise =
                  order.total ||
                  order.items.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  );

                return (
                  <div
                    key={order.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-wrap justify-between items-center mb-3">
                      <p className="text-gray-800 font-medium">
                        Order Date:{" "}
                        <span className="text-gray-600 font-normal">
                          {new Date(order.order_date).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </p>
                      <p className="text-lg font-bold text-green-700">
                        ₹{formatPaiseToRupees(totalInPaise)}
                      </p>
                    </div>

                    {order.items.length > 0 ? (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50"
                          >
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <div className="w-[60px] h-[60px] bg-gray-200 rounded-md" />
                            )}
                            <div className="flex flex-col">
                              <p className="font-semibold text-gray-800">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-medium text-green-700">
                                ₹
                                {formatPaiseToRupees(
                                  item.price * item.quantity
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No items found for this order.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        className="bg-red-600 text-white hover:bg-red-700"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </div>
  );
}
