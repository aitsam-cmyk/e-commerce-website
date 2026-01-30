import ProductGrid from "../../components/ProductGrid";
import { Product } from "../../types/product";

async function getProducts(): Promise<Product[]> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/products`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Products</h1>
      <ProductGrid products={products} />
    </div>
  );
}
