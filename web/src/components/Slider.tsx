"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const slides = [
  { src: "https://images.unsplash.com/photo-1544972019-b8cf5f2c41b3?q=80&w=1200&auto=format&fit=crop", alt: "Fashion" },
  { src: "https://images.unsplash.com/photo-1511389026070-a14ae610a1bf?q=80&w=1200&auto=format&fit=crop", alt: "Electronics" },
  { src: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop", alt: "Lifestyle" }
];

export default function Slider() {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }
  function start() {
    stop();
    timer.current = window.setInterval(() => next(), 5000);
  }
  function stop() {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }
  useEffect(() => {
    start();
    return () => stop();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <div key={i} className="min-w-full">
            <Image src={s.src} alt={s.alt} width={1200} height={500} className="h-64 w-full object-cover" />
            <div className="absolute inset-0 flex items-end justify-start p-6">
              <a href="/products" className="rounded-full bg-black/70 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-black">Shop Now</a>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button onClick={prev} className="m-2 rounded-full bg-black/30 px-3 py-2 text-white transition hover:bg-black/50">‹</button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button onClick={next} className="m-2 rounded-full bg-black/30 px-3 py-2 text-white transition hover:bg-black/50">›</button>
      </div>
    </div>
  );
}
