"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Types
type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
};

type Category = {
  _id: string;
  name: string;
  isActive: boolean;
};

type Banner = {
  _id: string;
  title?: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
  order?: number;
};

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "banners">("products");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"product" | "category" | "banner" | null>(null);

  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Decode token or fetch me
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role !== 'admin') {
            router.push("/");
            return;
        }
        setRole("admin");
    } catch {
        router.push("/login");
    }
    setLoading(false);
  }, [router]);

  // Data Fetching
  const refreshData = () => {
    if (role !== "admin") return;
    const token = localStorage.getItem("token") || "";
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${base}/api/products`, { headers }).then((r) => r.json()),
      fetch(`${base}/api/categories`, { headers }).then((r) => r.json()),
      fetch(`${base}/api/banners`, { headers }).then((r) => r.json()),
    ]).then(([ps, cs, bs]) => {
      setProducts(Array.isArray(ps) ? ps : []);
      setCategories(Array.isArray(cs) ? cs : []);
      setBanners(Array.isArray(bs) ? bs : []);
    });
  };

  useEffect(() => {
    if (role === "admin") refreshData();
  }, [role, base]);

  // Actions
  async function handleDelete(id: string, type: "products" | "categories" | "banners") {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("token") || "";
    await fetch(`${base}/api/${type}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    refreshData();
  }

  async function toggleStock(id: string, inStock: boolean) {
    const token = localStorage.getItem("token") || "";
    await fetch(`${base}/api/products/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ inStock }),
    });
    refreshData();
  }

  function openCreateModal(type: "product" | "category" | "banner") {
    setEditingItem(null);
    setModalType(type);
    setModalOpen(true);
  }

  function openEditModal(item: any, type: "product" | "category" | "banner") {
    setEditingItem(item);
    setModalType(type);
    setModalOpen(true);
  }

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (role !== "admin") return null;

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <div className="bg-white shadow-sm border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 py-6">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">Manage your store content and inventory.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 rounded-xl bg-zinc-200 p-1 mb-8 max-w-md">
          {(["products", "categories", "banners"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-emerald-400 focus:outline-none focus:ring-2 ${
                activeTab === tab
                  ? "bg-white text-emerald-700 shadow"
                  : "text-zinc-600 hover:bg-white/[0.12] hover:text-emerald-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="p-6 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
                <h2 className="text-xl font-semibold text-zinc-800">
                    {activeTab === "products" && "Product Inventory"}
                    {activeTab === "categories" && "Categories"}
                    {activeTab === "banners" && "Promotional Banners"}
                </h2>
                <button 
                    onClick={() => openCreateModal(activeTab === "products" ? "product" : activeTab === "categories" ? "category" : "banner")}
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
                >
                    + Add New
                </button>
            </div>

            <div className="divide-y divide-zinc-100">
                {activeTab === "products" && (
                    <div className="grid grid-cols-1">
                        {products.map((p) => (
                            <div key={p._id} className="p-4 hover:bg-zinc-50 transition-colors flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                                        <img src={p.imageUrl || "https://via.placeholder.com/150"} alt={p.title} className="h-full w-full object-cover object-center" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-zinc-900">{p.title}</h3>
                                        <p className="text-sm text-zinc-500">${p.price} • {p.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => toggleStock(p._id, !p.inStock)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                            p.inStock 
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                                            : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                        }`}
                                    >
                                        {p.inStock ? "In Stock" : "Out of Stock"}
                                    </button>
                                    <div className="flex items-center border-l border-zinc-200 pl-3 gap-2">
                                        <button onClick={() => openEditModal(p, "product")} className="text-zinc-400 hover:text-emerald-600">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(p._id, "products")} className="text-zinc-400 hover:text-red-600">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {products.length === 0 && <div className="p-8 text-center text-zinc-500">No products found.</div>}
                    </div>
                )}

                {activeTab === "categories" && (
                     <div className="grid grid-cols-1">
                        {categories.map((c) => (
                            <div key={c._id} className="p-4 hover:bg-zinc-50 transition-colors flex items-center justify-between">
                                <span className="font-medium text-zinc-900">{c.name}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEditModal(c, "category")} className="text-sm text-zinc-600 hover:text-emerald-600">Edit</button>
                                    <button onClick={() => handleDelete(c._id, "categories")} className="text-sm text-zinc-600 hover:text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                     </div>
                )}

                {activeTab === "banners" && (
                    <div className="grid grid-cols-1">
                        {banners.map((b) => (
                            <div key={b._id} className="p-4 hover:bg-zinc-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                     <div className="h-12 w-24 flex-shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100">
                                        <img src={b.imageUrl} alt="Banner" className="h-full w-full object-cover" />
                                    </div>
                                    <span className="text-sm font-medium">{b.title || "Untitled Banner"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEditModal(b, "banner")} className="text-sm text-zinc-600 hover:text-emerald-600">Edit</button>
                                    <button onClick={() => handleDelete(b._id, "banners")} className="text-sm text-zinc-600 hover:text-red-600">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {modalOpen && (
        <Modal 
            isOpen={modalOpen} 
            onClose={() => setModalOpen(false)} 
            type={modalType!} 
            initialData={editingItem} 
            refreshData={refreshData}
            base={base}
        />
      )}
    </div>
  );
}

function Modal({ isOpen, onClose, type, initialData, refreshData, base }: any) {
    const [formData, setFormData] = useState(initialData || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({});
    }, [initialData]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem("token") || "";
        const endpoint = type === "product" ? "products" : type === "category" ? "categories" : "banners";
        const url = initialData ? `${base}/api/${endpoint}/${initialData._id}` : `${base}/api/${endpoint}`;
        const method = initialData ? "PATCH" : "POST";

        // Clean data for product
        const payload = { ...formData };
        if (type === "product") {
            payload.price = Number(payload.price);
        }

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            refreshData();
            onClose();
        } else {
            alert("Operation failed");
        }
        setLoading(false);
    }

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4">{initialData ? "Edit" : "Create"} {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {type === "product" && (
                        <>
                            <input name="title" placeholder="Product Title" value={formData.title || ""} onChange={handleChange} className="w-full rounded border p-2" required />
                            <textarea name="description" placeholder="Description" value={formData.description || ""} onChange={handleChange} className="w-full rounded border p-2" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="price" type="number" placeholder="Price" value={formData.price || ""} onChange={handleChange} className="w-full rounded border p-2" required />
                                <input name="category" placeholder="Category" value={formData.category || ""} onChange={handleChange} className="w-full rounded border p-2" required />
                            </div>
                            <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl || ""} onChange={handleChange} className="w-full rounded border p-2" required />
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="inStock" checked={formData.inStock !== false} onChange={handleChange} />
                                In Stock
                            </label>
                        </>
                    )}
                    {type === "category" && (
                        <>
                            <input name="name" placeholder="Category Name" value={formData.name || ""} onChange={handleChange} className="w-full rounded border p-2" required />
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="isActive" checked={formData.isActive !== false} onChange={handleChange} />
                                Active
                            </label>
                        </>
                    )}
                    {type === "banner" && (
                        <>
                            <input name="title" placeholder="Title (Optional)" value={formData.title || ""} onChange={handleChange} className="w-full rounded border p-2" />
                            <input name="imageUrl" placeholder="Image URL" value={formData.imageUrl || ""} onChange={handleChange} className="w-full rounded border p-2" required />
                            <input name="link" placeholder="Link URL (Optional)" value={formData.link || ""} onChange={handleChange} className="w-full rounded border p-2" />
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="isActive" checked={formData.isActive !== false} onChange={handleChange} />
                                Active
                            </label>
                        </>
                    )}
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-600 hover:bg-zinc-100 rounded">Cancel</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-zinc-900 text-white rounded hover:bg-zinc-700">
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
