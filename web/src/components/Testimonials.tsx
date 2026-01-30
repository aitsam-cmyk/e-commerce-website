const testimonials = [
  { name: "Ahsan", text: "Great products and fast delivery!", rating: 5 },
  { name: "Sara", text: "Love the quality and support.", rating: 4 },
  { name: "Bilal", text: "Smooth checkout and good prices.", rating: 5 }
];

export default function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-2xl font-semibold tracking-tight">Testimonials</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:scale-[1.02]">
            <div className="flex items-center gap-2">
              <span className="font-medium">{t.name}</span>
              <span className="text-yellow-500">{Array.from({ length: t.rating }).map((_, j) => "★").join("")}</span>
            </div>
            <p className="mt-2 text-zinc-600">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
