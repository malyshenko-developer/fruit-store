import { apiFetch } from "@/shared/api/client";

import type {ProductDetail, ProductFilters, PaginatedProducts} from "../model/types";

interface GetProductsParams {
    categoryId?: number;
    sortBy?: string;
    order?: string;
    attributes?: Record<string, string[]>;
    minPrice?: number;
    maxPrice?: number;
    minScreenSize?: number;
    maxScreenSize?: number;
    page?: number;
    limit?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<PaginatedProducts> {
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
    if (params.minPrice !== undefined) query.set("min_price", String(params.minPrice));
    if (params.maxPrice !== undefined) query.set("max_price", String(params.maxPrice));
    if (params.minScreenSize !== undefined) query.set("min_screen_size", String(params.minScreenSize));
    if (params.maxScreenSize !== undefined) query.set("max_screen_size", String(params.maxScreenSize));
    if (params.page !== undefined) query.set("page", String(params.page));
    if (params.limit !== undefined) query.set("limit", String(params.limit));

    const queryString = query.toString();
    return apiFetch<PaginatedProducts>(`/products${queryString ? `?${queryString}` : ""}`);
}

export async function getProductById(id: number): Promise<ProductDetail> {
    return apiFetch<ProductDetail>(`/products/${id}`);
}

export async function getProductFilters(categoryId?: number): Promise<ProductFilters> {
    const query =  categoryId ? `?category_id=${categoryId}` : "";
    return apiFetch<ProductFilters>(`/products/filters${query}`);
}

export async function searchProducts(query: string): Promise<PaginatedProducts> {
    const params = new URLSearchParams({ q: query });
    return apiFetch<PaginatedProducts>(`/products/search?${params.toString()}`);
}