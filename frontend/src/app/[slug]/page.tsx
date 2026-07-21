import {notFound} from "next/navigation";

import {SortSelect} from "@/features/sort-products";
import {AttributeFilter, ColorFilter} from "@/features/filter-products";

import {getCategoryBySlug} from "@/entities/category";
import {getProductFilters, getProducts, ProductList} from "@/entities/product";

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort_by?: string; order?: string; color?: string | string[]; series?: string | string[]; storage?: string | string[]; }>
}

function toArray(value?: string | string[]): string[] | undefined {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
}

export default async function CategoryPage ({ params, searchParams }: Props) {
    const { slug } = await params
    const sp = await searchParams;

    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const [products, filters] = await Promise.all([
        getProducts({
            categoryId: category.id,
            sortBy: sp.sort_by,
            order: sp.order,
            attributes: {
                color: toArray(sp.color) ?? [],
                series: toArray(sp.series) ?? [],
                storage: toArray(sp.storage) ?? [],
            },
        }),
        getProductFilters(category.id)
    ])

    return (
        <div className="p-8 flex gap-8">
            <aside className="w-48 shrink-0 space-y-6">
                <ColorFilter paramName="color" label="Color" options={filters.attributes.color ?? []} />
                <AttributeFilter paramName="series" label="Series" options={filters.attributes.series ?? []} />
                <AttributeFilter paramName="storage" label="Storage" options={filters.attributes.storage ?? []} />
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