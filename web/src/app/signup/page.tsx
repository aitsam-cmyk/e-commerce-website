"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    setLoading(true);
    const res = await fetch(`${base}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account ban gaya. Ab login karein.");
      router.push("/login");
    } else {
      alert(data.error || data.message || "Signup fail. Shayad email pehle se hai.");
    }
    setLoading(false);
  }

  return (
    <section className="hero-common auth-bg-signup">
      <div className="mx-auto max-w-md px-4 py-10 w-full">
        <div className="card rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold mb-5">Signup</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full border p-2 rounded" onChange={(e)=>setName(e.target.value)} required />
            <input type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={(e)=>setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="w-full border p-2 rounded" onChange={(e)=>setPassword(e.target.value)} required />
            <button disabled={loading} className="w-full bg-zinc-900 text-white p-2 rounded hover:bg-zinc-800">{loading ? "Please wait..." : "Create Account"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}
