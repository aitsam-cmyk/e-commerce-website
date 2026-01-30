"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Review {
    _id: string;
    userName?: string;
    rating: number;
    content: string;
    createdAt: string;
}

export default function ReviewsSection({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setLoggedIn(true);
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/reviews/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
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
            toast.error("Please login to review");
            return;
        }

        setSubmitting(true);
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
            const res = await fetch(`${base}/api/reviews/${productId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ rating, content })
            });

            if (res.ok) {
                toast.success("Review submitted!");
                setContent("");
                setRating(5);
                fetchReviews();
            } else {
                toast.error("Failed to submit review");
            }
        } catch (error) {
            toast.error("Error submitting review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mt-16 border-t border-zinc-200 dark:border-zinc-800 pt-10">
            <Toaster />
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Customer Reviews</h2>

            <div className="grid gap-10 md:grid-cols-2">
                {/* Reviews List */}
                <div className="space-y-6">
                    {loading ? (
                        <p className="text-zinc-500 dark:text-zinc-400">Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-zinc-500 dark:text-zinc-400">No reviews yet. Be the first to review!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {review.userName || "Anonymous"} • {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-zinc-700 dark:text-zinc-300">{review.content}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Review Form */}
                <div className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-xl h-fit">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Write a Review</h3>
                    {!loggedIn ? (
                        <p className="text-zinc-600 dark:text-zinc-400">Please <a href="/login" className="text-blue-500 hover:underline">login</a> to write a review.</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Review</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full rounded-md bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}