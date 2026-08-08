import { categoryAttributesConfig } from "./categoryAttributes";

interface HasAttributes {
  attributes: Record<string, unknown>;
}

function getString(attrs: Record<string, unknown>, key: string): string | null {
  const value = attrs[key];
  return typeof value === "string" ? value : null;
}

export function getVariantLabel(
  product: HasAttributes & { name: string },
  categorySlug: string,
): string {
  const fields = categoryAttributesConfig[categorySlug] ?? [];

  const parts = fields
    .filter((field) => field.inLabel)
    .map((field) => getString(product.attributes, field.key))
    .filter((value): value is string => value !== null);

  return parts.length > 0 ? `${product.name}, ${parts.join(", ")}` : product.name;
}

export function getFullAttributes(
  product: HasAttributes,
  categorySlug: string,
): Record<string, string> {
  const fields = categoryAttributesConfig[categorySlug] ?? [];
  const result: Record<string, string> = {};

  for (const field of fields) {
    const value = getString(product.attributes, field.key);
    if (value !== null) {
      result[field.label] = value;
    }
  }

  return result;
}
