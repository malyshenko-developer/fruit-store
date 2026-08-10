import { AddToCartButton } from "@/features/add-to-cart";

import { getCategories } from "@/entities/category";
import { getProducts, ProductCard } from "@/entities/product";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselFade,
} from "@/shared/ui/carousel";

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
        <Carousel opts={{ align: "start", containScroll: "trimSnaps", slidesToScroll: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[28px] font-bold tracking-[-0.01em]">Новинки</h2>
            <div className="flex gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </div>

          <div className="relative">
            <CarouselContent>
              {newArrivals.items.map((product) => (
                <CarouselItem key={product.variant_id} className="basis-auto shrink-0">
                  <ProductCard
                    product={product}
                    showCategory
                    actions={<AddToCartButton variantId={product.variant_id} />}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselFade />
          </div>

          <div className="flex justify-center mt-6">
            <CarouselDots />
          </div>
        </Carousel>
      </section>
    </>
  );
}
