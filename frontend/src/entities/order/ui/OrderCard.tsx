import type { Order } from "../model/types";

const statusLabels: Record<string, string> = {
    pending: "Ожидает оплаты",
    paid: "Оплачен",
    shipped: "В пути",
    delivered: "Доставлен",
    cancelled: "Отменён",
    refunded: "Возврат",
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

interface Props {
    order: Order;
}

export function OrderCard({ order }: Props) {
    const productNames = order.items.map((item) => item.product_name).join(", ");

    return (
        <div className="border rounded p-4">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-semibold">Заказ {order.order_number}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <span className="text-sm px-2 py-1 rounded bg-gray-100">
					{statusLabels[order.status] ?? order.status}
				</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{productNames}</p>
            <p className="font-bold">{order.total.toLocaleString("ru-RU")} ₽</p>
        </div>
    );
}