import Link from "next/link";

import type { Category } from "../model/types";

interface Props {
    categories: Category[];
}

export function CategoryList({ categories }: Props) {
    return (
        <ul className="flex gap-3">
            {categories.map((category) => (
                <li key={category.id}>
                    <Link
                        href={`/${category.slug}`}
                        className="border px-3 py-1 rounded hover:bg-gray-800"
                    >
                        {category.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
}