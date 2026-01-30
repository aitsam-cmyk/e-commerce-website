"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const [isCustomer, setIsCustomer] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setIsCustomer(false);
    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      const total = Array.isArray(cart) ? cart.reduce((s: number, it: any) => s + Number(it.quantity || 1), 0) : 0;
      setCount(total);
    } catch {
      setCount(0);
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        try {
          const cart = e.newValue ? JSON.parse(e.newValue) : [];
          const total = Array.isArray(cart) ? cart.reduce((s: number, it: any) => s + Number(it.quantity || 1), 0) : 0;
          setCount(total);
        } catch {
          setCount(0);
        }
      }
    };
    const onCartUpdated = () => {
      try {
        const raw = localStorage.getItem("cart");
        const cart = raw ? JSON.parse(raw) : [];
        const total = Array.isArray(cart) ? cart.reduce((s: number, it: any) => s + Number(it.quantity || 1), 0) : 0;
        setCount(total);
      } catch {
        setCount(0);
      }
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cart:updated", onCartUpdated as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart:updated", onCartUpdated as any);
    };
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
          <ThemeToggle />
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-zinc-100">
            <span className="text-lg">🛒</span>
            <span className="absolute -right-1 -top-1 rounded-full bg-zinc-900 px-1 text-[10px] text-white">
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
