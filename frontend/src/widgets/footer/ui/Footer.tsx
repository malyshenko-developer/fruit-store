import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-7 px-6 flex flex-col items-center gap-2.5 mt-auto border-border">
      <p className="text-sm text-muted-foreground">
        © 2026 Fruit Store. Независимый магазин техники Apple.
      </p>
      <Link href="/track-order" className="text-sm text-primary">
        Отследить заказ по номеру
      </Link>
    </footer>
  );
}
