 "use client";
 import { useRouter } from "next/navigation";
 
 type Item = {
   productId: string;
   title: string;
   price: number;
   imageUrl?: string;
   quantity?: number;
 };
 
 export default function AddToCartButton({ item, available = true }: { item: Item; available?: boolean }) {
   const router = useRouter();
 
   function addToCart() {
    if (!available) {
      alert("Product is out of stock");
      return;
    }
     try {
       const raw = localStorage.getItem("cart");
       const cart: Item[] = raw ? JSON.parse(raw) : [];
       const existing = cart.find((c) => c.productId === item.productId);
       if (existing) {
         existing.quantity = (existing.quantity || 1) + 1;
       } else {
         cart.push({ ...item, quantity: item.quantity || 1 });
       }
       localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart:updated"));
      alert("Added to cart");
     } catch {
       alert("Failed to add to cart");
     }
   }
 
   function buyNow() {
     if (!available) {
       alert("Product is out of stock");
       return;
     }
     const draft = { items: [{ ...item, quantity: 1 }] };
     sessionStorage.setItem("checkoutDraft", JSON.stringify(draft));
     router.push("/checkout");
   }
 
   return (
     <div className="flex gap-2">
       <button onClick={addToCart} className="rounded-md bg-zinc-900 px-4 py-2 text-white transition hover:scale-[1.02]">
         Add to cart
       </button>
       <button onClick={buyNow} className="rounded-md border border-zinc-300 px-4 py-2 text-zinc-700 transition hover:bg-zinc-100">
         Order Now
       </button>
     </div>
   );
 }
