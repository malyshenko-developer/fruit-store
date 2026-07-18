import {notFound} from "next/navigation";

import {getCategoryBySlug} from "@/entities/category";
import {getProducts, ProductList} from "@/entities/product";

interface Props {
    params: Promise<{ slug: string }>
}

export default async function CategoryPage ({ params }: Props) {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)

    if (!category) {
        notFound()
    }

    const products = await getProducts(category.id)

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">{category.name}</h1>
            <ProductList products={products} />
        </div>
    )
}