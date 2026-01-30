 "use client";
 import { useState } from "react";
 
 export default function ContactPage() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [message, setMessage] = useState("");
 
   function handleSubmit(e: React.FormEvent) {
     e.preventDefault();
     alert("Message sent");
   }
 
   return (
     <div className="mx-auto max-w-md px-4 py-10">
       <h1 className="text-2xl font-semibold">Contact</h1>
       <form onSubmit={handleSubmit} className="mt-4 space-y-3">
         <input
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="Your name"
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
         <textarea
           value={message}
           onChange={(e) => setMessage(e.target.value)}
           placeholder="Message"
           className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm h-28"
           required
         />
         <button className="w-full rounded-md bg-zinc-900 px-4 py-2 text-white">Send</button>
       </form>
     </div>
   );
 }
