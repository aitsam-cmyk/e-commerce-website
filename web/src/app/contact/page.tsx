"use client";
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
      <form 
        action="https://formspree.io/f/xrekadda" 
        method="POST" 
        className="space-y-4"
      >
        <input name="name" type="text" placeholder="Aapka Naam" className="w-full border p-2 rounded" required />
        <input name="email" type="email" placeholder="Aapka Email" className="w-full border p-2 rounded" required />
        <textarea name="message" placeholder="Message likhein..." className="w-full border p-2 rounded h-32" required />
        <button type="submit" className="w-full bg-zinc-900 text-white p-2 rounded hover:bg-black">
          Send Message
        </button>
      </form>
    </div>
  );
}