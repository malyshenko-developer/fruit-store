export interface ProductListItem {
    variant_id: number;
    product_id: number;
    category_id: number;
    name: string;
    description: string;
    image_url: string;
    price: number;
    attributes: Record<string, unknown>;
}

export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    attributes: Record<string, unknown>;
    image_url: string | null;
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
    price_range: { min: number; max: number };
}