import type { Product } from "../model/types";

interface Props {
    products: Product[];
}

export function ProductList({ products }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <div key={product.id} className="border rounded p-4">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    {product.color && (
                        <p className="text-sm text-gray-400">Color: {product.color}</p>
                    )}
                    <p className="mt-2 font-bold">${product.price}</p>
                </div>
            ))}
        </div>
    );
}