import Image from "next/image";
import Link from "next/link";
import { Product } from "../types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product._id}`} className="block">
      <div className="group rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={product.imageUrl || "https://dummyimage.com/600x600/eee/aaa.jpg&text=Product"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.inStock && product.stock > 0 ? (
            <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-1 text-[10px] text-white">
              In stock {product.stock <= 5 && `(${product.stock} left)`}
            </span>
          ) : (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-[10px] text-white">
              Out of stock
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="line-clamp-1 text-sm font-medium dark:text-zinc-100">{product.title}</h3>
          <p className="line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">{product.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-base font-semibold dark:text-zinc-100">Rs {product.price.toLocaleString()}</span>
            <span className="rounded-md bg-zinc-900 dark:bg-zinc-100 px-3 py-2 text-xs text-white dark:text-zinc-900 transition-colors group-hover:bg-zinc-700 dark:group-hover:bg-zinc-200">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
