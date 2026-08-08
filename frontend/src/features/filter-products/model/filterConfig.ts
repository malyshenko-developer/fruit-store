import { categoryAttributesConfig } from "@/entities/product";

export const categoryFilterConfig = Object.fromEntries(
  Object.entries(categoryAttributesConfig).map(([slug, fields]) => [
    slug,
    fields.map((f) => ({ paramName: f.key, label: f.label, type: f.type })),
  ]),
);
