import {getIphoneAttributes, getProductById} from "@/entities/product";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await getProductById(Number(id));
    const { color, storage, connectivity } = getIphoneAttributes(product);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-gray-500 mt-2">{product.description}</p>
            <p className="text-xl font-bold mt-4">${product.price}</p>
            <p className="text-sm text-gray-400 mt-1">In stock: {product.stock}</p>

            {color && <p className="mt-2">Color: {color}</p>}
            {storage && <p>Storage: {storage}</p>}
            {connectivity && <p>Connectivity: {connectivity}</p>}
        </div>
    );
}