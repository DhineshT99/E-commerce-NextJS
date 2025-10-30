"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import logo from "../assets/logo.png";
import { User2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const { items } = useCart();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Fetch user from Supabase
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
      } else {
        setUserName(null);
      }
    }

    loadUser();

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

  const isSignedIn = Boolean(userName);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-md">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 py-3 sm:px-6 md:py-4">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 group">
          <Image
            src={logo}
            alt="NextCart Logo"
            width={120}
            height={40}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { href: "/home", label: "Home" },
            { href: "/products", label: "Products" },
            { href: "/checkout", label: "Checkout" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-medium text-gray-800 transition duration-300 hover:text-blue-600
                         after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-blue-600
                         hover:after:w-full after:transition-all after:duration-300"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* User */}
          {isSignedIn ? (
            <Link
              href="/profile"
              className="flex items-center space-x-2 hover:text-blue-600 transition-colors duration-300"
            >
              <User2Icon className="h-6 w-6" />
              <span className="hidden md:inline font-medium">{userName}</span>
            </Link>
          ) : (
            <Link
              href="/signin"
              className="font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300 text-sm sm:text-base"
            >
              Sign In
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/checkout"
            className="relative hover:scale-110 transition-transform duration-300"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-100 transition duration-300"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md transition-all duration-300">
          <ul className="flex flex-col p-4 space-y-3 text-center">
            {[
              { href: "/home", label: "Home" },
              { href: "/products", label: "Products" },
              { href: "/checkout", label: "Checkout" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {isSignedIn ? (
              <li>
                <Link
                  href="/profile"
                  className="block py-2 font-medium hover:text-blue-600"
                  onClick={() => setMobileOpen(false)}
                >
                  {userName}
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  href="/signin"
                  className="block py-2 font-medium hover:text-blue-600"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};
