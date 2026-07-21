import {notFound} from "next/navigation";

import {SortSelect} from "@/features/sort-products";
import {categoryFilterConfig, CategoryFilters} from "@/features/filter-products";

import {getCategoryBySlug} from "@/entities/category";
import {getProductFilters, getProducts, ProductList} from "@/entities/product";

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function toArray(value?: string | string[]): string[] {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
}

export default async function CategoryPage ({ params, searchParams }: Props) {
    const { slug } = await params
    const sp = await searchParams;

    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const fields = categoryFilterConfig[slug] ?? [];
    const attributes: Record<string, string[]> = {};
    for (const field of fields) {
        attributes[field.paramName] = toArray(sp[field.paramName]);
    }

    const [products, filters] = await Promise.all([
        getProducts({
            categoryId: category.id,
            sortBy: typeof sp.sort_by === "string" ? sp.sort_by : undefined,
            order: typeof sp.order === "string" ? sp.order : undefined,
            attributes,
            minPrice: typeof sp.min_price === "string" ? Number(sp.min_price) : undefined,
            maxPrice: typeof sp.max_price === "string" ? Number(sp.max_price) : undefined,
            minScreenSize: typeof sp.min_screen_size === "string" ? Number(sp.min_screen_size) : undefined,
            maxScreenSize: typeof sp.max_screen_size === "string" ? Number(sp.max_screen_size) : undefined,
        }),
        getProductFilters(category.id),
    ]);

    return (
        <div className="p-8 flex gap-8">
            <aside className="w-48 shrink-0">
                <CategoryFilters categorySlug={slug} availableAttributes={filters.attributes} />
            </aside>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">{category.name}</h1>
                    <SortSelect />
                </div>
                <ProductList products={products} />
            </div>
        </div>
    )
}