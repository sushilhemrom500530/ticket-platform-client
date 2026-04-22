"use client";
import { useEffect, useState, Suspense } from "react";
import api from "@/src/services/api";
import EventCard from "@/src/components/EventCard";
import { Select, Input } from "antd";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

function EventsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || undefined;
  
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(initialCategory);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then(res => setCategories(res.data.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        let url = `/events?limit=50`;
        if (categoryFilter) url += `&categoryId=${categoryFilter}`;
        if (typeFilter !== "all") url += `&isPremium=${typeFilter === "premium"}`;
        if (search) url += `&search=${search}`;
        
        const res = await api.get(url);
        setEvents(res.data.data.results || []);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    
    // debounce search
    const timer = setTimeout(fetchEvents, 300);
    return () => clearTimeout(timer);
  }, [categoryFilter, typeFilter, search]);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Discover Events</h1>
        <p className="text-gray-500 text-lg">Find the perfect event matching your interests.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input 
            size="large"
            placeholder="Search events by title..." 
            prefix={<Search className="text-gray-400 w-5 h-5 mr-2" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl h-12"
          />
        </div>
        <Select
          size="large"
          className="w-full md:w-64 h-12"
          placeholder="Category"
          value={categoryFilter}
          onChange={setCategoryFilter}
          allowClear
          options={categories.map(c => ({ label: c.name, value: c._id }))}
        />
        <Select
          size="large"
          className="w-full md:w-48 h-12"
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { label: "All Types", value: "all" },
            { label: "Premium Only", value: "premium" },
            { label: "Free Only", value: "free" },
          ]}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <h3 className="text-xl font-medium text-gray-600 mb-2">No events found</h3>
          <p className="text-gray-400">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
      <EventsContent />
    </Suspense>
  );
}
