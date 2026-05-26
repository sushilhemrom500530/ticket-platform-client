"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/src/services/api";
import EventCard from "@/src/components/EventCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
import HeroSection from "@/src/components/home/hero";
import { StatsBar } from "@/src/components/home/stats";
import CategorySection from "@/src/components/home/category";
import UpcomingEvent from "@/src/components/home/upcomming-event";




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
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventsRes, categoriesRes] = await Promise.all([
          api.get("/events?limit=10"),
          api.get("/categories"),
        ]);
        setEvents(eventsRes.data.data.results || []);
        setCategories(categoriesRes.data.data || []);
      } catch (error: any) {
        if (error.message === "Network Error") {
          // Suppress Network Error to avoid console spam when server is down
          return;
        }
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

  const searchParams = useSearchParams();
  const catQuery = searchParams.get("category") || "";

  const activeCategoryObj = categories.find(
    c => c.name.toLowerCase() === catQuery.toLowerCase() ||
      (catQuery.toLowerCase() === "shows" && c.name.toLowerCase() === "comedy")
  );
  const resolvedCategoryId = activeCategoryObj ? activeCategoryObj._id : null;
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.name : (catQuery || null);

  const heroSettings = {
    Sports: {
      bg: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070",
      title: "Sports Tickets",
      subtitle: "Discover the best tickets to Sports events."
    },
    Music: {
      bg: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2074",
      title: "Concert Tickets",
      subtitle: "Discover the best tickets to live music events."
    },
    Comedy: {
      bg: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=2069",
      title: "Comedy & Theatre",
      subtitle: "Discover the best tickets to comedy and stage plays."
    },
    default: {
      bg: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070",
      title: "Live Event Tickets",
      subtitle: "Discover the best tickets to sports, concerts, and live shows."
    }
  };

  const currentHero = (activeCategoryName && heroSettings[activeCategoryName as keyof typeof heroSettings])
    ? heroSettings[activeCategoryName as keyof typeof heroSettings]
    : heroSettings.default;

  // Filtered events based on search + category
  const filtered = events.filter((e) => {
    const matchesSearch = searchQuery
      ? e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesCat = resolvedCategoryId
      ? e.category === resolvedCategoryId || e.category?._id === resolvedCategoryId
      : true;
    return matchesSearch && matchesCat;
  });

  const featuredEvents = (
    searchQuery || resolvedCategoryId ? filtered : events
  ).slice(0, 3);

  const carouselEvents = [
    {
      _id: "default-1",
      title: "Discover Amazing Concerts & Festivals",
      description: "Book tickets to the best concerts, live music events, and workshops in your city with premium experiences.",
      category: "Concerts",
      coverImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070"
    },
    {
      _id: "default-2",
      title: "Exclusive Sports & Gaming Tournaments",
      description: "Catch the action live at elite stadiums and venues around the country. Secure your spots early.",
      category: "Sports",
      coverImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070"
    },
    {
      _id: "default-3",
      title: "Interactive Theatre & Comedy Shows Interactive Theatre & Comedy Shows",
      description: "Experience absolute laughter and dramatic arts from world-class creators and performers in high-end venues.Experience absolute laughter and dramatic arts from world-class creators and performers in high-end venues.",
      category: "Comedy",
      coverImage: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=2069"
    }
  ];

  const filteredCarousel = resolvedCategoryId
    ? events.filter(e => e.category === resolvedCategoryId || e.category?._id === resolvedCategoryId)
    : events;

  const activeCarouselEvents = carouselEvents.length > 0
    ? carouselEvents.slice(0, 4)
    : carouselEvents;

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
      {/*  Hero */}
      <HeroSection />

      <StatsBar />

      {/*  Categories */}
      <CategorySection />

      {/*   Countdown Banner */}
      <UpcomingEvent />


      {/*  How It Works */}
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

      {/*  Trending Events */}
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

      {/*  Premium Events */}
      {premiumEvents.length > 0 && (
        <section className="relative overflow-hidden bg-linear-to-br from-slate-50 to-indigo-50/40 py-16 border-t border-b border-slate-200/60">
          {/* Radial blobs */}
          <div className="absolute top-[-50px] left-[5%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.12)_0%,rgba(99,102,241,0)_70%)] blur-2xl pointer-events-none z-0 animate-float-1" />
          <div className="absolute bottom-[-100px] right-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,rgba(59,130,246,0)_70%)] blur-2xl pointer-events-none z-0 animate-float-2" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                💎 Premium Experiences
              </h2>
              <Link
                href="/events?type=premium"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
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

      {/*  Free Events */}
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

      {/*  Testimonials */}
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

      {/*  Newsletter */}
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
    </div>
  );
}
