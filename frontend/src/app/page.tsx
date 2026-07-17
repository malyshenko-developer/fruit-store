import { getCategories, CategoryList } from "@/entities/category";
import { getProducts, ProductList } from "@/entities/product";

export default async function Home() {
    const [categories, products] = await Promise.all([
        getCategories(),
        getProducts(),
    ]);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-4">Categories</h1>
                <CategoryList categories={categories} />
            </div>
            <div>
                <h1 className="text-2xl font-bold mb-4">Products</h1>
                <ProductList products={products} />
            </div>
        </div>
    );
}