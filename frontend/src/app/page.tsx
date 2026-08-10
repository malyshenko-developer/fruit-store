import { AddToCartButton } from "@/features/add-to-cart";

import { getCategories } from "@/entities/category";
import { getProducts, ProductCard } from "@/entities/product";

import { Hero } from "./Hero";
import { CategoryList } from "./CategoryList";

export default async function Home() {
  const [categories, newArrivals] = await Promise.all([
    getCategories(),
    getProducts({ sortBy: "created_at", order: "desc", limit: 8 }),
  ]);

  return (
    <>
      <Hero />
      <CategoryList categories={categories} />

      <section className="pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[28px] font-bold tracking-[-0.01em]">Новинки</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.items.map((product) => (
            <ProductCard
              key={product.variant_id}
              product={product}
              showCategory
              actions={<AddToCartButton variantId={product.variant_id} />}
            />
          ))}
        </div>
      </section>
    </>
  );
}
