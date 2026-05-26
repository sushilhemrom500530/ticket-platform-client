"use client";

import { Mail } from "lucide-react";
import { useState } from "react";


export function NewsLetter() {
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) setSubscribed(true);
    };

    return (
        <section className="container mx-auto px-6 pt-14 max-w-2xl text-center">
            <div className="bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl p-10 shadow-xl shadow-blue-200 relative overflow-hidden">
                {/* Subtle background waves */}
                <div className="absolute top-[-50px] right-[-50px] w-64 h-64 rounded-full bg-white/10 blur-xl pointer-events-none z-0 animate-float-1" />
                <div className="absolute bottom-[-70px] left-[-70px] w-72 h-72 rounded-full bg-blue-400/20 blur-xl pointer-events-none z-0 animate-float-2" />

                <div className="relative z-10">
                    <Mail className="w-8 h-8 text-white/80 mx-auto mb-3" />
                    <h2 className="text-2xl font-bold text-white mb-2">
                        Never Miss an Event
                    </h2>
                    <p className="text-blue-100 text-sm mb-6">
                        Get personalized event recommendations and early access to ticket
                        sales.
                    </p>
                    {subscribed ? (
                        <div className="bg-white/20 text-white font-semibold py-3 px-6 rounded-xl inline-block">
                            ✅ You&apos;re subscribed! Check your inbox.
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubscribe}
                            className="flex gap-2 max-w-md mx-auto"
                        >
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/15 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:border-white transition"
                            />
                            <button
                                type="submit"
                                className="bg-white text-blue-600 font-semibold px-5 py-3 rounded-xl hover:bg-blue-50 transition whitespace-nowrap"
                            >
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}