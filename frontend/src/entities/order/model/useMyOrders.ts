"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyOrders } from "../api/orderApi";

export function useMyOrders() {
    return useQuery({
        queryKey: ["myOrders"],
        queryFn: getMyOrders,
    });
}