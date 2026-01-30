 "use client";
 import { useEffect, useState } from "react";
 
 export default function ThemeToggle() {
   const [theme, setTheme] = useState<"light" | "dark">("light");
 
   useEffect(() => {
     const saved = (localStorage.getItem("theme") as "light" | "dark") || "light";
     setTheme(saved);
     document.documentElement.setAttribute("data-theme", saved);
   }, []);
 
   function toggle() {
     const next = theme === "light" ? "dark" : "light";
     setTheme(next);
     localStorage.setItem("theme", next);
     document.documentElement.setAttribute("data-theme", next);
   }
 
   return (
     <button onClick={toggle} className="rounded-full px-3 py-2 text-sm border border-zinc-300 hover:bg-zinc-100">
       {theme === "light" ? "Dark" : "Light"} Mode
     </button>
   );
 }
