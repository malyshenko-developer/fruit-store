export interface Product {
    id: number;
    category_id: number;
    name: string;
    price: number;
    description: string;
    image_url: string;
    stock: number;
    attributes: Record<string, unknown>;
}