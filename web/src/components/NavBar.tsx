"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar() {
  const [isCustomer, setIsCustomer] = useState(false);
  useEffect(() => {
    setIsCustomer(false);
  }, []);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          E‑Shop
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
          <Link href="/contact">Contact</Link>
          {isCustomer && <Link href="/orders">Orders</Link>}
        </nav>
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
