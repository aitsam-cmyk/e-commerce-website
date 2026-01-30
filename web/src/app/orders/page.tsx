"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type OrderItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${base}/api/orders/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
           localStorage.removeItem("token");
           router.push("/login");
           return [];
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
            setOrders(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router, base]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 pt-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">My Orders</h1>
            <p className="mt-2 text-zinc-500">Track and manage your recent purchases.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
            Continue Shopping &rarr;
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
            <h3 className="text-lg font-medium text-zinc-900">No orders yet</h3>
            <p className="mt-2 text-zinc-500">You haven't placed any orders yet. Start shopping now!</p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 px-6 py-4">
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="block font-medium text-zinc-500">Order Placed</span>
                      <span className="font-semibold text-zinc-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="block font-medium text-zinc-500">Total Amount</span>
                      <span className="font-semibold text-zinc-900">Rs {order.totalAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block font-medium text-zinc-500">Order ID</span>
                      <span className="font-mono text-zinc-900">#{order._id.slice(-6)}</span>
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                      order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'cancelled' || order.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </div>
                </div>

                <div className="p-6">
                  <ul className="divide-y divide-zinc-100">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex py-4 first:pt-0 last:pb-0">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover object-center"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-zinc-400">
                              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-6 flex flex-1 flex-col">
                          <div className="flex justify-between text-base font-medium text-zinc-900">
                            <h3>{item.title}</h3>
                            <p className="ml-4">Rs {item.price.toLocaleString()}</p>
                          </div>
                          <p className="mt-1 text-sm text-zinc-500">Qty {item.quantity}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 border-t border-zinc-100 pt-4">
                      <div className="flex justify-between text-sm text-zinc-500">
                          <span>Shipping Address: {order.shippingAddress}</span>
                          <span className="uppercase">Method: {order.paymentMethod}</span>
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}