import type { Category } from "../model/types";

interface Props {
    categories: Category[];
}

export function CategoryList({ categories }: Props) {
    return (
        <ul className="space-y-2">
            {categories.map((category) => (
                <li key={category.id} className="border p-3 rounded">
                    {category.name} ({category.slug})
                </li>
            ))}
        </ul>
    );
}