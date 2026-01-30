import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 sm:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg">Policies</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-300">
            <li><Link href="/shipping">Shipping Policy</Link></li>
            <li><Link href="/returns">Return Policy</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg">Payments</h3>
          <p className="mt-2 text-sm text-zinc-300">Easypaisa • JazzCash • Bank Transfer • COD</p>
          <div className="mt-3 text-xs text-zinc-400">Secure Checkout</div>
        </div>
        <div>
          <h3 className="font-serif text-lg">Newsletter</h3>
          <form className="mt-2 flex gap-2">
            <input className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm placeholder:text-zinc-400" placeholder="Email address" />
            <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500">Subscribe</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
