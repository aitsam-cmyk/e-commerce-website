 "use client";
 import { useState } from "react";
 import Link from "next/link";
 
 export default function SignupPage() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
 
   function handleSubmit(e: React.FormEvent) {
     e.preventDefault();
     alert("Signup form submitted");
   }
 
   return (
     <div className="mx-auto max-w-md px-4 py-10">
       <h1 className="text-2xl font-semibold">Signup</h1>
       <form onSubmit={handleSubmit} className="mt-4 space-y-3">
         <input
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Full name"
           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
           required
         />
         <input
           type="email"
           value={email}
           onChange={(e) => setEmail(e.target.value)}
           placeholder="Email"
           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
           required
         />
         <input
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           placeholder="Password"
           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
           required
         />
         <button className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white">Create account</button>
       </form>
       <p className="mt-3 text-sm">
         Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
       </p>
     </div>
   );
 }
