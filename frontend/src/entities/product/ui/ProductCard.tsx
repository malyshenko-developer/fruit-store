import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

import { Card, CardContent, CardFooter } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

import type { ProductListItem } from "../model/types";
import { getVariantLabel } from "../model/attributes";

interface Props {
  product: ProductListItem;
  showCategory?: boolean;
  actions?: ReactNode;
  className?: string;
}

export function ProductCard({ product, showCategory = false, actions, className }: Props) {
  const mainImage = product.images?.[0]?.url;

  return (
    <Card
      className={cn(
        "rounded-3xl bg-surface border border-border overflow-hidden py-0 gap-0 transition-transform hover:-translate-y-1",
        className,
      )}
    >
      <Link
        href={`/products/${product.product_id}?variant=${product.variant_id}`}
        className="block"
      >
        <div className="relative aspect-[1] bg-stripe1">
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              sizes="320px"
              className="object-contain p-2.5"
            />
          )}
        </div>
        <CardContent className="pt-4 pb-3 gap-0 px-4">
          {showCategory && (
            <p className="text-xs mb-1.5 uppercase tracking-[0.04em] text-muted-foreground">
              {product.category_slug}
            </p>
          )}
          <p className="text-sm font-semibold mb-1 truncate">
            {getVariantLabel(product, product.category_slug)}
          </p>
          <p className="text-base font-bold">${product.price.toLocaleString("en-US")}</p>
        </CardContent>
      </Link>
      <CardFooter className="pb-4 px-4">{actions}</CardFooter>
    </Card>
  );
}
