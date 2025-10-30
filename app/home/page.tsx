import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { AnimatedHeroContent } from "@/components/ui/animated-hero-content";
import { AnimatedCarouselSection } from "@/components/ui/animated-hero-carousel";

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
  });

  const filteredProducts = products.data.filter(
    (product): product is Stripe.Product & { default_price: Stripe.Price } =>
      typeof product.default_price === "object" && product.default_price !== null
  );

  const heroImageUrl =
    products.data.length > 0 && products.data[0].images.length > 0
      ? products.data[0].images[0]
      : null;

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="w-full bg-neutral-100 py-10 sm:py-14 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:px-10 md:grid-cols-2 md:gap-16 lg:gap-20">
          <AnimatedHeroContent heroImageUrl={heroImageUrl} />
        </div>
      </section>

      {/* Animated Carousel Section (client) */}
      <AnimatedCarouselSection products={filteredProducts} />
    </div>
  );
}
