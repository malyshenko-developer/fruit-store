import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t p-8 mt-auto">
            <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-500">
                <p>© 2026 Fruit Store. Независимый магазин техники Apple.</p>
                <Link href="/track-order" className="hover:underline">
                    Отследить заказ по номеру
                </Link>
            </div>
        </footer>
    );
}