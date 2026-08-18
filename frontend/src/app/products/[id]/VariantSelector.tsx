import Link from "next/link";

import {
  getAvailableValues,
  findVariantByAttributes,
  variantSelectorConfig,
} from "@/entities/product";
import type { ProductVariant } from "@/entities/product";

interface Props {
  productId: number;
  categorySlug: string;
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
}

export function VariantSelector({ productId, categorySlug, variants, selectedVariant }: Props) {
  const selectorFields = variantSelectorConfig[categorySlug] ?? [];

  function getTargetVariant(field: string, value: string) {
    const currentSelection: Record<string, string> = {};
    for (const f of selectorFields) {
      const current = selectedVariant.attributes[f.key];
      if (typeof current === "string") {
        currentSelection[f.key] = current;
      }
    }
    currentSelection[field] = value;

    return findVariantByAttributes(variants, currentSelection);
  }

  return (
    <>
      {selectorFields.map((field) => {
        const values = getAvailableValues(variants, field.key);

        return (
          <div key={field.key} className="mb-[26px]">
            <h4 className="text-sm font-bold uppercase tracking-[0.04em] text-muted-foreground mb-3">
              {field.label}
            </h4>
            <div className="flex flex-wrap gap-3">
              {field.type === "color"
                ? values.map((value) => {
                    const variantForColor = variants.find((v) => v.attributes[field.key] === value);
                    const hex = variantForColor?.attributes.color_hex as string | undefined;
                    const isSelected = selectedVariant.attributes[field.key] === value;
                    const target = getTargetVariant(field.key, value);

                    return (
                      <Link
                        key={value}
                        href={target ? `/products/${productId}?variant=${target.id}` : "#"}
                        title={value}
                        className={`relative w-9 h-9 rounded-full flex items-center justify-center ring-2 ${
                          isSelected ? "ring-primary" : "ring-transparent"
                        }`}
                      >
                        <span
                          className="relative w-7 h-7 rounded-full box-border border border-border"
                          style={{ backgroundColor: hex ?? "#9ca3af" }}
                        />
                      </Link>
                    );
                  })
                : values.map((value) => {
                    const isSelected = selectedVariant.attributes[field.key] === value;
                    const target = getTargetVariant(field.key, value);

                    return (
                      <Link
                        key={value}
                        href={target ? `/products/${productId}?variant=${target.id}` : "#"}
                        className={`px-4 py-2 rounded-full border text-sm font-semibold ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-surface border-border text-foreground"
                        }`}
                      >
                        {value}
                      </Link>
                    );
                  })}
            </div>
          </div>
        );
      })}
    </>
  );
}
