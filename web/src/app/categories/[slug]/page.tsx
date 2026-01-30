import { Product } from "../../../types/product";
import ProductGrid from "../../../components/ProductGrid";

async function getCategoryProducts(slug: string): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/products?category=${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const products = await getCategoryProducts(params.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Category: {params.slug}</h1>
      <ProductGrid products={products} />
    </div>
  );
}
