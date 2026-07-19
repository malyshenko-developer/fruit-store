import type { ProductListItem  } from "../model/types";
import {getIphoneAttributes} from "../model/attributes";

interface Props {
    products: ProductListItem[];
}

function getVariantLabel(product: ProductListItem): string {
    const { color } = getIphoneAttributes(product);
    return color ? `${product.name}, ${color}` : product.name;
}

export function ProductList({ products }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <div key={product.variant_id} className="border rounded p-4">
                    <h3 className="font-semibold">{getVariantLabel(product)}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                    <p className="mt-2 font-bold">${product.price}</p>
                </div>
            ))}
        </div>
    );
}