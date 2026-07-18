import { getCategories, CategoryList } from "@/entities/category";

export default async function Home() {
    const categories = await getCategories();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Shop by Category</h1>
            <CategoryList categories={categories} />
        </div>
    );
}