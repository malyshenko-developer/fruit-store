import { notFound } from "next/navigation";

import { SortSelect } from "@/features/sort-products";
import { categoryFilterConfig, CategoryFilters } from "@/features/filter-products";
import { Pagination } from "@/features/paginate-products";

import { getCategoryBySlug } from "@/entities/category";
import { getProductFilters, getProducts } from "@/entities/product";

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
      {/*<aside className="w-48 shrink-0">*/}
      {/*  <CategoryFilters categorySlug={slug} availableAttributes={filters.attributes} />*/}
      {/*</aside>*/}
      <div className="flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.items.map((product) => (
            <div key={product.variant_id}>{product.name}</div>
          ))}
        </div>
        <Pagination
          currentPage={paginatedProducts.page}
          totalPages={paginatedProducts.total_pages}
          searchParams={sp}
        />
      </div>
    </div>
  );
}
