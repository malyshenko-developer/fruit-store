import { apiFetch } from "@/shared/api/client";

import type { Order } from "../model/types";

export async function getMyOrders(): Promise<Order[]> {
    return apiFetch<Order[]>("/orders/my");
}