"use client";
import Link from "next/link";
import { useState } from "react";

export default function NavBar() {
  const [q, setQ] = useState("");
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          E‑Shop
        </Link>
        <div className="hidden sm:flex w-full max-w-md items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-900"
          />
          <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-700">
            Search
          </button>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-zinc-100">
            <span className="text-lg">🛒</span>
            <span className="absolute -right-1 -top-1 rounded-full bg-zinc-900 px-1 text-[10px] text-white">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
