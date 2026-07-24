export interface CartItem {
    variant_id: number;
    product_id: number;
    name: string;
    image_url: string;
    price: number;
    quantity: number;
    stock: number;
    attributes: Record<string, unknown>;
    subtotal: number;
}

export interface CartSummary {
    items: CartItem[];
    total: number;
}