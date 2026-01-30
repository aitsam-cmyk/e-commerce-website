"use client";
import { useEffect, useState } from "react";

export default function PaymentStep() {
  const [draft, setDraft] = useState<any | null>(null);
  const [method, setMethod] = useState<string>("easypaisa");
  const [reference, setReference] = useState("");
  const [placing, setPlacing] = useState(false);
  const [invName, setInvName] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invPhone, setInvPhone] = useState("");
  const [invTaxId, setInvTaxId] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem("checkoutDraft");
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setDraft(d);
        setInvName(d?.invoice?.name || d?.name || "");
        setInvEmail(d?.invoice?.email || d?.email || "");
        setInvPhone(d?.invoice?.phone || d?.phone || "");
        setInvTaxId(d?.invoice?.taxId || "");
      } catch {
        setDraft(null);
      }
    }
  }, []);

  const subtotal = (draft?.items || []).reduce((s: number, it: any) => s + Number(it.price) * Number(it.quantity), 0);
  const shipping = 0;
  const tax = 0;
  const codFee = method === "cod" ? 100 : 0;
  const walletDiscount = method === "easypaisa" || method === "jazzcash" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + tax + shipping + codFee - walletDiscount;

  async function placeOrder() {
    if (!draft) return;
    setPlacing(true);
    try {
      const invoice = { name: invName, email: invEmail, phone: invPhone, taxId: invTaxId };
      sessionStorage.setItem("checkoutDraft", JSON.stringify({ ...draft, invoice }));
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${base}/api/orders/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: draft.items,
          paymentMethod: method,
          shippingAddress: draft.shippingAddress,
          paymentInfo: { reference, payerName: invName || draft.name, payerPhone: invPhone || draft.phone }
        })
      });
      if (res.ok) {
        alert("Order placed successfully");
        sessionStorage.removeItem("checkoutDraft");
      } else {
        alert("Failed to place order");
      }
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-2xl mb-6">Select Payment Method</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Invoice & Contact Info</h2>
              <span className="text-xs text-zinc-500">Optional</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input value={invName} onChange={(e) => setInvName(e.target.value)} placeholder="Invoice name / Company" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
              <input value={invTaxId} onChange={(e) => setInvTaxId(e.target.value)} placeholder="Tax ID (NTN) optional" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
              <input value={invEmail} onChange={(e) => setInvEmail(e.target.value)} placeholder="Invoice Email" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
              <input value={invPhone} onChange={(e) => setInvPhone(e.target.value)} placeholder="Invoice Phone" className="rounded-md border border-zinc-300 px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              className={`rounded-xl border px-4 py-6 text-sm ${method === "easypaisa" ? "border-emerald-600" : "border-zinc-200"}`}
              onClick={() => setMethod("easypaisa")}
            >
              Easypaisa
              <div className="mt-1 text-xs text-emerald-700">Wallet discount up to 5%</div>
            </button>
            <button
              className={`rounded-xl border px-4 py-6 text-sm ${method === "jazzcash" ? "border-emerald-600" : "border-zinc-200"}`}
              onClick={() => setMethod("jazzcash")}
            >
              JazzCash
              <div className="mt-1 text-xs text-emerald-700">Wallet discount up to 5%</div>
            </button>
            <button
              className={`rounded-xl border px-4 py-6 text-sm ${method === "cod" ? "border-emerald-600" : "border-zinc-200"}`}
              onClick={() => setMethod("cod")}
            >
              Cash on Delivery
              <div className="mt-1 text-xs text-zinc-700">COD fee Rs 100</div>
            </button>
          </div>
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Payment reference (optional)"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm w-full"
          />
          <button disabled={placing} onClick={placeOrder} className="rounded-md bg-emerald-600 px-4 py-2 text-white transition hover:scale-[1.02]">
            {placing ? "Placing..." : "Confirm & Pay"}
          </button>
        </div>
        <aside className="sticky top-20 h-fit rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Order Summary</h2>
          <div className="mb-4 rounded-lg border border-zinc-200 bg-white p-3">
            <div className="mb-2 text-sm font-medium">Invoice & Contact</div>
            <div className="text-xs text-zinc-700">Name: {invName || draft?.name || "-"}</div>
            <div className="text-xs text-zinc-700">Email: {invEmail || draft?.email || "-"}</div>
            <div className="text-xs text-zinc-700">Phone: {invPhone || draft?.phone || "-"}</div>
            {invTaxId && <div className="text-xs text-zinc-700">Tax ID: {invTaxId}</div>}
          </div>
          <div className="space-y-3">
            {(draft?.items || []).map((it: any, i: number) => (
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
              {walletDiscount > 0 && <div className="flex justify-between text-emerald-700"><span>Wallet Discount</span><span>- Rs {walletDiscount}</span></div>}
              {codFee > 0 && <div className="flex justify-between text-zinc-700"><span>COD Fee</span><span>Rs {codFee}</span></div>}
              <div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>Rs {total}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
