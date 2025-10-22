import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";

export default async function ProductsPage() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  return (
    <div className="pb-8">
      <h1 className="text-3xl font-bold text-foreground text-center mb-8 leading-none tracking-tight">
        All Products
      </h1>
      <ProductList products={products.data} />
    </div>
  );
}
