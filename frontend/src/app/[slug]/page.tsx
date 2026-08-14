import { notFound } from "next/navigation";

import { categoryFilterConfig, CategoryFilters } from "@/features/filter-products";
import { AddToCartButton } from "@/features/add-to-cart";

import { getCategoryBySlug } from "@/entities/category";
import { getProductFilters, getProducts, ProductCard } from "@/entities/product";

import { SortSelect } from "./SortSelect";
import { CatalogPagination } from "./CatalogPagination";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toArray(value?: string | string[]): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const fields = categoryFilterConfig[slug] ?? [];
  const attributes: Record<string, string[]> = {};
  for (const field of fields) {
    attributes[field.paramName] = toArray(sp[field.paramName]);
  }

  const [paginatedProducts, filters] = await Promise.all([
    getProducts({
      categoryId: category.id,
      sortBy: typeof sp.sort_by === "string" ? sp.sort_by : undefined,
      order: typeof sp.order === "string" ? sp.order : undefined,
      attributes,
      minPrice: typeof sp.min_price === "string" ? Number(sp.min_price) : undefined,
      maxPrice: typeof sp.max_price === "string" ? Number(sp.max_price) : undefined,
      minScreenSize:
        typeof sp.min_screen_size === "string" ? Number(sp.min_screen_size) : undefined,
      maxScreenSize:
        typeof sp.max_screen_size === "string" ? Number(sp.max_screen_size) : undefined,
      page: typeof sp.page === "string" ? Number(sp.page) : undefined,
      limit: typeof sp.limit === "string" ? Number(sp.limit) : undefined,
    }),
    getProductFilters(category.id),
  ]);
  return (
    <div className="pt-8 pb-[96px]">
      <div className="flex items-center justify-between mb-7 gap-[16px]">
        <h1 className="text-[34px] tracking-[-0.02em] font-bold">{category.name}</h1>
        <SortSelect />
      </div>
      <div className="flex gap-8">
        <aside className="w-[264px] shrink-0 sticky top-24 self-start">
          <CategoryFilters
            categorySlug={slug}
            availableAttributes={filters.attributes}
            priceRange={filters.price_range}
          />
        </aside>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-5">{paginatedProducts.total} товаров</p>
          <div className="flex flex-wrap gap-5">
            {paginatedProducts.items.map((product) => (
              <ProductCard
                key={product.variant_id}
                product={product}
                actions={<AddToCartButton variantId={product.variant_id} />}
              />
            ))}
          </div>
          <CatalogPagination
            currentPage={paginatedProducts.page}
            totalPages={paginatedProducts.total_pages}
            searchParams={sp}
          />
        </div>
      </div>
    </div>
  );
}
