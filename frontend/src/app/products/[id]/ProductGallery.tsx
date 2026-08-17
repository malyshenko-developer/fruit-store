"use client";

import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselThumbnails,
} from "@/shared/ui/carousel";

interface Props {
  images: { url: string; sort_order: number }[];
  productName: string;
}

export function ProductGallery({ images, productName }: Props) {
  if (images.length === 0) {
    return <div className="relative aspect-square rounded-[28px] overflow-hidden bg-stripe1" />;
  }

  return (
    <Carousel className="sticky top-24 flex flex-col gap-4" opts={{ loop: true }}>
      <div className="relative aspect-square rounded-[28px] overflow-hidden bg-stripe1">
        <CarouselContent className="h-full -ml-0">
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              className="relative h-full pl-0 flex items-center justify-center"
            >
              <Image
                src={image.url}
                alt={productName}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-surface border-border" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-surface border-border" />
          </>
        )}
      </div>

      {images.length > 1 && (
        <CarouselThumbnails images={images.map((img) => ({ url: img.url, alt: productName }))} />
      )}
    </Carousel>
  );
}
