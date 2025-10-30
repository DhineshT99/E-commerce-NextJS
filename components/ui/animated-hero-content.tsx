// components/animated-hero-content.tsx
"use client"; // This directive is crucial for client-side components

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Assuming Button is a client component or pure UI

interface AnimatedHeroContentProps {
  heroImageUrl: string | null;
}

export function AnimatedHeroContent({ heroImageUrl }: AnimatedHeroContentProps) {
  return (
    <>
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center text-center md:text-left space-y-5"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
        >
          Welcome to Next Cart!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-neutral-600 text-base sm:text-lg"
        >
          Discover the latest products at the best prices.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex justify-center md:justify-start"
        >
          <Button
            asChild
            className="rounded-full px-6 py-3 text-base font-medium bg-black text-white hover:bg-neutral-800 transition"
          >
            <Link href="/products">Browse All Products</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        className="flex justify-center md:justify-end"
      >
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
          {heroImageUrl ? (
            <Image
              alt="Hero Image"
              src={heroImageUrl}
              fill
              priority
              className="rounded-xl object-cover shadow-md"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Added sizes for better performance
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-xl text-gray-500">
              No Image Available
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}