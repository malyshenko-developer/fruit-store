"use client";

import {OrderCard, useMyOrders} from "@/entities/order";

export default function OrdersPage() {
    const { data: orders, isLoading, isError } = useMyOrders();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Failed to load orders.</div>;
    }

    if (!orders || orders.length === 0) {
        return <div className="text-gray-500">У вас пока нет заказов.</div>;
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderCard key={order.order_number} order={order} />
            ))}
        </div>
    );
}