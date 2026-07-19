import {notFound} from "next/navigation";

import {SortSelect} from "@/features/sort-products";

import {getCategoryBySlug} from "@/entities/category";
import {getProducts, ProductList} from "@/entities/product";

interface Props {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ sort_by?: string; order?: string }>
}

export default async function CategoryPage ({ params, searchParams }: Props) {
    const { slug } = await params
    const { sort_by, order } = await searchParams;

    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const products = await getProducts({
        categoryId: category.id,
        sortBy: sort_by,
        order: order,
    })

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{category.name}</h1>
                <SortSelect />
            </div>
            <ProductList products={products} />
        </div>
    )
}