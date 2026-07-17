import type { Category } from "../model/types";
import Link from "next/link";

interface Props {
    categories: Category[];
}

export function CategoryList({ categories }: Props) {
    return (
        <ul className="flex gap-3">
            {categories.map((category) => (
                <li key={category.id} className="border p-3 rounded hover:bg-blue-500">
                    <Link href={`/?category_id=${category.id}`} className="px-3 py-1 rounded">
                        {category.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}