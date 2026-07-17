export interface ProductListItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    image_url: string;
    min_price: number;
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