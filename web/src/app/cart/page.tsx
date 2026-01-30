 "use client";
 import { useEffect, useState } from "react";
 import Link from "next/link";
 
 type Item = { productId: string; title: string; price: number; imageUrl?: string; quantity?: number };
 
 export default function CartPage() {
   const [items, setItems] = useState<Item[]>([]);
 
   useEffect(() => {
     try {
       const raw = localStorage.getItem("cart");
       const cart: Item[] = raw ? JSON.parse(raw) : [];
       setItems(cart);
     } catch {
       setItems([]);
     }
   }, []);
 
   function removeItem(id: string) {
    const next = items.filter((i) => i.productId !== id);
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
    window.dispatchEvent(new Event("cart:updated"));
  }
 
   const subtotal = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity || 1), 0);
 
   return (
     <div className="mx-auto max-w-3xl px-4 py-10">
       <h1 className="text-2xl font-semibold">Cart</h1>
       {items.length === 0 ? (
         <p className="mt-2 text-zinc-600">Your cart is empty.</p>
       ) : (
         <div className="mt-4 space-y-3">
           {items.map((it) => (
             <div key={it.productId} className="flex items-center gap-3">
               <img src={it.imageUrl || "https://dummyimage.com/120x120/eee/aaa.jpg&text=Item"} alt={it.title} className="h-12 w-12 rounded object-cover" />
               <div className="flex-1">
                 <div className="text-sm font-medium line-clamp-1">{it.title}</div>
                 <div className="text-xs text-zinc-600">Qty {it.quantity || 1}</div>
               </div>
               <div className="text-sm font-semibold">Rs {it.price}</div>
               <button onClick={() => removeItem(it.productId)} className="text-xs text-red-600">Remove</button>
             </div>
           ))}
           <div className="pt-2 text-sm">
             <div className="flex justify-between"><span>Subtotal</span><span>Rs {subtotal}</span></div>
           </div>
           <Link href="/checkout" className="inline-block rounded-md bg-emerald-600 px-4 py-2 text-white">Proceed to checkout</Link>
         </div>
       )}
     </div>
   );
 }
