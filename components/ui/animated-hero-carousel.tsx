"use client";

import { motion } from "framer-motion";
import { Carousel } from "@/components/carousel";
import Stripe from "stripe";

interface AnimatedCarouselSectionProps {
  products: (Stripe.Product & { default_price: Stripe.Price })[];
}

export function AnimatedCarouselSection({ products }: AnimatedCarouselSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="py-10 sm:py-14 md:py-20 px-4 sm:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <Carousel products={products} />
      </div>
    </motion.section>
  );
}
