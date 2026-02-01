import Slider from "../components/Slider";
import Testimonials from "../components/Testimonials";
import ProductGrid from "../components/ProductGrid";
import { Product } from "../types/product";
import Link from "next/link";
import Image from "next/image";

async function getProducts(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

type Category = {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  icon?: string;
};

async function getCategories(): Promise<Category[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/categories`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories();
  const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const getImageUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("/uploads")) return `${baseApiUrl}${url}`;
    return url;
  };

  const DEFAULT_ICONS: Record<string, string> = {
    fashion: "👗",
    electronics: "📱",
    beauty: "💄",
    home: "🏠",
    groceries: "🛒",
    sports: "🏃",
    toys: "🧸",
    books: "📚",
    computers: "💻",
    audio: "🎧",
    gaming: "🎮",
    watches: "⌚",
  };

  return (
    <div className="min-h-screen bg-background dark:bg-zinc-950">
      <section className="mx-auto max-w-7xl px-4 pt-8">
        <Slider />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-zinc-100">Categories</h2>
          <Link href="/products" className="text-sm text-zinc-700 underline dark:text-zinc-300">Shop all products</Link>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group flex flex-col items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-center shadow-sm transition hover:scale-[1.02] hover:shadow-md"
              >
                <div className="mb-2 h-12 w-12 relative flex items-center justify-center text-3xl">
                   {c.imageUrl ? (
                     <Image 
                       src={getImageUrl(c.imageUrl)!} 
                       alt={c.name} 
                       fill 
                       className="object-cover rounded-full"
                       sizes="48px"
                     />
                   ) : (
                     <span>{c.icon || DEFAULT_ICONS[c.slug] || "📦"}</span>
                   )}
                </div>
                <span className="text-xs font-medium dark:text-zinc-100">{c.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-zinc-500 py-8">No categories found</div>
        )}
      </section>
      <ProductGrid products={products} />
      <Testimonials />
    </div>
  );
}
