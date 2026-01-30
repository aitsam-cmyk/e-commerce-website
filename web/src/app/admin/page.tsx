"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

// Types
type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  images?: string[];
  category: string;
  inStock: boolean;
  stock: number;
  sales: number;
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

type Order = {
    _id: string;
    items: any[];
    totalAmount: number;
    status: string;
    createdAt: string;
    userId: string;
};

type Review = {
    _id: string;
    productId: string;
    userName?: string;
    rating: number;
    content: string;
    createdAt: string;
};

type Testimonial = {
    _id: string;
    name: string;
    text: string;
    rating: number;
    isActive: boolean;
};

export default function AdminPage() {
  const [role, setRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "categories" | "banners" | "orders" | "reviews" | "testimonials">("products");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<"product" | "category" | "banner" | "testimonial" | "review" | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
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
      fetch(`${base}/api/orders/all`, { headers }).then((r) => r.json()),
      fetch(`${base}/api/reviews`, { headers }).then((r) => r.json()),
      fetch(`${base}/api/testimonials`, { headers }).then((r) => r.json()),
    ]).then(([ps, cs, bs, os, rs, ts]) => {
      if (Array.isArray(ps)) setProducts(ps);
      if (Array.isArray(cs)) setCategories(cs);
      if (Array.isArray(bs)) setBanners(bs);
      if (Array.isArray(os)) setOrders(os);
      if (Array.isArray(rs)) setReviews(rs);
      if (Array.isArray(ts)) setTestimonials(ts);
    }).catch(console.error);
  };

  useEffect(() => {
    if (role === "admin") refreshData();
  }, [role]);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, multiple: boolean = false) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    const token = localStorage.getItem("token");

    try {
        if (multiple) {
            Array.from(e.target.files).forEach(file => {
                formData.append("files", file);
            });
            const res = await fetch(`${base}/api/upload/multiple`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.urls) {
                // For products, append to existing images or replace
                const existingImages = editingItem.images || [];
                // If it's a new product and no main image, use first one
                const updates: any = { images: [...existingImages, ...data.urls] };
                if (!editingItem.imageUrl && data.urls.length > 0) {
                    updates.imageUrl = data.urls[0];
                }
                setEditingItem({ ...editingItem, ...updates });
                toast.success("Images uploaded successfully");
            }
        } else {
            formData.append("file", e.target.files[0]);
            const res = await fetch(`${base}/api/upload`, {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.url) {
                setEditingItem({ ...editingItem, imageUrl: data.url });
                toast.success("Image uploaded successfully");
            }
        }
    } catch (error) {
        console.error("Upload failed", error);
        toast.error("Upload failed");
    } finally {
        setUploading(false);
    }
  };

  // Actions
  const handleDelete = async (endpoint: string, id: string) => {
    if (!confirm("Are you sure?")) return; // Keeping confirm for safety
    const token = localStorage.getItem("token");
    try {
        await fetch(`${base}/api/${endpoint}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Deleted successfully");
        refreshData();
    } catch (e) {
        toast.error("Delete failed");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingItem?._id ? "PATCH" : "POST";
    
    let endpoint = 'products';
    if (modalType === 'category') endpoint = 'categories';
    if (modalType === 'banner') endpoint = 'banners';
    if (modalType === 'testimonial') endpoint = 'testimonials';
    if (modalType === 'review') endpoint = 'reviews';

    const url = editingItem?._id 
      ? `${base}/api/${endpoint}/${editingItem._id}`
      : `${base}/api/${endpoint}`;

    // Clean up numeric fields
    const body = { ...editingItem };
    if (modalType === 'product') {
        body.price = Number(body.price);
        body.stock = Number(body.stock);
    }
    if (modalType === 'testimonial' || modalType === 'review') {
        body.rating = Number(body.rating);
    }

    try {
        const res = await fetch(url, {
            method,
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error("Failed to save");

        toast.success("Saved successfully");
        setModalOpen(false);
        setEditingItem(null);
        refreshData();
    } catch (e) {
        toast.error("Failed to save changes");
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
      const token = localStorage.getItem("token");
      try {
        await fetch(`${base}/api/orders/${id}`, {
            method: "PATCH",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ status })
        });
        toast.success("Order status updated");
        refreshData();
      } catch {
          toast.error("Failed to update status");
      }
  };

  // Stats
  const totalEarnings = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalSales = products.reduce((acc, p) => acc + (p.sales || 0), 0);
  const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

  if (loading || !role) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-10 dark:bg-zinc-900 dark:text-zinc-100 transition-colors">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Admin Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage your store efficiently</p>
          </div>
          <div className="flex gap-4">
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-zinc-500 uppercase">Total Earnings</div>
                  <div className="text-lg font-bold text-green-600">Rs {totalEarnings.toLocaleString()}</div>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-zinc-500 uppercase">Items Sold</div>
                  <div className="text-lg font-bold text-blue-600">{totalSales}</div>
              </div>
              <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
                  <div className="text-xs text-zinc-500 uppercase">Stock Value</div>
                  <div className="text-lg font-bold text-purple-600">{totalStock} units</div>
              </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto border-b border-zinc-200 dark:border-zinc-700 pb-2">
          {["products", "categories", "banners", "orders", "reviews", "testimonials"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
                activeTab === tab 
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" 
                    : "bg-white text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:bg-zinc-800 dark:border-zinc-700">
          {activeTab === "products" && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Products</h2>
                <button 
                  onClick={() => { setEditingItem({}); setModalType("product"); setModalOpen(true); }}
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  + Add Product
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((p) => (
                  <div key={p._id} className="flex flex-col justify-between rounded-lg border dark:border-zinc-700 p-4">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-medium">{p.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${p.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {p.stock} left
                            </span>
                        </div>
                        <p className="text-sm text-zinc-500 mt-1">Rs {p.price}</p>
                        <p className="text-xs text-zinc-400">Sold: {p.sales}</p>
                        {p.imageUrl && <img src={p.imageUrl} alt={p.title} className="w-full h-32 object-cover mt-2 rounded" />}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => { setEditingItem(p); setModalType("product"); setModalOpen(true); }} className="text-sm text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete("products", p._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "categories" && (
             <div>
             <div className="mb-4 flex justify-between items-center">
               <h2 className="text-xl font-semibold">Categories</h2>
               <button 
                 onClick={() => { setEditingItem({}); setModalType("category"); setModalOpen(true); }}
                 className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
               >
                 + Add Category
               </button>
             </div>
             <div className="space-y-2">
                {categories.map(c => (
                    <div key={c._id} className="flex items-center justify-between rounded border dark:border-zinc-700 p-3">
                        <span>{c.name} {c.isActive ? '(Active)' : '(Inactive)'}</span>
                        <div className="flex gap-2">
                            <button onClick={() => { setEditingItem(c); setModalType("category"); setModalOpen(true); }} className="text-sm text-blue-600">Edit</button>
                            <button onClick={() => handleDelete("categories", c._id)} className="text-sm text-red-600">Delete</button>
                        </div>
                    </div>
                ))}
             </div>
           </div>
          )}
          
          {activeTab === "banners" && (
            <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Banners</h2>
              <button 
                onClick={() => { setEditingItem({}); setModalType("banner"); setModalOpen(true); }}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Banner
              </button>
            </div>
            <div className="space-y-4">
               {banners.map(b => (
                   <div key={b._id} className="flex items-center gap-4 rounded border dark:border-zinc-700 p-3">
                       <img src={b.imageUrl} alt="banner" className="h-16 w-32 object-cover rounded" />
                       <div className="flex-1">
                           <div className="font-medium">{b.title || "No Title"}</div>
                           <div className="text-sm text-zinc-500">{b.link}</div>
                       </div>
                       <div className="flex gap-2">
                           <button onClick={() => { setEditingItem(b); setModalType("banner"); setModalOpen(true); }} className="text-sm text-blue-600">Edit</button>
                           <button onClick={() => handleDelete("banners", b._id)} className="text-sm text-red-600">Delete</button>
                       </div>
                   </div>
               ))}
            </div>
          </div>
          )}

          {activeTab === "orders" && (
              <div>
                  <h2 className="mb-4 text-xl font-semibold">Orders</h2>
                  <div className="space-y-4">
                      {orders.map(order => (
                          <div key={order._id} className="rounded border dark:border-zinc-700 p-4">
                              <div className="flex justify-between items-center mb-2">
                                  <span className="font-mono text-sm">{order._id.slice(-6)}</span>
                                  <select 
                                    value={order.status} 
                                    onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                    className="text-sm border rounded p-1 dark:bg-zinc-700 dark:border-zinc-600"
                                  >
                                      <option value="pending">Pending</option>
                                      <option value="processing">Processing</option>
                                      <option value="shipped">Shipped</option>
                                      <option value="delivered">Delivered</option>
                                      <option value="cancelled">Cancelled</option>
                                  </select>
                              </div>
                              <div className="text-sm">
                                  Items: {order.items.length} | Total: Rs {order.totalAmount}
                              </div>
                              <div className="text-xs text-zinc-500 mt-1">
                                  {new Date(order.createdAt).toLocaleString()}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === "reviews" && (
              <div>
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Reviews</h2>
                    <button 
                        onClick={() => { setEditingItem({}); setModalType("review"); setModalOpen(true); }}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Add Review
                    </button>
                  </div>
                  <div className="space-y-4">
                      {reviews.map(r => (
                          <div key={r._id} className="rounded border dark:border-zinc-700 p-4">
                              <div className="flex justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
                                    <span className="text-sm font-medium">{r.userName || "User"}</span>
                                  </div>
                                  <button onClick={() => handleDelete("reviews", r._id)} className="text-red-600 text-sm">Delete</button>
                              </div>
                              <p className="mt-2 text-zinc-700 dark:text-zinc-300">{r.content}</p>
                              <div className="text-xs text-zinc-400 mt-2">Product ID: {r.productId}</div>
                          </div>
                      ))}
                      {reviews.length === 0 && <p className="text-zinc-500">No reviews found.</p>}
                  </div>
              </div>
          )}

          {activeTab === "testimonials" && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Testimonials</h2>
                  <button 
                    onClick={() => { setEditingItem({}); setModalType("testimonial"); setModalOpen(true); }}
                    className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    + Add Testimonial
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map(t => (
                        <div key={t._id} className="rounded border dark:border-zinc-700 p-4 bg-zinc-50 dark:bg-zinc-700/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{t.name}</h3>
                                    <div className="text-yellow-500 text-sm">{"★".repeat(t.rating)}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingItem(t); setModalType("testimonial"); setModalOpen(true); }} className="text-xs text-blue-600">Edit</button>
                                    <button onClick={() => handleDelete("testimonials", t._id)} className="text-xs text-red-600">Delete</button>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 italic">"{t.text}"</p>
                        </div>
                    ))}
                </div>
              </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm z-50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-800 dark:border dark:border-zinc-700 overflow-y-auto max-h-[90vh]">
            <h3 className="mb-4 text-xl font-bold capitalize text-zinc-900 dark:text-zinc-100">
              {editingItem._id ? "Edit" : "Add"} {modalType}
            </h3>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              
              {modalType === "product" && (
                <>
                  <input placeholder="Title" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.title || ""} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <textarea placeholder="Description" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.description || ""} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                  <input type="number" placeholder="Price" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.price || ""} onChange={e => setEditingItem({...editingItem, price: e.target.value})} />
                  
                  {/* File Upload */}
                  <div className="border p-2 rounded dark:border-zinc-600">
                      <label className="block text-sm text-zinc-500 mb-1">Main Image</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="w-full text-sm" />
                      {uploading && <span className="text-xs text-blue-500">Uploading...</span>}
                      {editingItem.imageUrl && <img src={editingItem.imageUrl} alt="preview" className="h-20 w-auto mt-2 rounded border" />}
                  </div>

                  <div className="border p-2 rounded dark:border-zinc-600">
                      <label className="block text-sm text-zinc-500 mb-1">Gallery Images</label>
                      <input type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, true)} className="w-full text-sm" />
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {editingItem.images?.map((img: string, i: number) => (
                            <img key={i} src={img} alt="gallery" className="h-16 w-16 object-cover rounded border" />
                        ))}
                      </div>
                  </div>

                  <input placeholder="Category ID or Name" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.category || ""} onChange={e => setEditingItem({...editingItem, category: e.target.value})} />
                  <div className="flex gap-2">
                      <input type="number" placeholder="Stock" required className="w-1/2 rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.stock || ""} onChange={e => setEditingItem({...editingItem, stock: e.target.value})} />
                      <label className="flex items-center gap-2 w-1/2">
                        <input type="checkbox" checked={editingItem.inStock ?? true} onChange={e => setEditingItem({...editingItem, inStock: e.target.checked})} />
                        In Stock
                      </label>
                  </div>
                </>
              )}

              {modalType === "category" && (
                <>
                  <input placeholder="Name" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.name || ""} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editingItem.isActive ?? true} onChange={e => setEditingItem({...editingItem, isActive: e.target.checked})} />
                    Active
                  </label>
                </>
              )}

              {modalType === "banner" && (
                <>
                  <input placeholder="Title (Optional)" className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.title || ""} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  <div className="border p-2 rounded dark:border-zinc-600">
                      <label className="block text-sm text-zinc-500 mb-1">Banner Image</label>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, false)} className="w-full text-sm" />
                      {uploading && <span className="text-xs text-blue-500">Uploading...</span>}
                      {editingItem.imageUrl && <img src={editingItem.imageUrl} alt="preview" className="h-20 w-auto mt-2 rounded border" />}
                  </div>
                  <input placeholder="Link (Optional)" className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.link || ""} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editingItem.isActive ?? true} onChange={e => setEditingItem({...editingItem, isActive: e.target.checked})} />
                    Active
                  </label>
                </>
              )}

              {modalType === "testimonial" && (
                <>
                  <input placeholder="Name" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.name || ""} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <textarea placeholder="Text" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.text || ""} onChange={e => setEditingItem({...editingItem, text: e.target.value})} />
                  <input type="number" min="1" max="5" placeholder="Rating (1-5)" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.rating || 5} onChange={e => setEditingItem({...editingItem, rating: e.target.value})} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editingItem.isActive ?? true} onChange={e => setEditingItem({...editingItem, isActive: e.target.checked})} />
                    Active
                  </label>
                </>
              )}

              {modalType === "review" && (
                <>
                  <label className="text-sm text-zinc-500">Select Product</label>
                  <select 
                    required 
                    className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600"
                    value={editingItem.productId || ""} 
                    onChange={e => setEditingItem({...editingItem, productId: e.target.value})}
                  >
                      <option value="">-- Select Product --</option>
                      {products.map(p => (
                          <option key={p._id} value={p._id}>{p.title}</option>
                      ))}
                  </select>
                  <input placeholder="User Name (Optional)" className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.userName || ""} onChange={e => setEditingItem({...editingItem, userName: e.target.value})} />
                  <textarea placeholder="Review Content" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.content || ""} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                  <input type="number" min="1" max="5" placeholder="Rating (1-5)" required className="rounded border p-2 dark:bg-zinc-700 dark:border-zinc-600" value={editingItem.rating || 5} onChange={e => setEditingItem({...editingItem, rating: e.target.value})} />
                </>
              )}

              <div className="mt-4 flex gap-2">
                <button type="submit" disabled={uploading} className="flex-1 rounded bg-zinc-900 py-2 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded bg-zinc-200 py-2 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
