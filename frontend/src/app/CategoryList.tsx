import Link from "next/link";
import Image from "next/image";

import type { Category } from "@/entities/category";

interface Props {
  categories: Category[];
}

export function CategoryList({ categories }: Props) {
  return (
    <ul className="pb-24 flex flex-wrap justify-center gap-6 xl:grid xl:grid-cols-5">
      {categories.map((category) => (
        <li key={category.id} className="flex-[0_1_260px] max-w-[320px] xl:max-w-none xl:flex-none">
          <Link
            href={`/${category.slug}`}
            className="block rounded-[28px] bg-surface border border-border overflow-hidden transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_12px_32px_-8px_var(--primary)]/30"
          >
            <div className="relative aspect-[4/3] bg-stripe1 flex items-center justify-center overflow-hidden">
              {category.image_url && (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  sizes="320px"
                  className="object-contain"
                />
              )}
            </div>
            <div className="pt-6 px-6 pb-7">
              <h3 className="text-2xl font-bold mb-1.5 tracking-[-0.01em]">{category.name}</h3>
              <p className="text-base mb-3 text-muted-foreground">
                от ${category.min_price.toLocaleString("en-US")}
              </p>
              <span className="text-base font-semibold text-primary">Смотреть →</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
