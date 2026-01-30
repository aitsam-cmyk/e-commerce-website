"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Check Admin Role
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === 'admin') setIsAdmin(true);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }

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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-900 text-white backdrop-blur supports-[backdrop-filter]:bg-slate-900/80 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          LuxeMarket
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <Link href="/products" className="hover:text-emerald-400 transition-colors">Products</Link>
          {!isAdmin && (
             <>
               <Link href="/login" className="hover:text-emerald-400 transition-colors">Login</Link>
               <Link href="/signup" className="hover:text-emerald-400 transition-colors">Signup</Link>
             </>
          )}
          <Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
          {isCustomer && <Link href="/orders" className="hover:text-emerald-400 transition-colors">Orders</Link>}
          {isAdmin && <Link href="/admin" className="text-emerald-400 font-bold hover:text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full bg-emerald-500/10">Admin Dashboard</Link>}
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-white/10 transition-colors">
            <span className="text-xl">🛒</span>
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
