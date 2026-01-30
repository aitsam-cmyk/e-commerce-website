"use client"; // <--- ADD THIS LINE

import Image from "next/image";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1544972019-b8cf5f2c41b3?q=80&w=1200&auto=format&fit=crop",
    alt: "Fashion"
  },
  {
    src: "https://images.unsplash.com/photo-1511389026070-a14ae610a1bf?q=80&w=1200&auto=format&fit=crop",
    alt: "Electronics"
  },
  {
    src: "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop",
    alt: "Lifestyle"
  }
];

export default function Slider() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="flex animate-slide">
        {slides.map((s, i) => (
          <div key={i} className="min-w-full">
            <Image src={s.src} alt={s.alt} width={1200} height={500} className="h-64 w-full object-cover" />
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(0%); }
          33% { transform: translateX(-100%); }
          66% { transform: translateX(-200%); }
          100% { transform: translateX(0%); }
        }
        .animate-slide {
          animation: slide 12s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}