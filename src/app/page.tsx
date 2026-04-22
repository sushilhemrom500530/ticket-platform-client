"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import EventCard from "@/src/components/EventCard";
import { Button } from "antd";
import Link from "next/link";
import { ArrowRight, Ticket, Star } from "lucide-react";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventsRes, categoriesRes] = await Promise.all([
          api.get("/events?limit=10"),
          api.get("/categories"),
        ]);
        setEvents(eventsRes.data.data.results || []);
        setCategories(categoriesRes.data.data || []);
      } catch (error) {
        console.error("Failed to load home data", error);
      }
    };
    fetchHomeData();
  }, []);

  const featuredEvents = events.slice(0, 3);
  const premiumEvents = events.filter((e) => e.isPremium).slice(0, 3);
  const freeEvents = events.filter((e) => !e.isPremium).slice(0, 3);

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 to-gray-900/90 z-10"></div>
        <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Concert" />
        <div className="relative z-20 max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            Discover <span className="text-blue-500">Amazing</span> Events
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            Book tickets to the best concerts, workshops, and exclusive premium events in your city.
          </p>
          <Link href="/events">
            <Button type="primary" size="large" className="bg-blue-600 hover:bg-blue-500 h-14 px-10 text-lg rounded-full border-none shadow-lg shadow-blue-500/40">
              Browse Events <ArrowRight className="w-5 h-5 ml-2 inline" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 flex items-center">
          <Ticket className="w-8 h-8 mr-3 text-blue-500" /> Browse by Category
        </h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/events?category=${cat._id}`}>
              <div className="px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md hover:border-blue-400 hover:text-blue-600 transition cursor-pointer font-medium text-gray-700">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold flex items-center">
              <Star className="w-8 h-8 mr-3 text-yellow-500" /> Featured Events
            </h2>
            <Link href="/events" className="text-blue-600 hover:underline font-medium">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Premium Events */}
      {premiumEvents.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">💎 Premium Experiences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {premiumEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Free Events */}
      {freeEvents.length > 0 && (
        <section className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">🆓 Free Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freeEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
