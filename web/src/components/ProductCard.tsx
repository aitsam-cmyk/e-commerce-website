import Image from "next/image";
import Link from "next/link";
import { Product } from "../types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product._id}`} className="block">
      <div className="group rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image
            src={product.imageUrl || "https://dummyimage.com/600x600/eee/aaa.jpg&text=Product"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.inStock ? (
            <span className="absolute left-2 top-2 rounded bg-green-600 px-2 py-1 text-[10px] text-white">
              In stock
            </span>
          ) : (
            <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-[10px] text-white">
              Out of stock
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="line-clamp-1 text-sm font-medium">{product.title}</h3>
          <p className="line-clamp-2 text-xs text-zinc-600">{product.description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-base font-semibold">${product.price.toFixed(2)}</span>
            <span className="rounded-md bg-zinc-900 px-3 py-2 text-xs text-white transition-colors group-hover:bg-zinc-700">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
