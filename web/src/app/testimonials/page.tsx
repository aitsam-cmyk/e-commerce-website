"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Testimonial {
    _id: string;
    name: string;
    text: string;
    rating: number;
    createdAt: string;
}

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [rating, setRating] = useState(5);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setLoggedIn(true);
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/testimonials?active=true`);
            if (res.ok) {
                const data = await res.json();
                setTestimonials(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to submit a testimonial");
            return;
        }

        setSubmitting(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/testimonials`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, text, rating })
            });

            if (res.ok) {
                toast.success("Testimonial submitted successfully!");
                setName("");
                setText("");
                setRating(5);
                fetchTestimonials();
            } else {
                toast.error("Failed to submit testimonial");
            }
        } catch (error) {
            toast.error("Error submitting testimonial");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-12">
            <Toaster />
            <div className="mx-auto max-w-5xl">
                <h1 className="text-4xl font-serif font-bold text-center text-zinc-900 dark:text-zinc-100 mb-4">Customer Testimonials</h1>
                <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">See what our customers are saying about LuxeMarket.</p>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                    {loading ? (
                        <p className="text-center col-span-full text-zinc-500">Loading...</p>
                    ) : testimonials.length === 0 ? (
                        <p className="text-center col-span-full text-zinc-500">No testimonials yet.</p>
                    ) : (
                        testimonials.map((t) => (
                            <div key={t._id} className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
                                <div className="flex text-yellow-400 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < t.rating ? "★" : "☆"}</span>
                                    ))}
                                </div>
                                <p className="text-zinc-700 dark:text-zinc-300 mb-4 italic">"{t.text}"</p>
                                <div className="font-bold text-zinc-900 dark:text-zinc-100">- {t.name}</div>
                            </div>
                        ))
                    )}
                </div>

                <div className="max-w-xl mx-auto bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">Share Your Experience</h2>
                    {!loggedIn ? (
                        <div className="text-center">
                            <p className="text-zinc-600 dark:text-zinc-400 mb-4">Please login to share your testimonial.</p>
                            <a href="/login" className="inline-block bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">Login Now</a>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Your Name</label>
                                <input 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Rating</label>
                                <select 
                                    value={rating} 
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Testimonial</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full rounded-md bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? "Submitting..." : "Submit Testimonial"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}