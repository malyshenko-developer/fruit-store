import { getProductById } from "@/entities/product";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProductById(Number(id));

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>

            <div className="mt-6 space-y-4">
                {product.variants.map((variant) => (
                    <div key={variant.id} className="border rounded p-4">
                        <p className="font-bold">${variant.price}</p>
                        <p className="text-sm text-gray-400">SKU: {variant.sku}</p>
                        <p className="text-sm text-gray-400">In stock: {variant.stock}</p>
                        {typeof variant.attributes.color === "string" && (
                            <p className="text-sm">Color: {variant.attributes.color}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}