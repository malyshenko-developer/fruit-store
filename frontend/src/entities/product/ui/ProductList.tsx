import Link from "next/link";
import type { ProductListItem } from "../model/types";
import {getDisplayAttributes} from "../model/attributes";

interface Props {
    products: ProductListItem[];
    categorySlug: string;
}

function getVariantLabel(product: ProductListItem, categorySlug: string): string {
    const attrs = getDisplayAttributes(categorySlug, product);
    const color = attrs.color;
    return color ? `${product.name}, ${color}` : product.name;
}

export function ProductList({ products, categorySlug }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <Link
                    key={product.variant_id}
                    href={`/products/${product.product_id}`}
                    className="border rounded p-4 block hover:shadow-md transition-shadow"
                >
                    <h3 className="font-semibold">{getVariantLabel(product, categorySlug)}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <p className="mt-2 font-bold">${product.price}</p>
                </Link>
            ))}
        </div>
    );
}