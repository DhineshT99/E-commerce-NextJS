"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Stripe from "stripe";

interface Props {
  products: (Stripe.Product & { default_price?: Stripe.Price })[];
}

export const Carousel = ({ products }: Props) => {
  const [current, setCurrent] = useState<number>(0);
  const [shuffledProducts, setShuffledProducts] = useState<
    (Stripe.Product & { default_price?: Stripe.Price })[]
  >([]);

  // Shuffle function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  useEffect(() => {
    if (products && products.length > 0) {
      setShuffledProducts(shuffleArray(products));
      setCurrent(0); // reset to first slide
    }
  }, [products]);

  // ⏱️ Auto-slide every 3 seconds
  useEffect(() => {
    if (shuffledProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % shuffledProducts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [shuffledProducts]);

  if (shuffledProducts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No products available.
      </div>
    );
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? shuffledProducts.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % shuffledProducts.length);
  };

  const product = shuffledProducts[current];
  const price = product.default_price as Stripe.Price | null;

  return (
    <div className="mx-auto w-full">
      {/* Heading */}
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-white-500 to-gray-400">
          Exclusive Deals – Up to 20% Off!
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden rounded-lg shadow-lg h-[26rem]">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full w-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {shuffledProducts.map((p) => (
            <div
              key={p.id}
              className="relative flex-shrink-0 w-full h-full flex items-center justify-center"
            >
              {p.images && p.images[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  Image not available
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition"
        >
          <ChevronRight size={22} />
        </button>

        {/* Product Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 text-center backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-white mb-1">
            {product.name}
          </h3>
          {price?.unit_amount && (
            <p className="text-lg text-white">
              Rs.{(price.unit_amount / 100).toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
