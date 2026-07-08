"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, message } from "antd";
import Link from "next/link";

export default function ManageTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/event-tickets/get-all?limit=100")
      .then(res => {
        setTickets(res.data.data)
        console.log("tickets", res.data.data)
      })
      .catch(() => message.error("Failed to load tickets"))
      .finally(() => setLoading(false));
  }, []);



  const columns = [
    {
      title: "Ticket ID",
      dataIndex: "ticketNumber",
      key: "ticketId",
      render: (t: string) => <span className="font-mono text-gray-500">{t}</span>
    },
    {
      title: "Event",
      dataIndex: ["event", "title"],
      key: "event"
    },
    {
      title: "User ID",
      dataIndex: "user",
      key: "user",
      render: (u: string) => <span className="text-gray-500">{u}</span>
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity"
    },
    {
      title: "Total Price",
      dataIndex: "totalFare",
      key: "totalPrice",
      render: (p: number) => `$${(p || 0).toFixed(2)}`
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "paid" ? "green" : "red"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Check-in Status",
      dataIndex: "entryStatus",
      key: "entryStatus",
      render: (entryStatus: string) => {
        const isUsed = entryStatus !== "not_used";
        return (
          <Tag
            color={isUsed ? "cyan" : "blue"}
            className="rounded-full px-2"
          >
            {isUsed ? "CHECKED IN" : "NOT USED"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Link href={`/ticket/${record?._id}`}>
          <span className="text-blue-600 hover:underline text-sm font-medium cursor-pointer">
            View Ticket
          </span>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Tickets</h1>
      <div className="bg-white rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={tickets}
          rowKey="_id"
          loading={loading}
        />
      </div>
    </div>
  );
}
