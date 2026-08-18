import { AddToCartButton } from "@/features/add-to-cart";

import { getAvailableValues, getProductById, variantSelectorConfig } from "@/entities/product";
import { getCategories } from "@/entities/category";

import { ProductGallery } from "./ProductGallery";
import { VariantSelector } from "./VariantSelector";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  const [product, categories] = await Promise.all([getProductById(Number(id)), getCategories()]);

  const category = categories.find((c) => c.id === product.category_id);
  const categorySlug = category?.slug ?? "";

  const selectedVariant =
    product.variants.find((v) => v.id === Number(sp.variant)) ?? product.variants[0];

  return (
    <div className="pt-8 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-14 items-start">
        <ProductGallery images={selectedVariant.images ?? []} productName={product.name} />

        <div>
          <h1 className="text-[36px] font-bold tracking-[-0.02em] mb-2.5">{product.name}</h1>
          <p className="text-2xl font-semibold mb-5">
            ${selectedVariant.price.toLocaleString("en-US")}
          </p>

          <VariantSelector
            productId={product.id}
            categorySlug={categorySlug}
            variants={product.variants}
            selectedVariant={selectedVariant}
          />

          <div className="mt-6">
            {selectedVariant.stock === 0 && (
              <p className="text-sm text-muted-foreground mb-2.5">
                Этой комбинации сейчас нет в наличии — выберите другой вариант.
              </p>
            )}
            <AddToCartButton
              variantId={selectedVariant.id}
              price={selectedVariant.price}
              inStock={selectedVariant.stock > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
