"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Prevents page reload
    if (!name || !phone || !shippingAddress) {
        alert("Please fill in all required fields (Name, Phone, Address).");
        return;
    }
    const draft = { items, shippingAddress, email, name, phone };
    sessionStorage.setItem("checkoutDraft", JSON.stringify(draft));
    router.push("/checkout/payment");
  }

  // Load items from session (buy now) or local cart
  if (typeof window !== "undefined" && items.length === 0) {
    try {
      const fromSession = sessionStorage.getItem("checkoutDraft");
      if (fromSession) {
        const parsed = JSON.parse(fromSession);
        if (Array.isArray(parsed.items)) {
          setItems(parsed.items);
        }
      } else {
        const raw = localStorage.getItem("cart");
        const cart = raw ? JSON.parse(raw) : [];
        setItems(cart);
      }
    } catch {
      setItems([]);
    }
  }

  const subtotal = items.reduce((s, it) => s + Number(it.price) * Number(it.quantity), 0);
  const tax = 0;
  const shipping = 0;
  const total = subtotal + tax + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-2xl mb-6">Shipping & Billing</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <form id="checkout-form" onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name *" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional)" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
            <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone *" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
            <input required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Shipping address *" className="rounded-md border border-zinc-300 px-3 py-2 text-sm sm:col-span-2" />
          </form>
          <button type="submit" form="checkout-form" className="rounded-md bg-emerald-600 px-4 py-2 text-white transition hover:scale-[1.02]">Proceed to Pay</button>
          <p className="text-xs text-zinc-500">Guest checkout supported. Payment method will be selected on next step.</p>
        </div>
        <aside className="sticky top-20 h-fit rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
          <div className="space-y-3">
            {items.map((it: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <img src={it.imageUrl} alt={it.title} className="h-12 w-12 rounded object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-medium line-clamp-1">{it.title}</div>
                  <div className="text-xs text-zinc-600">Qty {it.quantity}</div>
                </div>
                <div className="text-sm font-semibold">Rs {it.price}</div>
              </div>
            ))}
            <div className="pt-2 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs {subtotal}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>Rs {shipping}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>Rs {tax}</span></div>
              <div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>Rs {total}</span></div>
              <div className="mt-3 text-xs text-zinc-500">Secure Checkout • SSL Encrypted • Money Back Guarantee</div>
              <button type="submit" form="checkout-form" className="mt-3 w-full rounded-md bg-emerald-600 px-4 py-2 text-white">Proceed to Pay</button>
              <button type="button" className="mt-2 w-full text-xs text-zinc-600">Have a discount code?</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}