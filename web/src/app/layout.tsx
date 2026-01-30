"use client"; // Isko client component banana zaroori hai auth check ke liye
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 1. Session Storage logic: Refresh hone par logout karwane ke liye
    // Agar aap chahte hain ke user hamesha login rahe toh localStorage use karein
    const token = localStorage.getItem("token");

    // 2. Protected Routes check:
    // Agar user logged in nahi hai aur wo checkout ya profile par jane ki koshish kare
    const privateRoutes = ["/checkout", "/profile", "/orders"];
    if (!token && privateRoutes.includes(pathname)) {
      alert("Pehle login karein!");
      router.push("/login");
    }

    // 3. Optional: Har refresh par token clear karne ke liye (Aapki request ke mutabiq)
    // window.onbeforeunload = () => {
    //   localStorage.removeItem("token");
    // };

  }, [pathname, router]);

  return (
    <html lang="en">
      <body className={`antialiased ${inter.variable} ${playfair.variable} font-sans bg-background text-foreground`}>
        <NavBar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}