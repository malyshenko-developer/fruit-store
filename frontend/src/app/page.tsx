import { getCategories } from "@/entities/category";

import { Hero } from "./Hero";
import { CategoryList } from "./CategoryList";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <CategoryList categories={categories} />
    </>
  );
}
