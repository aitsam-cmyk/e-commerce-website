import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductGallery from "../../../components/ProductGallery";

async function getProduct(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

import ReviewsSection from "../../../components/ReviewsSection";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const p = await getProduct(params.id);
  return {
    title: p ? `${p.title} • E‑Shop` : "Product • E‑Shop",
    description: p?.description,
    openGraph: {
      images: p?.imageUrl ? [{ url: p.imageUrl }] : undefined
    }
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const p = await getProduct(params.id);
  if (!p) {
    return <div className="mx-auto max-w-3xl px-4 py-10 dark:text-white">Product not found</div>;
  }
  
  const images: string[] = Array.isArray((p as any).images) && (p as any).images.length > 0 
    ? (p as any).images 
    : [p.imageUrl];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 bg-white dark:bg-zinc-950 min-h-screen">
      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={images} title={p.title} />
        
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="font-serif text-4xl font-medium text-zinc-900 dark:text-zinc-100">{p.title}</h1>
            <div className="mt-2 flex items-center gap-4">
               <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Rs {Number(p.price).toLocaleString()}</span>
               {p.stock > 0 ? (
                 <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">In Stock</span>
               ) : (
                 <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Out of Stock</span>
               )}
            </div>
          </div>

          <div className="prose prose-zinc max-w-none dark:prose-invert">
            <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">{p.description}</p>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
            <AddToCartButton
              item={{
                productId: p._id,
                title: p.title,
                price: Number(p.price),
                imageUrl: p.imageUrl
              }}
              available={p.stock > 0}
            />
          </div>

          <div className="mt-8">
            <Link href="/products" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200">
              ← Back to all products
            </Link>
          </div>
        </div>
      </div>
      
      <ReviewsSection productId={p._id} />
    </div>
  );
}
