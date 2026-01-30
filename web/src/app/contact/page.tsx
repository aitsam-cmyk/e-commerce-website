"use client";
export default function ContactPage() {
  return (
    <section className="auth-hero">
      <div className="mx-auto max-w-md px-4 py-10 w-full">
        <div className="card rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-bold mb-6">Contact Us</h1>
          <form 
            action="https://formspree.io/f/xrekadda" 
            method="POST" 
            className="space-y-4"
          >
            <input name="name" type="text" placeholder="Your Name" className="w-full border p-2 rounded" required />
            <input name="email" type="email" placeholder="Your Email" className="w-full border p-2 rounded" required />
            <textarea name="message" placeholder="Write your message..." className="w-full border p-2 rounded h-32" required />
            <button type="submit" className="w-full bg-zinc-900 text-white p-2 rounded hover:bg-zinc-800">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
