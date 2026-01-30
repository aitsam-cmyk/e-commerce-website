"use client";

import { useEffect, useState } from "react";

type Testimonial = {
  _id: string;
  name: string;
  text: string;
  rating: number;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${base}/api/testimonials?active=true`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
            // Fallback if no DB data
            setTestimonials([
                { _id: "1", name: "Ahsan", text: "Great products and fast delivery!", rating: 5 },
                { _id: "2", name: "Sara", text: "Love the quality and support.", rating: 4 },
                { _id: "3", name: "Bilal", text: "Smooth checkout and good prices.", rating: 5 }
            ]);
        }
      })
      .catch(() => {
         // Fallback on error
         setTestimonials([
            { _id: "1", name: "Ahsan", text: "Great products and fast delivery!", rating: 5 },
            { _id: "2", name: "Sara", text: "Love the quality and support.", rating: 4 },
            { _id: "3", name: "Bilal", text: "Smooth checkout and good prices.", rating: 5 }
        ]);
      });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="text-2xl font-semibold tracking-tight dark:text-zinc-100">Testimonials</h2>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t._id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition hover:scale-[1.02] shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium dark:text-zinc-100">{t.name}</span>
              <span className="text-yellow-500 text-sm">
                {Array.from({ length: t.rating }).map((_, j) => "★").join("")}
                {Array.from({ length: 5 - t.rating }).map((_, j) => <span key={j} className="text-zinc-300 dark:text-zinc-600">★</span>)}
              </span>
            </div>
            <p className="mt-2 text-zinc-600 dark:text-zinc-300">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}