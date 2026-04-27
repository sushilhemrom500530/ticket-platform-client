"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/src/services/api";
import EventCard from "@/src/components/EventCard";
import Link from "next/link";
import {
  ArrowRight,
  Ticket,
  Star,
  Search,
  Zap,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
  Mail,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";

// ─── Countdown Timer ──────────────────────────────────────────────────────────
function useCountdown(targetDate: string) {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({
  end,
  suffix = "",
}: {
  end: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start = 0;
        const step = Math.ceil(end / 60);
        const id = setInterval(() => {
          start += step;
          if (start >= end) {
            setCount(end);
            clearInterval(id);
          } else setCount(start);
        }, 20);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const TESTIMONIALS = [
  {
    name: "Sarah K.",
    role: "Music Lover",
    text: "Found my favorite band's concert in seconds. The experience from booking to entry was seamless!",
    avatar: "SK",
  },
  {
    name: "James R.",
    role: "Corporate Planner",
    text: "Used this platform for our company workshop. Easy bulk booking and instant e-tickets. Highly recommend.",
    avatar: "JR",
  },
  {
    name: "Priya M.",
    role: "Frequent Attendee",
    text: "The premium section is worth it — exclusive events I can't find anywhere else. Already booked 5 this year.",
    avatar: "PM",
  },
];

const HOW_IT_WORKS = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Discover",
    desc: "Browse thousands of events by category, date, or location.",
  },
  {
    icon: <Ticket className="w-6 h-6" />,
    title: "Book",
    desc: "Select your seats, pay securely, and get instant e-tickets.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Experience",
    desc: "Enjoy the event and share your memories with the community.",
  },
];

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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

  // Testimonial auto-rotate
  useEffect(() => {
    const id = setInterval(
      () => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length),
      4500,
    );
    return () => clearInterval(id);
  }, []);

  // Nearest upcoming event for countdown
  const upcomingEvent = events.find(
    (e) => e.date && new Date(e.date) > new Date(),
  );
  const countdown = useCountdown(
    upcomingEvent?.date || new Date(Date.now() + 86400000 * 7).toISOString(),
  );

  // Filtered events based on search + category
  const filtered = events.filter((e) => {
    const matchesSearch = searchQuery
      ? e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCat = activeCategory
      ? e.category === activeCategory || e.category?._id === activeCategory
      : true;
    return matchesSearch && matchesCat;
  });

  const featuredEvents = (
    searchQuery || activeCategory ? filtered : events
  ).slice(0, 3);
  const premiumEvents = events.filter((e) => e.isPremium).slice(0, 3);
  const freeEvents = events.filter((e) => !e.isPremium).slice(0, 3);
  const trendingEvents = [...events]
    .sort((a, b) => (b.bookings || 0) - (a.bookings || 0))
    .slice(0, 3);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="flex flex-col gap-0 pb-16 bg-gray-50">
      {/* ─── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-150 flex items-center justify-center text-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-blue-950/60 via-gray-900/70 to-gray-900 z-10" />
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          alt="Concert"
        />
        <div className="relative z-20 max-w-3xl px-6 py-20">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> New events added daily
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg leading-tight">
            Discover <span className="text-blue-400">Amazing</span> Events
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Book tickets to the best concerts, workshops, and exclusive premium
            events in your city.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 max-w-xl mx-auto mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events, artists, venues…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition backdrop-blur-sm"
              />
            </div>
            <Link href={searchQuery ? `/events?q=${searchQuery}` : "/events"}>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-600/30 flex items-center gap-2">
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Quick filters */}
          {searchQuery && (
            <p className="text-gray-400 text-sm">
              {filtered.length} events found for{" "}
              <span className="text-white font-medium">"{searchQuery}"</span>
            </p>
          )}
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="bg-blue-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: <Calendar className="w-5 h-5" />,
                value: 1200,
                suffix: "+",
                label: "Events Listed",
              },
              {
                icon: <Users className="w-5 h-5" />,
                value: 85000,
                suffix: "+",
                label: "Happy Attendees",
              },
              {
                icon: <MapPin className="w-5 h-5" />,
                value: 50,
                suffix: "+",
                label: "Cities Covered",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                value: 100,
                suffix: "%",
                label: "Secure Payments",
              },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="opacity-80 mb-1">{stat.icon}</div>
                <div className="text-3xl font-extrabold">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ───────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 pt-14">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900">
          <Ticket className="w-6 h-6 text-blue-500" /> Browse by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-5 py-2 rounded-full font-medium text-sm transition border ${
              activeCategory === null
                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            All Events
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                setActiveCategory(activeCategory === cat._id ? null : cat._id)
              }
              className={`px-5 py-2 rounded-full font-medium text-sm transition border ${
                activeCategory === cat._id
                  ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                  : "bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Countdown Banner ─────────────────────────────────────────────────── */}
      {upcomingEvent && (
        <section className="container mx-auto px-6 pt-10">
          <div className="bg-linear-to-r from-gray-900 to-blue-950 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Next Event Starting In
              </p>
              <h3 className="text-white text-xl md:text-2xl font-bold">
                {upcomingEvent.title}
              </h3>
            </div>
            <div className="flex gap-4 text-center">
              {[
                { val: countdown.days, label: "Days" },
                { val: countdown.hours, label: "Hours" },
                { val: countdown.minutes, label: "Mins" },
                { val: countdown.seconds, label: "Secs" },
              ].map(({ val, label }) => (
                <div
                  key={label}
                  className="bg-white/10 rounded-xl px-4 py-3 min-w-16"
                >
                  <div className="text-3xl font-extrabold text-white tabular-nums">
                    {String(val).padStart(2, "0")}
                  </div>
                  <div className="text-blue-300 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
            <Link href={`/events/${upcomingEvent._id}`}>
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition whitespace-nowrap">
                Get Tickets
              </button>
            </Link>
          </div>
        </section>
      )}

      {/* ─── Featured Events ──────────────────────────────────────────────────── */}
      {featuredEvents.length > 0 && (
        <section className="container mx-auto px-6 pt-14">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
              <Star className="w-6 h-6 text-yellow-500" />
              {searchQuery || activeCategory
                ? "Search Results"
                : "Featured Events"}
            </h2>
            <Link
              href="/events"
              className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* ─── How It Works ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 pt-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm text-center hover:shadow-md transition group"
            >
              <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                <div className="text-blue-600 group-hover:text-white transition-colors">
                  {step.icon}
                </div>
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
                Step {i + 1}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Trending Events ──────────────────────────────────────────────────── */}
      {trendingEvents.length > 0 && (
        <section className="bg-white py-14 mt-14 border-t border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900">
                <TrendingUp className="w-6 h-6 text-rose-500" /> Trending Now
              </h2>
              <Link
                href="/events"
                className="text-blue-600 hover:underline font-medium text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingEvents.map((event, i) => (
                <div key={event._id} className="relative">
                  {i === 0 && (
                    <span className="absolute -top-2 -left-2 z-10 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      🔥 Hot
                    </span>
                  )}
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Premium Events ───────────────────────────────────────────────────── */}
      {premiumEvents.length > 0 && (
        <section className="bg-linear-to-br from-gray-900 to-blue-950 py-16">
          <div className="container mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                💎 Premium Experiences
              </h2>
              <Link
                href="/events?type=premium"
                className="text-blue-300 hover:text-blue-200 font-medium text-sm flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Free Events ──────────────────────────────────────────────────────── */}
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
            {freeEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* ─── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="bg-blue-50 py-16 mt-14">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">
            What Attendees Say
          </h2>
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 transition-all duration-500">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-sm">
                {TESTIMONIALS[testimonialIdx].avatar}
              </div>
              <p className="text-gray-700 italic mb-5 leading-relaxed text-lg">
                "{TESTIMONIALS[testimonialIdx].text}"
              </p>
              <div className="font-semibold text-gray-900">
                {TESTIMONIALS[testimonialIdx].name}
              </div>
              <div className="text-blue-500 text-sm">
                {TESTIMONIALS[testimonialIdx].role}
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-5">
              <button
                onClick={() =>
                  setTestimonialIdx(
                    (i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                  )
                }
                className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-blue-50 flex items-center justify-center transition"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all mt-3 ${i === testimonialIdx ? "bg-blue-600 w-6" : "bg-gray-300"}`}
                />
              ))}
              <button
                onClick={() =>
                  setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)
                }
                className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-blue-50 flex items-center justify-center transition"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Newsletter ───────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 pt-14 max-w-2xl text-center">
        <div className="bg-linear-to-r from-blue-600 to-blue-500 rounded-2xl p-10 shadow-xl shadow-blue-200">
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
      </section>
    </div>
  );
}
