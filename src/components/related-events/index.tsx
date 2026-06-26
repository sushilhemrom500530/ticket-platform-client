"use client";

import { useEffect, useState } from "react";
import api from "@/src/services/api";
import EventCard from "@/src/components/reuseable/event-card";

interface RelatedEventsProps {
  currentEvent: any;
}

export default function RelatedEvents({ currentEvent }: RelatedEventsProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentEvent?._id) return;

    const fetchRelatedEvents = async () => {
      setLoading(true);
      try {
        // Fetch events in the same category
        const categoryId = currentEvent.categoryId?._id || currentEvent.categoryId;
        let url = `/events?categoryId=${categoryId}&limit=10`;
        const res = await api.get(url);
        let fetched = res.data.data.results || [];

        // Exclude current event
        fetched = fetched.filter((e: any) => e._id !== currentEvent._id);

        // Sort to prioritize same "type" (premium vs free) and name similarity if possible
        fetched.sort((a: any, b: any) => {
          const aSameType = a.isPremium === currentEvent.isPremium ? 1 : 0;
          const bSameType = b.isPremium === currentEvent.isPremium ? 1 : 0;
          
          if (bSameType !== aSameType) {
            return bSameType - aSameType;
          }
          
          // Secondary sort: if title includes some words from the current event title
          const getMatchScore = (title: string) => {
            const words = currentEvent.title.toLowerCase().split(" ");
            let score = 0;
            words.forEach((w: string) => {
              if (w.length > 3 && title.toLowerCase().includes(w)) score++;
            });
            return score;
          };
          
          return getMatchScore(b.title || "") - getMatchScore(a.title || "");
        });

        // Limit to 3
        setEvents(fetched.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch related events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [currentEvent]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-6 py-16 border-t border-gray-200 mt-12">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">You Might Also Like</h2>
          <p className="text-gray-500 text-lg">More events similar to {currentEvent.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}