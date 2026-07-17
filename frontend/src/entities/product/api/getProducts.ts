import { apiFetch } from "@/shared/api/client";

import type { ProductListItem, ProductDetail } from "../model/types";

export async function getProducts(categoryId?: number): Promise<ProductListItem[]> {
    const query = categoryId ? `?category_id=${categoryId}` : "";
    return apiFetch<ProductListItem[]>(`/products${query}`);
}

export async function getProductById(id: number): Promise<ProductDetail> {
    return apiFetch<ProductDetail>(`/products/${id}`);
}