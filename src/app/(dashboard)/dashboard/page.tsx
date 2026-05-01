/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Card, Col, Row, Select, Typography, Spin } from "antd";
import dynamic from "next/dynamic";
import Image from "next/image";
import total_parent from "../../../assets/dashboard/total-parent.svg";
import total_teen from "../../../assets/dashboard/total-teen.svg";
import ai_session from "../../../assets/dashboard/ai-session.svg";
import { useDashboard } from "./../../../hooks/dashboard/index";
import Title from "@/src/components/reuseable/title";

const Chart = dynamic<any>(() => import("react-apexcharts"), {
  ssr: false,
}) as unknown as React.FC<any>;
const { Text } = Typography;

type Series = {
  name: string;
  data: number[];
};

export default function DashboardPage() {
  const [year, setYear] = React.useState<number>(2025);
  const { dashboardData, loading, refetch } = useDashboard(year);

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    refetch(newYear);
  };

  const barSeries: Series[] = [
    {
      name: "Earnings",
      data:
        dashboardData?.charts?.earnings?.map((item: any) => item.earnings) ||
        [],
    },
  ];

  const barOptions: any = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      foreColor: "#6b7280",
    },
    colors: ["#c9a227"],
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    grid: {
      strokeDashArray: 3,
      borderColor: "#eef2f7",
    },
    xaxis: {
      categories:
        dashboardData?.charts?.earnings?.map((item: any) => item.month) || [],
      axisTicks: { show: false },
      axisBorder: { show: false },
      labels: { style: { colors: Array(12).fill("#64748b") } },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `$${Math.round(val / 1000)}k`,
        style: { colors: ["#64748b"] },
      },
    },
    tooltip: {
      theme: "light",
      y: { formatter: (val: number) => `$${val.toLocaleString()}` },
    },
  };

  const donutSeries =
    dashboardData?.charts?.bookingByServices?.map((item: any) => item.value) ||
    [];
  const donutOptions: any = {
    chart: { type: "donut" },
    labels:
      dashboardData?.charts?.bookingByServices?.map((item: any) => item.name) ||
      [],
    legend: { show: false },
    colors: ["#1e88e5", "#43a047", "#26a69a", "#fbc02d", "#ab47bc", "#ff7043"],
    stroke: { colors: ["#ffffff"] },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Booking By\nServices",
              fontSize: "12px",
              color: "#0189BB",
            },
          },
        },
      },
    },
  };

  return (
    <div className="p-4 space-y-4">
      <Title title="Over View" />

      <div className="space-y-8">
        {/* Stats */}
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Spin spinning={loading} delay={300}>
              <div className="border border-[#E1E1E1]/60 shadow shadow-[#E1E1E1] px-4 lg:px-8 h-32 lg:h-46.25 flex items-center justify-center rounded-2xl">
                <div className="flex items-center gap-4 xl:gap-8 w-full">
                  <div className="flex-1">
                    <h2 className="text-xl lg:text-2xl xl:text-3xl text-[#6E6E6E] font-semibold">
                      Total Parents
                    </h2>
                    <div className="text-xl lg:text-3xl xl:text-4xl text-black font-semibold mt-8">
                      ${dashboardData?.stats?.totalIncome ?? 124}
                    </div>
                  </div>
                  <div className="h-10 w-10 md:h-10 md:w-10 xl:h-16 xl:w-20 relative xl:-top-6">
                    <Image
                      src={total_parent}
                      alt="total_parent"
                      width={0}
                      height={0}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </Spin>
          </Col>

          <Col xs={24} md={8}>
            <Spin spinning={loading} delay={300}>
              <div className="border border-[#E1E1E1]/60 shadow shadow-[#E1E1E1] px-4 lg:px-8 h-32 lg:h-46.25  flex items-center justify-center rounded-2xl">
                <div className="flex items-center gap-4 xl:gap-8 w-full">
                  <div className="flex-1">
                    <h2 className="text-xl lg:text-2xl xl:text-3xl text-[#6E6E6E] font-semibold">
                      Total Teen
                    </h2>
                    <div className="text-xl lg:text-3xl xl:text-4xl text-black font-semibold mt-8">
                      ${dashboardData?.stats?.totalIncome ?? 124}
                    </div>
                  </div>
                  <div className="h-10 w-10 md:h-10 md:w-10 xl:h-16 xl:w-20 relative xl:-top-6">
                    <Image
                      src={total_teen}
                      alt="total_teen"
                      width={0}
                      height={0}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </Spin>
          </Col>

          <Col xs={24} md={8}>
            <Spin spinning={loading} delay={300}>
              <div className="border border-[#E1E1E1]/60 shadow shadow-[#E1E1E1] px-4 lg:px-8 h-32 lg:h-46.25  flex items-center justify-center rounded-2xl">
                <div className="flex items-center gap-4 xl:gap-8 w-full">
                  <div className="flex-1">
                    <h2 className="text-xl lg:text-2xl xl:text-3xl text-[#6E6E6E] font-semibold">
                      Active AI Session
                    </h2>
                    <div className="text-xl lg:text-3xl xl:text-4xl text-black font-semibold mt-8">
                      ${dashboardData?.stats?.totalIncome ?? 124}
                    </div>
                  </div>
                  <div className="h-10 w-10 md:h-10 md:w-10 xl:h-16 xl:w-20 relative xl:-top-6">
                    <Image
                      src={ai_session}
                      alt="ai_session"
                      width={0}
                      height={0}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </Spin>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={16}>
            <Card className="h-full">
              <Spin spinning={loading} delay={300}>
                <div className="flex items-center justify-between pb-2">
                  <Text className="font-medium">Earnings</Text>
                  <div className="flex items-center gap-2">
                    <Text className="text-gray-500">{year}</Text>
                    <Select
                      size="small"
                      value={year}
                      onChange={handleYearChange}
                      options={[2024, 2025, 2026, 2027, 2028, 2029].map(
                        (y) => ({ value: y, label: y }),
                      )}
                    />
                  </div>
                </div>
                <Chart
                  type="bar"
                  height={300}
                  options={barOptions}
                  series={barSeries}
                />
              </Spin>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card className="h-full">
              <Spin spinning={loading} delay={300}>
                <div className="flex flex-col items-center justify-center gap-4 h-full">
                  <div className="flex-1">
                    <ul className="space-y-2 text-sm w-72 lg:w-auto xl:w-72">
                      {dashboardData?.charts?.bookingByServices?.map(
                        (item: any, idx: number) => (
                          <li
                            key={item.name}
                            className="flex items-center justify-between px-2 py-1 border border-slate-100 rounded-full"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{
                                  background: donutOptions.colors?.[
                                    idx
                                  ] as string,
                                }}
                              />
                              <span>{item.name}</span>
                            </div>
                            <div className="text-gray-500">{item.value} %</div>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                  <div className="w-52">
                    <Chart
                      type="donut"
                      height={220}
                      options={donutOptions}
                      series={donutSeries}
                    />
                  </div>
                </div>
              </Spin>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
