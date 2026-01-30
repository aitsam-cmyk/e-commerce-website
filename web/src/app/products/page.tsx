import ProductGrid from "../../components/ProductGrid";
import ProductFilters from "../../components/ProductFilters";
import { Product } from "../../types/product";

async function getProducts(searchParams?: Record<string, string>): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const qs = new URLSearchParams(searchParams || {}).toString();
  const res = await fetch(`${base}/api/products${qs ? `?${qs}` : ""}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const products = await getProducts(searchParams);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 dark:bg-zinc-950 min-h-screen">
      <h1 className="text-2xl font-semibold dark:text-zinc-100">Products</h1>
      <ProductFilters />
      <ProductGrid products={products} />
    </div>
  );
}
