import { apiFetch } from "@/shared/api/client";

import type {ProductListItem, ProductDetail, ProductFilters} from "../model/types";

interface GetProductsParams {
    categoryId?: number;
    sortBy?: string;
    order?: string;
    attributes?: Record<string, string[]>;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListItem[]> {
    const query = new URLSearchParams();

    if (params.categoryId) query.set("category_id", String(params.categoryId));
    if (params.sortBy) query.set("sort_by", params.sortBy);
    if (params.order) query.set("order", params.order);
    if (params.attributes) {
        for (const [key, values] of Object.entries(params.attributes)) {
            for (const value of values) {
                query.append(key, value);
            }
        }
    }

    const queryString = query.toString();
    return apiFetch<ProductListItem[]>(`/products${queryString ? `?${queryString}` : ""}`);
}

export async function getProductById(id: number): Promise<ProductDetail> {
    return apiFetch<ProductDetail>(`/products/${id}`);
}

export async function getProductFilters(categoryId?: number): Promise<ProductFilters> {
    const query =  categoryId ? `?category_id=${categoryId}` : "";
    return apiFetch<ProductFilters>(`/products/filters${query}`);
}