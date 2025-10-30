"use client";
import Stripe from "stripe";
import { ProductCard } from "./product-card";
import { useState } from "react";

interface Props {
  products: Stripe.Product[];
}

export const ProductList = ({ products }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredProduct = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(term);
    const descriptionMatch = product.description
      ? product.description.toLowerCase().includes(term)
      : false;

    return nameMatch || descriptionMatch;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10">
      {/* 🔍 Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 
                     text-sm sm:text-base focus:outline-none focus:ring-2 
                     focus:ring-blue-500 shadow-sm"
        />
      </div>

      {/* 🛒 Product Grid */}
      <ul
        className="
          mt-6 
          grid 
          grid-cols-1 
          gap-6 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          xl:grid-cols-5
        "
      >
        {filteredProduct.map((product, key) => (
          <li key={key} className="flex justify-center">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>

      {/* 🪄 No Results Message */}
      {filteredProduct.length === 0 && (
        <p className="text-center text-gray-500 mt-10 text-sm sm:text-base">
          No products found. Try a different search.
        </p>
      )}
    </div>
  );
};
