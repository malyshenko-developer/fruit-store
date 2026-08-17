import { getProductById } from "@/entities/product";

import { ProductGallery } from "./ProductGallery";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ variant?: string }>;
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;

  const product = await getProductById(Number(id));

  const selectedVariant =
    product.variants.find((v) => v.id === Number(sp.variant)) ?? product.variants[0];

  return (
    <div className="pt-8 pb-24">
      <div className="max-w-[600px]">
        <ProductGallery images={selectedVariant.images ?? []} productName={product.name} />
      </div>
    </div>
  );
}
