import { apiFetch } from "@/shared/api/client";

import type { Category } from "../model/types";

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/categories");
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    return await apiFetch<Category>(`/categories/${slug}`);
  } catch {
    return null;
  }
}
