import { apiFetch } from "@/shared/api/client";

import type { Product } from "../model/types";

export async function getProducts(categoryId?: number): Promise<Product[]> {
    const query = categoryId ? `?category_id=${categoryId}` : "";
    return apiFetch<Product[]>(`/products${query}`);
}