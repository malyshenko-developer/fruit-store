import {AddToCartButton} from "@/features/add-to-cart";

import { getProductById, getDisplayAttributes } from "@/entities/product";
import { getCategories } from "@/entities/category";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        getProductById(Number(id)),
        getCategories(),
    ]);

    const category = categories.find((c) => c.id === product.category_id);
    const categorySlug = category?.slug ?? "";

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>

            <div className="mt-6 space-y-4">
                {product.variants.map((variant) => {
                    const attrs = getDisplayAttributes(categorySlug, variant);

                    return (
                        <div key={variant.id} className="border rounded p-4">
                            <p className="font-bold">${variant.price}</p>
                            <p className="text-sm text-gray-400">SKU: {variant.sku}</p>
                            <p className="text-sm text-gray-400">In stock: {variant.stock}</p>
                            {Object.entries(attrs).map(([key, value]) => (
                                <p key={key} className="text-sm">
                                    {key}: {value}
                                </p>
                            ))}
                            <div className="mt-2">
                                <AddToCartButton variantId={variant.id} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}