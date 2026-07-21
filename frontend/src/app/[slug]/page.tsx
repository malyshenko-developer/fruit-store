import {notFound} from "next/navigation";

import {SortSelect} from "@/features/sort-products";
import {ColorFilter} from "@/features/filter-products";

import {getCategoryBySlug} from "@/entities/category";
import {getProductFilters, getProducts, ProductList} from "@/entities/product";

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort_by?: string; order?: string; color?: string | string[] }>
}

export default async function CategoryPage ({ params, searchParams }: Props) {
    const { slug } = await params
    const { sort_by, order, color } = await searchParams;

    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const colors = color ? (Array.isArray(color) ? color : [color]) : undefined

    const [products, filters] = await Promise.all([
        getProducts({
            categoryId: category.id,
            sortBy: sort_by,
            order: order,
            colors: colors,
        }),
        getProductFilters(category.id)
    ])

    return (
        <div className="p-8 flex gap-8">
            <aside className="w-48 shrink-0">
                <ColorFilter colors={filters.attributes.color ?? []} />
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