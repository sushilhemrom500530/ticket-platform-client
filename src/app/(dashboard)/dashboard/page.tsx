"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, Statistic, Row, Col, message } from "antd";
import { Ticket, CalendarDays, List, Users } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    events: 0,
    tickets: 0,
    categories: 0,
    users: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    const fetchStats = async () => {
      try {
        const [eventsRes, ticketsRes, categoriesRes] = await Promise.all([
          api.get("/events?limit=1"),
          api.get("/tickets/all?limit=10000"), // Temporary logic to calculate revenue, ideally handled by backend stats endpoint
          api.get("/categories"),
        ]);

        const events = eventsRes.data.data.meta.totalResult || 0;
        const allTickets = ticketsRes.data.data.results || [];
        const ticketsSold = allTickets.reduce((sum: number, t: any) => sum + t.quantity, 0);
        const revenue = allTickets.reduce((sum: number, t: any) => sum + t.totalPrice, 0);
        const categories = categoriesRes.data.data.length || 0;

        setStats({
          events,
          tickets: ticketsSold,
          revenue,
          categories,
          users: 0, // Placeholder
        });
      } catch (error) {
        message.error("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (isAuthenticated && !user) {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 font-medium text-xl">Verifying admin access...</p>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 text-red-500 p-10 rounded-3xl inline-block shadow-lg border border-red-100 max-w-md">
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-lg opacity-80">You do not have the required permissions to view this dashboard. Admins only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard Overview</h1>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition">
            <Statistic
              title="Total Events"
              value={stats.events}
              prefix={<CalendarDays className="mr-2 text-blue-500" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition">
            <Statistic
              title="Tickets Sold"
              value={stats.tickets}
              prefix={<Ticket className="mr-2 text-green-500" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition">
            <Statistic
              title="Total Revenue"
              value={stats.revenue}
              precision={2}
              prefix="$"
              styles={{ content: { color: '#3f8600' } }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition">
            <Statistic
              title="Categories"
              value={stats.categories}
              prefix={<List className="mr-2 text-purple-500" />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
