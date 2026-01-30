"use client";
import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const fallback = "https://dummyimage.com/800x800/eee/aaa.jpg&text=Image";
  const normalize = (url?: string) => {
    if (!url) return fallback;
    const u = url.trim();
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    if (u.startsWith("/uploads")) return `${base}${u}`;
    if (u.startsWith("uploads")) return `${base}/${u}`;
    if (u.startsWith("/placeholder")) return fallback;
    return u;
  };
  const resolvedImages = images.map((src) => normalize(src));
  const [selectedImage, setSelectedImage] = useState(resolvedImages[0]);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Image 
          src={selectedImage} 
          alt={title} 
          fill 
          sizes="(max-width: 768px) 100vw, 50vw" 
          className="object-cover transition-all duration-500 ease-in-out"
          priority
          unoptimized
        />
      </div>
      {resolvedImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
          {resolvedImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(src)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                selectedImage === src 
                  ? "border-zinc-900 dark:border-zinc-100 ring-2 ring-zinc-900/20 dark:ring-zinc-100/20" 
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600"
              }`}
            >
              <Image src={src} alt={`${title} ${i + 1}`} fill sizes="80px" className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
