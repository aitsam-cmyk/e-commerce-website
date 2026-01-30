"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    setLoading(true);
    const res = await fetch(`${base}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login Successful");
      router.push("/"); 
    } else {
      alert(data.error || data.message || "Email ya Password galat hai");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold mb-5">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full border p-2 rounded" onChange={(e)=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-black text-white p-2 rounded">{loading ? "Please wait..." : "Login"}</button>
      </form>
    </div>
  );
}
