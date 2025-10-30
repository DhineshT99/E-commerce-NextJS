import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";

export default async function ProductsPage() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  return (
    <div className="pb-12 pt-6 bg-neutral-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
        All Products
      </h1>
      <ProductList products={products.data} />
    </div>
  );
}

