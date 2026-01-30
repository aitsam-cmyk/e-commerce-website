"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 shadow-sm">
        <Image 
          src={selectedImage} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-cover transition-all duration-500 ease-in-out"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(src)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === src 
                  ? "border-zinc-900 ring-2 ring-zinc-900/20" 
                  : "border-zinc-200 hover:border-zinc-400"
              }`}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
