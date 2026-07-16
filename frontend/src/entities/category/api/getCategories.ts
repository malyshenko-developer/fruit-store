import { apiFetch } from "@/shared/api/client";

import type { Category } from "../model/types";

export async function getCategories(): Promise<Category[]> {
    return apiFetch<Category[]>("/categories");
}