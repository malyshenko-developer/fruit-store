import { apiFetch } from "@/shared/api/client";

import type { ProductListItem, ProductDetail } from "../model/types";

interface GetProductsParams {
    categoryId?: number;
    sortBy?: string;
    order?: string;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListItem[]> {
    const query = new URLSearchParams();

    if (params.categoryId) query.set("category_id", String(params.categoryId));
    if (params.sortBy) query.set("sort_by", params.sortBy);
    if (params.order) query.set("order", params.order);

    const queryString = query.toString();

    return apiFetch<ProductListItem[]>(`/products${queryString ? `?${queryString}` : ""}`);
}

export async function getProductById(id: number): Promise<ProductDetail> {
    return apiFetch<ProductDetail>(`/products/${id}`);
}