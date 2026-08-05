import { apiFetch } from "@/shared/api/client";

import type { Order } from "../model/types";

export async function getMyOrders(): Promise<Order[]> {
    return apiFetch<Order[]>("/orders/my");
}

export async function trackOrder(orderNumber: string, email: string): Promise<Order> {
    const query = new URLSearchParams({ order_number: orderNumber, email });
    return apiFetch<Order>(`/orders/track?${query.toString()}`);
}