"use client";

import Link from "next/link";
import Stripe from "stripe";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

interface Props {
  product: Stripe.Product;
}

export const ProductCard = ({ product }: Props) => {
  const price = product.default_price as Stripe.Price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Link href={`/products/${product.id}`} className="block h-full">
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="h-full"
        >
          <Card className="group hover:shadow-2xl transition duration-300 py-0 h-full flex flex-col border-gray-300 gap-0 overflow-hidden">
            {product.images && product.images[0] && (
              <motion.div
                className="relative h-60 w-full overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain group-hover:opacity-90 transition-opacity duration-300 rounded-t-lg"
                />
              </motion.div>
            )}
            <CardHeader className="p-4">
              <CardTitle className="text-lg md:text-xl font-bold text-gray-800 text-center">
                {product.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-grow flex flex-col justify-between items-center text-center">
              {product.description && (
                <motion.p
                  className="text-gray-600 text-sm mb-2 line-clamp-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {product.description}
                </motion.p>
              )}
              {price && price.unit_amount && (
                <motion.p
                  className="text-lg font-semibold text-gray-900"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  ₹{(price.unit_amount / 100).toFixed(2)}
                </motion.p>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full"
              >
                <Button className="mt-4 bg-black text-white w-full sm:w-auto">
                  View Details
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
};
