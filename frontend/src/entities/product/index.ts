export { getProducts, getProductById, getProductFilters, searchProducts } from "./api/getProducts";
export {
  getVariantLabel,
  getFullAttributes,
  getAvailableValues,
  findVariantByAttributes,
} from "./model/attributes";
export { categoryAttributesConfig } from "./model/categoryAttributes";
export { variantSelectorConfig } from "./model/variantSelectorConfig";
export { useSearchProducts } from "./model/useSearchProducts";
export { ProductCard } from "./ui/ProductCard";
export type { ProductVariant } from "./model/types";
