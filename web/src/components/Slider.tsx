"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Banner = {
  _id: string;
  imageUrl: string;
  title?: string;
  link?: string;
  altText?: string;
};

const defaultSlides = [
  { _id: "d1", imageUrl: "https://images.unsplash.com/photo-1544972019-b8cf5f2c41b3?q=80&w=1200&auto=format&fit=crop", altText: "Fashion" },
  { _id: "d2", imageUrl: "https://images.unsplash.com/photo-1511389026070-a14ae610a1bf?q=80&w=1200&auto=format&fit=crop", altText: "Electronics" },
  { _id: "d3", imageUrl: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop", altText: "Lifestyle" }
];

export default function Slider() {
  const [banners, setBanners] = useState<Banner[]>(defaultSlides);
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    fetch(`${base}/api/banners`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      })
      .catch((err) => console.error("Failed to fetch banners:", err));
  }, [base]);

  function next() {
    setIndex((i) => (i + 1) % banners.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + banners.length) % banners.length);
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
  }, [banners.length]); // Restart timer if banners change

  // Reset index if banners change to avoid out of bounds
  useEffect(() => {
    setIndex(0);
  }, [banners]);

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("/uploads")) return `${base}${url}`;
    return url;
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl group">
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {banners.map((s) => (
          <div key={s._id} className="min-w-full relative">
            <div className="relative h-64 w-full sm:h-80 md:h-96">
               <Image 
                 src={getImageUrl(s.imageUrl)} 
                 alt={s.altText || s.title || "Banner"} 
                 fill
                 className="object-cover"
                 priority={true}
                 unoptimized // Important for allowing external/local mix without complex config sometimes
               />
            </div>
            {(s.title || s.link) && (
                <div className="absolute inset-0 flex items-end justify-start p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="text-white">
                      {s.title && <h3 className="text-2xl font-bold mb-2">{s.title}</h3>}
                      {s.link ? (
                        <Link href={s.link} className="inline-block rounded-full bg-white/20 px-6 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30 border border-white/30">
                            Shop Now
                        </Link>
                      ) : (
                        <Link href="/products" className="inline-block rounded-full bg-white/20 px-6 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30 border border-white/30">
                            Shop Now
                        </Link>
                      )}
                  </div>
                </div>
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-y-0 left-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={prev} className="m-2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={next} className="m-2 rounded-full bg-black/30 p-2 text-white transition hover:bg-black/50 backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </button>
      </div>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
