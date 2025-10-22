"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCartIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { User2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Fetch the active Supabase session and profile info
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { id } = data.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", id)
          .single();
        if (profile?.name) setUserName(profile.name);
        else setUserName(null);
      } else {
        setUserName(null);
      }
    }

    // initial check
    loadUser();

    // realtime auth listener: auto update on sign in/out
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("name")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setUserName(data?.name ?? null));
      } else {
        setUserName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Conditional Rendering
  const isSignedIn = Boolean(userName);
console.log(userName);
  return (
    <nav className="sticky top-0 z-50 bg-white shadow">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/home" className="hover:text-blue-600 font-bold text-lg">
          My Ecommerce
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/home" className="hover:text-blue-600">Home</Link>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <Link href="/checkout" className="hover:text-blue-600">Checkout</Link>
        </div>

        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <Link href="/profile" className="flex items-center space-x-2 hover:text-blue-600">
              <User2Icon className="h-6 w-6" />
              <span className="hidden md:inline">{userName}</span>
            </Link>
          ) : (
            <Link href="/signin" className="hover:text-blue-600">Sign In</Link>
          )}

          <Link href="/checkout" className="relative">
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            className="md:hidden"
            onClick={() => setMobileOpen(prev => !prev)}
          >
            {mobileOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            <li><Link href="/home" className="block hover:text-blue-600">Home</Link></li>
            <li><Link href="/products" className="block hover:text-blue-600">Products</Link></li>
            <li><Link href="/checkout" className="block hover:text-blue-600">Checkout</Link></li>
            {isSignedIn ? (
              <li><Link href="/profile" className="block hover:text-blue-600">{userName}</Link></li>
            ) : (
              <li><Link href="/signin" className="block hover:text-blue-600">Sign In</Link></li>
            )}
          </ul>
        </nav>
      )}
    </nav>
  );
};
