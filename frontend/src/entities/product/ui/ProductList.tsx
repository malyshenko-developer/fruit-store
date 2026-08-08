import Link from "next/link";
import { ReactNode } from "react";

import type { ProductListItem } from "../model/types";
import { getVariantLabel } from "../model/attributes";

interface Props {
  products: ProductListItem[];
  categorySlug: string;
  renderActions?: (product: ProductListItem) => ReactNode;
}

export function ProductList({ products, categorySlug, renderActions }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.variant_id} className="border rounded p-4 relative">
          <Link href={`/products/${product.product_id}`} className="block">
            <h3 className="font-semibold">{getVariantLabel(product, categorySlug)}</h3>
            <p className="text-sm text-gray-500">{product.description}</p>
            <p className="mt-2 font-bold">${product.price}</p>
          </Link>
          {renderActions && <div className="mt-2">{renderActions(product)}</div>}
        </div>
      ))}
    </div>
  );
}
