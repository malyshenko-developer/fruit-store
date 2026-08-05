export interface OrderItem {
    product_name: string;
    attributes: Record<string, unknown>;
    price: number;
    quantity: number;
}

export interface Order {
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    items: OrderItem[];
}