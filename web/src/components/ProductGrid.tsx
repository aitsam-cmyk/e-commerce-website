import ProductCard from "./ProductCard";
import { Product } from "../types/product";

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <h2 className="mb-4 text-xl font-semibold dark:text-zinc-100">Featured Products</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
