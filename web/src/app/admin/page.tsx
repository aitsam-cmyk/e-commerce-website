 "use client";
 import { useEffect, useState } from "react";
 import { useRouter } from "next/navigation";
 
 export default function AdminPage() {
   const [role, setRole] = useState<string | null>(null);
   const [products, setProducts] = useState<any[]>([]);
   const [categories, setCategories] = useState<any[]>([]);
   const [banners, setBanners] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const router = useRouter();
   const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
 
   useEffect(() => {
     const token = localStorage.getItem("token");
     if (!token) {
       router.push("/login");
       return;
     }
     fetch(`${base}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
       .then(async (res) => {
         const data = await res.json();
         if (!res.ok || data.role !== "admin") {
           router.push("/");
           return;
         }
         setRole(data.role);
       })
       .catch(() => router.push("/"))
       .finally(() => setLoading(false));
   }, [base, router]);
 
   useEffect(() => {
     if (role !== "admin") return;
     Promise.all([
       fetch(`${base}/api/products`).then((r) => r.json()),
       fetch(`${base}/api/categories`).then((r) => r.json()),
       fetch(`${base}/api/banners`).then((r) => r.json()),
     ]).then(([ps, cs, bs]) => {
       setProducts(ps);
       setCategories(cs);
       setBanners(bs);
     });
   }, [role, base]);
 
   async function toggleStock(id: string, inStock: boolean) {
     const token = localStorage.getItem("token") || "";
     const res = await fetch(`${base}/api/products/${id}/stock`, {
       method: "PATCH",
       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
       body: JSON.stringify({ inStock }),
     });
     if (res.ok) {
       setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, inStock } : p)));
     } else {
       alert("Failed to update stock");
     }
   }
 
   if (loading) return <div className="mx-auto max-w-5xl px-4 py-10">Loading…</div>;
   if (role !== "admin") return null;
 
   return (
     <div className="mx-auto max-w-7xl px-4 py-10">
       <h1 className="text-2xl font-serif">Admin Dashboard</h1>
       <div className="mt-6 grid gap-6 lg:grid-cols-3">
         <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
           <h2 className="mb-3 text-lg font-semibold">Products</h2>
           <div className="space-y-3 max-h-[420px] overflow-auto pr-2">
             {products.map((p) => (
               <div key={p._id} className="flex items-center justify-between">
                 <div className="text-sm">
                   <div className="font-medium">{p.title}</div>
                   <div className="text-xs text-zinc-600">${Number(p.price).toFixed(2)}</div>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className={`text-xs ${p.inStock ? "text-emerald-600" : "text-red-600"}`}>{p.inStock ? "In stock" : "Out of stock"}</span>
                   <button onClick={() => toggleStock(p._id, !p.inStock)} className="rounded-md border border-zinc-300 px-3 py-1 text-xs">
                     {p.inStock ? "Mark Out" : "Mark In"}
                   </button>
                 </div>
               </div>
             ))}
           </div>
         </section>
         <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
           <h2 className="mb-3 text-lg font-semibold">Categories</h2>
           <ul className="space-y-2">
             {categories.map((c) => (
               <li key={c._id} className="flex items-center justify-between">
                 <span className="text-sm">{c.name}</span>
               </li>
             ))}
           </ul>
         </section>
         <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
           <h2 className="mb-3 text-lg font-semibold">Banners</h2>
           <ul className="space-y-2">
             {banners.map((b) => (
               <li key={b._id} className="flex items-center justify-between">
                 <span className="text-sm">{b.title || "Untitled"}</span>
               </li>
             ))}
           </ul>
         </section>
       </div>
     </div>
   );
 }
