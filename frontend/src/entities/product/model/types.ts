export interface ProductListItem {
  variant_id: number;
  product_id: number;
  category_id: number;
  category_slug: string;
  name: string;
  description: string;
  price: number;
  attributes: Record<string, unknown>;
  images: { url: string; sort_order: number }[];
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, unknown>;
  images: { url: string; sort_order: number }[];
}

export interface ProductDetail {
  id: number;
  category_id: number;
  name: string;
  description: string;
  image_url: string;
  variants: ProductVariant[];
}

export interface ProductFilters {
  attributes: Record<string, string[]>;
  colors: Record<string, string>;
  price_range: { min: number; max: number };
}

export interface PaginatedProducts {
  items: ProductListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
