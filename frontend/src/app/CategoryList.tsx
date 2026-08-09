import Link from "next/link";
import Image from "next/image";

import type { Category } from "@/entities/category";

import { Card, CardContent } from "@/shared/ui/card";

interface Props {
  categories: Category[];
}

export function CategoryList({ categories }: Props) {
  return (
    <ul className="pb-24 flex flex-wrap justify-center gap-6 xl:grid xl:grid-cols-5">
      {categories.map((category) => (
        <li key={category.id} className="flex-[0_1_260px] max-w-[320px] xl:max-w-none xl:flex-none">
          <Link href={`/${category.slug}`} className="block group">
            <Card className="rounded-[28px] py-0 gap-0 transition-[transform,box-shadow] group-hover:-translate-y-1 group-hover:shadow-[0_12px_32px_-8px_var(--primary)]/30">
              <div className="relative aspect-[4/3] bg-stripe1 flex items-center justify-center overflow-hidden rounded-t-[28px]">
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
              <CardContent className="pt-6 pb-7 gap-0">
                <h3 className="text-2xl font-bold mb-1.5 tracking-[-0.01em]">{category.name}</h3>
                <p className="text-base mb-3 text-muted-foreground">
                  от ${category.min_price.toLocaleString("en-US")}
                </p>
                <span className="text-base font-semibold text-primary">Смотреть →</span>
              </CardContent>
            </Card>
          </Link>
        </li>
      ))}
    </ul>
  );
}
