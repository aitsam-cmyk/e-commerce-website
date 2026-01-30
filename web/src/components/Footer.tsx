import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 sm:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg">Policies</h3>
          <ul className="mt-2 space-y-2 text-sm text-zinc-600">
            <li><Link href="/shipping">Shipping Policy</Link></li>
            <li><Link href="/returns">Return Policy</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg">Payments</h3>
          <p className="mt-2 text-sm text-zinc-600">Easypaisa • JazzCash • Bank Transfer • COD</p>
          <div className="mt-3 text-xs text-zinc-500">Secure Checkout</div>
        </div>
        <div>
          <h3 className="font-serif text-lg">Newsletter</h3>
          <form className="mt-2 flex gap-2">
            <input className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm" placeholder="Email address" />
            <button className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white">Subscribe</button>
          </form>
        </div>
      </div>
    </footer>
  );
}
