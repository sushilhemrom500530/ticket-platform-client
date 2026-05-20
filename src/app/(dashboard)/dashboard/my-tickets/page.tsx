"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Tag, Space, Card, message } from "antd";
import { Ticket as TicketIcon, Calendar, MapPin } from "lucide-react";
import Link from "next/link";
import moment from "moment";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/event-tickets/my-tickets");
        setTickets(response.data.data);
      } catch (error) {
        message.error("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const columns = [
    {
      title: "Event",
      dataIndex: "event",
      key: "event",
      render: (event: any) => (
        <div className="flex items-center gap-3">
          {event?.image && <img src={event.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
          <div>
            <div className="font-bold">{event?.title}</div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> {moment(event?.date).format("MMM DD, YYYY")}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Ticket No",
      dataIndex: "ticketNumber",
      key: "ticketNumber",
      render: (text: string) => <code className="bg-gray-100 px-2 py-1 rounded text-xs">{text}</code>
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Amount",
      dataIndex: "totalFare",
      key: "totalFare",
      render: (amount: number) => <span className="font-semibold">${(amount || 0).toFixed(2)}</span>
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "paid" ? "green" : status === "pending" ? "gold" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link
            href={`/ticket/${record._id}`}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            View Ticket
          </Link>
          {record.status === "paid" && (
            <button
              onClick={() => window.open(`/ticket/${record._id}?print=true`, "_blank")}
              className="text-green-600 hover:underline text-sm font-medium"
            >
              Download PDF
            </button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex items-center gap-3">
        <TicketIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">My Tickets</h1>
      </div>

      <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={tickets}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}
