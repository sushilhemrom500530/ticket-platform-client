import HeroSection from "@/src/components/home/hero";
import { StatsBar } from "@/src/components/home/stats";
import CategorySection from "@/src/components/home/category";
import UpcomingEvent from "@/src/components/home/upcomming-event";
import { HowItWorks } from "@/src/components/home/how-it-works";
import TrendingEvents from "@/src/components/home/tranding-events";
import { PremiumEvents } from "@/src/components/home/premium-events";
import { FreeEvents } from "@/src/components/home/free-events";
import { Testimonials } from "@/src/components/home/testimonials";
import { NewsLetter } from "@/src/components/home/news-letter";




export default function Home() {
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
      <HowItWorks />

      {/*  Trending Events */}
      <TrendingEvents />

      {/*  Premium Events */}
      <PremiumEvents />

      {/*  Free Events */}
      <FreeEvents />

      {/*  Testimonials */}
      <Testimonials />

      {/*  Newsletter */}
      <NewsLetter />
    </div>
  );
}
