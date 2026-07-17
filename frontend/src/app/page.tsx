import { getCategories, CategoryList } from "@/entities/category";
import { getProducts, ProductList } from "@/entities/product";

interface Props {
    searchParams: Promise<{ category_id?: string }>;
}

export default async function Home({ searchParams }: Props) {
    const { category_id } = await searchParams;
    const categoryId = category_id ? Number(category_id) : undefined;

    const [categories, products] = await Promise.all([
        getCategories(),
        getProducts(categoryId),
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