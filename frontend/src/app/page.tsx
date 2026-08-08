import { getCategories, CategoryList } from "@/entities/category";
import { Hero } from "./Hero";

export default async function Home() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
    </>
  );
}
