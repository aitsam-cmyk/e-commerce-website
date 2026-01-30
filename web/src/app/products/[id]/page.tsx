import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../../../components/AddToCartButton";

async function getProduct(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

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
    return <div className="mx-auto max-w-3xl px-4 py-10">Product not found</div>;
  }
  const images: string[] = Array.isArray((p as any).images) && (p as any).images.length > 0 ? (p as any).images : [p.imageUrl];
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid gap-8 md:grid-cols-2">
      <div>
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image src={images[0]} alt={p.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-300 hover:scale-[1.02]" />
        </div>
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative h-16 w-16 overflow-hidden rounded-md border border-zinc-200">
              <Image src={src} alt={`${p.title} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="font-serif text-2xl">{p.title}</h1>
        <p className="text-zinc-600">{p.description}</p>
        <div className="text-2xl font-semibold">${Number(p.price).toFixed(2)}</div>
        <AddToCartButton
          item={{
            productId: p._id,
            title: p.title,
            price: Number(p.price),
            imageUrl: p.imageUrl
          }}
        />
        <Link href="/products" className="inline-block rounded-md border border-zinc-300 px-4 py-2 text-zinc-700 transition hover:bg-zinc-100">Back to products</Link>
      </div>
    </div>
  );
}
