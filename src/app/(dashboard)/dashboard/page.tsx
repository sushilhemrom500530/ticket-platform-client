"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, Statistic, Row, Col, Button, Table, Tag, Space } from "antd";
import { Ticket, CalendarDays, Heart, Bell, User } from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    ticketsSold: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentTickets: [],
    salesProgress: [],
    myTickets: 0,
    myFavorites: 0,
    myNotifications: 0
  });
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        if (user.role === "admin") {
          const response = await api.get("/reports/dashboard-stats");
          setStats((prev) => ({
            ...prev,
            ...response.data.data
          }));
        } else {
          // Fetch user specific stats
          const [ticketsRes, favoritesRes, notificationsRes] = await Promise.all([
            api.get("/tickets/my"),
            api.get("/favorites/my"),
            api.get("/notifications/my"),
          ]);

          setStats((prev) => ({
            ...prev,
            myTickets: ticketsRes.data.data.length || 0,
            myFavorites: favoritesRes.data.data.length || 0,
            myNotifications: notificationsRes.data.data.filter((n: any) => !n.isRead).length || 0,
          }));
        }
      } catch (error) {
        console.error("Failed to load statistics", error);
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
        <p className="text-gray-500 font-medium text-xl">Verifying access...</p>
      </div>
    );
  }

  if (user?.role === "admin") {
    const chartOptions: any = {
      chart: {
        id: "sales-progress",
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      xaxis: {
        categories: stats.salesProgress.map((s: any) => s.date),
      },
      colors: ["#3b82f6"],
      stroke: { curve: "smooth", width: 3 },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [50, 100, 100],
        },
      },
      dataLabels: { enabled: false },
    };

    const chartSeries = [
      {
        name: "Tickets Sold",
        data: stats.salesProgress.map((s: any) => s.count),
      },
    ];

    const columns = [
      {
        title: "Ticket ID",
        dataIndex: "ticketId",
        key: "ticketId",
        render: (text: string) => <span className="font-mono text-xs font-bold">{text}</span>,
      },
      {
        title: "User",
        dataIndex: "userId",
        key: "user",
        render: (user: any) => (
          <div>
            <div className="font-medium">{user?.fullName}</div>
            <div className="text-xs text-gray-500">{user?.email}</div>
          </div>
        ),
      },
      {
        title: "Event",
        dataIndex: "eventId",
        key: "event",
        render: (event: any) => <span className="text-gray-600">{event?.title}</span>,
      },
      {
        title: "Total",
        dataIndex: "totalPrice",
        key: "total",
        render: (price: number) => <span className="font-bold text-green-600">${price.toFixed(2)}</span>,
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status: string) => (
          <Tag color={status === "active" ? "green" : "red"}>{status.toUpperCase()}</Tag>
        ),
      },
    ];

    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Global platform overview and statistics</p>
        </div>

        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12} md={6}>
            <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
              <Statistic
                title="Total Events"
                value={stats.totalEvents}
                prefix={<CalendarDays className="mr-3 text-blue-500 w-10 h-10 p-2 bg-blue-50 rounded-xl" />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
              <Statistic
                title="Tickets Sold"
                value={stats.ticketsSold}
                prefix={<Ticket className="mr-3 text-emerald-500 w-10 h-10 p-2 bg-emerald-50 rounded-xl" />}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
              <Statistic
                title="Revenue"
                value={stats.totalRevenue}
                precision={2}
                prefix={<span className="mr-3 text-amber-500 w-10 h-10 p-2 bg-amber-50 rounded-xl flex items-center justify-center font-bold">$</span>}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
              <Statistic
                title="Categories"
                value={stats.totalCategories}
                prefix={<Tag className="mr-3 text-purple-500 w-10 h-10 p-2 bg-purple-50 rounded-xl" />}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Col span={24} lg={16}>
            <Card title="Ticket Sale Progress" variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl h-full">
              <Chart options={chartOptions} series={chartSeries} type="area" height={300} />
            </Card>
          </Col>
          <Col span={24} lg={8}>
            <Card title="Quick Summary" variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl h-full">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <User className="text-gray-400" size={20} />
                    <span className="text-gray-600 font-medium">Total Users</span>
                  </div>
                  <span className="text-xl font-bold">{stats.totalUsers}</span>
                </div>
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl">
                  <div className="text-sm opacity-80">Platform Status</div>
                  <div className="text-lg font-bold">Operational</div>
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl">
                  <div className="text-sm opacity-80">Sync Status</div>
                  <div className="text-lg font-bold">All caught up</div>
                </div>
              </div>
            </Card>
          </Col>
        </div>

        <div className="mt-6">
          <Card 
            title={<div className="flex items-center justify-between">
              <span>Recent Ticket Purchases</span>
              <Button type="link" className="text-blue-600">View All</Button>
            </div>} 
            variant="borderless" 
            className="shadow-sm border border-gray-100 rounded-2xl"
          >
            <Table 
              dataSource={stats.recentTickets} 
              columns={columns} 
              pagination={false} 
              loading={loading}
              rowKey="_id"
            />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.fullName}!</h1>
        <p className="text-gray-500 mt-2">Here is what's happening with your account.</p>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <Statistic
              title="My Tickets"
              value={stats.myTickets}
              prefix={<Ticket className="mr-3 text-blue-500 w-8 h-8 p-1.5 bg-blue-50 rounded-lg" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <Statistic
              title="Favorites"
              value={stats.myFavorites}
              prefix={<Heart className="mr-3 text-pink-500 w-8 h-8 p-1.5 bg-pink-50 rounded-lg" />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300">
            <Statistic
              title="Notifications"
              value={stats.myNotifications}
              prefix={<Bell className="mr-3 text-orange-500 w-8 h-8 p-1.5 bg-orange-50 rounded-lg" />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Activity" variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <CalendarDays className="w-12 h-12 mb-3 opacity-20" />
            <p>No recent activity found</p>
          </div>
        </Card>
        
        <Card title="Quick Actions" variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-medium flex flex-col items-center gap-2">
              <Ticket className="w-6 h-6" />
              <span>Buy Tickets</span>
            </button>
            <button className="p-4 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition font-medium flex flex-col items-center gap-2">
              <User className="w-6 h-6" />
              <span>Update Profile</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
