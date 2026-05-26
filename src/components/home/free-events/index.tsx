"use client";

import api from "@/src/services/api";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EventCard from "../../EventCard";

export function FreeEvents() {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [eventsRes] = await Promise.all([
                    api.get("/events?limit=10"),
                ]);
                setEvents(eventsRes.data.data.results || []);
            } catch (error: any) {
                console.error("Failed to load home data", error);
            }
        };
        fetchHomeData();
    }, []);


    const freeEvents = events.filter((e) => !e.isPremium).slice(0, 3);

    return (
        <section>
            {freeEvents.length > 0 && (
                <section className="container mx-auto px-6 pt-14">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">🆓 Free Events</h2>
                        <Link
                            href="/events?type=free"
                            className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {freeEvents.map((event: any) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                </section>
            )}
        </section>
    )
}