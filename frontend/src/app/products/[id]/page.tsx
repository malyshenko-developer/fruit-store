import Link from "next/link";
import { AddToCartButton } from "@/features/add-to-cart";

import { getProductById, getFullAttributes } from "@/entities/product";
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

  const attrs = getFullAttributes(selectedVariant, categorySlug);
  const attrEntries = Object.entries(attrs);

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

          <div className="mt-2.5 mb-4">
            {selectedVariant.stock === 0 && (
              <p className="text-sm text-muted-foreground mb-2.5">
                Этой комбинации сейчас нет в наличии — выберите другой вариант.
              </p>
            )}
            <AddToCartButton
              variantId={selectedVariant.id}
              price={selectedVariant.price}
              inStock={selectedVariant.stock > 0}
              className="py-[16px] text-base"
            />
          </div>

          {category && (
            <Link
              href={`/${category.slug}`}
              className="block w-full text-center rounded-full border-[1.5px] border-border bg-transparent text-foreground py-3 text-base font-semibold hover:bg-surface-hover transition-colors"
            >
              Все {category.name} →
            </Link>
          )}
        </div>
      </div>

      {attrEntries.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold tracking-[-0.02em] mb-6">Характеристики</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16">
            {attrEntries.map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center py-4 border-b border-border"
              >
                <span className="text-sm font-semibold text-muted-foreground">{key}</span>
                <span className="text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
