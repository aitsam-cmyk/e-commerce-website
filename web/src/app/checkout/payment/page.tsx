"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentStep() {
  const router = useRouter();
  const [draft, setDraft] = useState<any | null>(null);
  const [method, setMethod] = useState<string>("easypaisa");
  const [reference, setReference] = useState("");
  const [placing, setPlacing] = useState(false);
  const [invName, setInvName] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invPhone, setInvPhone] = useState("");
  const [invTaxId, setInvTaxId] = useState("");

  // New State for confirmation flow
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bankDetails, setBankDetails] = useState<any[]>([]);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [uploading, setUploading] = useState(false);

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

    // Fetch bank details
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    fetch(`${base}/api/bank-details`)
      .then((res) => res.json())
      .then((data) => setBankDetails(data))
      .catch((err) => console.error("Failed to fetch bank details", err));
  }, []);

  const subtotal = (draft?.items || []).reduce((s: number, it: any) => s + Number(it.price) * Number(it.quantity), 0);
  const shipping = 0;
  const tax = 0;
  const codFee = method === "cod" ? 100 : 0;
  const walletDiscount = method === "easypaisa" || method === "jazzcash" ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal + tax + shipping + codFee - walletDiscount;

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${base}/api/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setProofUrl(data.url);
      } else {
        alert("Upload failed: No URL returned");
      }
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

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
          paymentInfo: { 
            reference, 
            payerName: invName || draft.name, 
            payerPhone: invPhone || draft.phone,
            proofImageUrl: proofUrl 
          }
        })
      });
      if (res.ok) {
        alert("Order placed successfully! Admin will be notified.");
        sessionStorage.removeItem("checkoutDraft");
        router.push("/");
      } else {
        alert("Failed to place order");
      }
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    } finally {
      setPlacing(false);
    }
  }

  const handleConfirmClick = () => {
    if (method === "cod") {
      placeOrder();
    } else {
      setShowConfirmation(true);
    }
  };

  // Filter relevant bank details
  const relevantBanks = bankDetails.filter(b => b.method === method);

  if (showConfirmation) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="font-serif text-2xl mb-6 text-center">Complete Payment</h1>
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6 space-y-6">
          
          {/* Amount Display */}
          <div className="text-center border-b pb-4">
            <p className="text-zinc-500 text-sm">Total Amount to Pay</p>
            <p className="text-3xl font-bold text-emerald-600">Rs {total}</p>
          </div>

          {/* Bank Details */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Please transfer to:</h3>
            {relevantBanks.length > 0 ? (
              relevantBanks.map((bank: any) => (
                <div key={bank._id} className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 mb-3">
                  <div className="font-bold text-lg text-zinc-800">{bank.bankName || bank.method.toUpperCase()}</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    <span className="font-medium">Account Title:</span> {bank.accountTitle}
                  </div>
                  <div className="text-sm text-zinc-600">
                    <span className="font-medium">Account Number:</span> <span className="font-mono bg-white px-1 border rounded">{bank.accountNumber}</span>
                  </div>
                  {bank.iban && (
                    <div className="text-sm text-zinc-600">
                      <span className="font-medium">IBAN:</span> {bank.iban}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-red-500 text-sm">No account details available for this method. Please contact support.</p>
            )}
          </div>

          {/* Screenshot Upload */}
          <div>
            <label className="block font-medium mb-2">Upload Payment Screenshot (Required)</label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setProofFile(e.target.files[0]);
                    handleUpload(e.target.files[0]);
                  }
                }}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
              {uploading && <p className="text-sm text-blue-600 animate-pulse">Uploading...</p>}
              {proofUrl && (
                <div className="mt-2">
                  <p className="text-sm text-emerald-600 mb-1">✓ Screenshot uploaded</p>
                  <img src={proofUrl} alt="Payment Proof" className="h-32 object-contain border rounded bg-zinc-50" />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button 
              onClick={() => setShowConfirmation(false)} 
              className="flex-1 py-3 border border-zinc-300 rounded-xl font-medium text-zinc-700 hover:bg-zinc-50 transition"
            >
              Back
            </button>
            <button
              onClick={placeOrder}
              disabled={!proofUrl || placing}
              className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {placing ? "Processing..." : "Confirm & Send"}
            </button>
          </div>
          
        </div>
      </div>
    );
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
          
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              className={`rounded-xl border px-4 py-6 text-sm text-left transition ${method === "easypaisa" ? "border-emerald-600 bg-emerald-50/10 ring-1 ring-emerald-600" : "border-zinc-200 hover:border-emerald-200"}`}
              onClick={() => setMethod("easypaisa")}
            >
              <div className="font-semibold">Easypaisa</div>
              <div className="mt-1 text-xs text-emerald-700">Wallet discount up to 5%</div>
            </button>
            <button
              className={`rounded-xl border px-4 py-6 text-sm text-left transition ${method === "jazzcash" ? "border-emerald-600 bg-emerald-50/10 ring-1 ring-emerald-600" : "border-zinc-200 hover:border-emerald-200"}`}
              onClick={() => setMethod("jazzcash")}
            >
              <div className="font-semibold">JazzCash</div>
              <div className="mt-1 text-xs text-emerald-700">Wallet discount up to 5%</div>
            </button>
            <button
              className={`rounded-xl border px-4 py-6 text-sm text-left transition ${method === "bank_transfer" ? "border-emerald-600 bg-emerald-50/10 ring-1 ring-emerald-600" : "border-zinc-200 hover:border-emerald-200"}`}
              onClick={() => setMethod("bank_transfer")}
            >
              <div className="font-semibold">Bank Transfer</div>
              <div className="mt-1 text-xs text-zinc-500">Manual transfer</div>
            </button>
            <button
              className={`rounded-xl border px-4 py-6 text-sm text-left transition ${method === "cod" ? "border-emerald-600 bg-emerald-50/10 ring-1 ring-emerald-600" : "border-zinc-200 hover:border-emerald-200"}`}
              onClick={() => setMethod("cod")}
            >
              <div className="font-semibold">Cash on Delivery</div>
              <div className="mt-1 text-xs text-zinc-700">COD fee Rs 100</div>
            </button>
          </div>

          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Payment reference (optional)"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm w-full"
          />
          
          <button 
            disabled={placing} 
            onClick={handleConfirmClick} 
            className="w-full sm:w-auto rounded-md bg-emerald-600 px-8 py-3 text-white font-medium transition hover:bg-emerald-700 disabled:opacity-70"
          >
            {placing ? "Processing..." : "Confirm & Pay"}
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
