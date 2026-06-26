"use client";
import { Card, Row, Col, Statistic, Select, Spin, message } from "antd";
import { BarChart3, TrendingUp, Users, Ticket, DollarSign, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/src/services/api";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/dashboard/analytics");
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        message.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" description="Loading Analytics..." />
      </div>
    );
  }

  const revenueChartOptions: any = {
    chart: {
      id: "revenue-growth",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    grid: {
      show: true,
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
    },
    xaxis: {
      categories: data?.revenueGrowth?.map((item: any) => item.name) || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#64748b", fontFamily: "Inter, sans-serif" }
      }
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontFamily: "Inter, sans-serif" },
        formatter: (val: number) => `$${val.toLocaleString()}`,
      }
    },
    colors: ["#3b82f6"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
      x: { show: true },
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`
      }
    }
  };

  const revenueChartSeries = [
    {
      name: "Revenue",
      data: data?.revenueGrowth?.map((item: any) => item.revenue) || [],
    },
  ];

  const distributionChartOptions: any = {
    chart: {
      id: "user-distribution",
      fontFamily: "Inter, sans-serif",
    },
    labels: data?.userDistribution?.map((item: any) => item.name) || [],
    colors: ["#3b82f6", "#10b981"],
    legend: {
      position: "bottom",
      fontFamily: "Inter, sans-serif",
      labels: {
        colors: "#64748b"
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + "%";
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => {
                const total = data?.userDistribution?.reduce((acc: number, curr: any) => acc + curr.value, 0) || 0;
                return total.toString();
              },
              style: {
                fontSize: "16px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "#374151"
              }
            }
          }
        }
      }
    },
    tooltip: {
      theme: "light",
    }
  };

  const distributionChartSeries = data?.userDistribution?.map((item: any) => item.value) || [];

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-2xl">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
            <p className="text-gray-500">Track platform performance and growth</p>
          </div>
        </div>
        <Select defaultValue="7d" className="w-32 h-10">
          <Select.Option value="24h">Last 24h</Select.Option>
          <Select.Option value="7d">Last 7 days</Select.Option>
          <Select.Option value="30d">Last 30 days</Select.Option>
        </Select>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl">
            <Statistic
              title="Total Sales"
              value={data?.totalSales || 0}
              prefix={<DollarSign size={20} className="text-emerald-500 mr-2" />}
              precision={2}
            />
            <div className="mt-2 text-xs text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +12.5% from last week
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl">
            <Statistic
              title="New Users"
              value={data?.newUsers || 0}
              prefix={<Users size={20} className="text-blue-500 mr-2" />}
            />
            <div className="mt-2 text-xs text-blue-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +8.2% from last week
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl">
            <Statistic
              title="Tickets Sold"
              value={data?.ticketsSold || 0}
              prefix={<Ticket size={20} className="text-purple-500 mr-2" />}
            />
            <div className="mt-2 text-xs text-purple-600 font-bold flex items-center gap-1">
              <TrendingUp size={12} /> +5.1% from last week
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-white rounded-2xl">
            <Statistic
              title="Active Events"
              value={data?.activeEvents || 0}
              prefix={<Calendar size={20} className="text-orange-500 mr-2" />}
            />
            <div className="mt-2 text-xs text-orange-600 font-bold">Stable performance</div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title="Revenue Growth"
            className="bg-white rounded-2xl min-h-[400px]"
          >
            <div className="pt-4 w-full">
              {data?.revenueGrowth?.length > 0 ? (
                <Chart
                  options={revenueChartOptions}
                  series={revenueChartSeries}
                  type="area"
                  height={320}
                />
              ) : (
                <div className="text-gray-300 text-center py-12">
                  <BarChart3 size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-lg">No Revenue Data</p>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="User Distribution"
            className="bg-white rounded-2xl min-h-[400px]"
          >
            <div className="pt-4 flex items-center justify-center min-h-[320px]">
              {data?.userDistribution?.length > 0 ? (
                <div className="w-full">
                  <Chart
                    options={distributionChartOptions}
                    series={distributionChartSeries}
                    type="donut"
                    height={320}
                  />
                </div>
              ) : (
                <div className="text-gray-300 text-center py-12">
                  <div className="w-32 h-32 border-8 border-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users size={32} className="opacity-20" />
                  </div>
                  <p className="text-lg">No User Data</p>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
