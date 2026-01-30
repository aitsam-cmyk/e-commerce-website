import Slider from "../components/Slider";
import Testimonials from "../components/Testimonials";
import ProductGrid from "../components/ProductGrid";
import { Product } from "../types/product";
import Link from "next/link";

async function getProducts(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const products = await getProducts();
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
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {[
            { name: "Fashion", slug: "fashion", icon: "👗" },
            { name: "Electronics", slug: "electronics", icon: "📱" },
            { name: "Beauty", slug: "beauty", icon: "💄" },
            { name: "Home", slug: "home", icon: "🏠" },
            { name: "Groceries", slug: "groceries", icon: "🛒" },
            { name: "Sports", slug: "sports", icon: "🏃" },
            { name: "Toys", slug: "toys", icon: "🧸" },
            { name: "Books", slug: "books", icon: "📚" },
            { name: "Computers", slug: "computers", icon: "💻" },
            { name: "Audio", slug: "audio", icon: "🎧" },
            { name: "Gaming", slug: "gaming", icon: "🎮" },
            { name: "Watches", slug: "watches", icon: "⌚" },
          ].map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="group flex flex-col items-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 text-center shadow-sm transition hover:scale-[1.02] hover:shadow-md"
            >
              <span className="mb-2 text-3xl transition-transform group-hover:rotate-6">{c.icon}</span>
              <span className="text-xs font-medium dark:text-zinc-100">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
      <ProductGrid products={products} />
      <Testimonials />
    </div>
  );
}
