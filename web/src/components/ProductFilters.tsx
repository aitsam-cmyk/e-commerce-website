"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductFilters() {
  const router = useRouter();
  const sp = useSearchParams();
  const [category, setCategory] = useState(sp.get("category") || "");
  const [minPrice, setMinPrice] = useState(sp.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(sp.get("maxPrice") || "");
  const [minRating, setMinRating] = useState(sp.get("minRating") || "");

  useEffect(() => {
    setCategory(sp.get("category") || "");
    setMinPrice(sp.get("minPrice") || "");
    setMaxPrice(sp.get("maxPrice") || "");
    setMinRating(sp.get("minRating") || "");
  }, [sp]);

  function apply() {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minRating) params.set("minRating", minRating);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 grid gap-3 sm:grid-cols-4">
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min Price" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max Price" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
      <div className="flex gap-2">
        <input value={minRating} onChange={(e) => setMinRating(e.target.value)} placeholder="Min Rating" className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm" />
        <button onClick={apply} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white">Filter</button>
      </div>
    </div>
  );
}
