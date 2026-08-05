"use client";

import { useState } from "react";
import { trackOrder, OrderCard, type Order } from "@/entities/order";
import { TrackOrderForm, type TrackOrderFormValues } from "@/features/track-order";

export default function TrackOrderPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(values: TrackOrderFormValues) {
        setIsSubmitting(true);
        setError(null);
        setOrder(null);

        try {
            const result = await trackOrder(values.orderNumber, values.email);
            setOrder(result);
        } catch {
            setError("Заказ не найден. Проверьте номер заказа и email.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-8 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-2">Отследить заказ</h1>
            <p className="text-gray-500 mb-6">Введите номер заказа и email, указанный при оформлении.</p>

            <TrackOrderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            {order && (
                <div className="mt-6">
                    <OrderCard order={order} />
                </div>
            )}
        </div>
    );
}