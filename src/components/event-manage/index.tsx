"use client";

import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Input, Button, message, Card, Statistic, Row, Col, Space, Descriptions, Modal } from "antd";
import { QrCode, CheckCircle, XCircle, Eye, Ticket, DollarSign, Search, Link } from "lucide-react";
import api from "@/src/services/api";
import moment from "moment";
import { QRCodeSVG } from "qrcode.react";
import { TagOutlined, DollarOutlined } from "@ant-design/icons";



type EventManageProps = {
    eventId: string;
};

export default function EventManage({ eventId }: EventManageProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [scanInput, setScanInput] = useState("");
    const scanInputRef = useRef<any>(null);

    // example  6a47f4e74d8c6756d4f82094

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    const fetchEventData = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/events/find/${eventId}`, {
                params: { searchTerm: search },
            });
            setData(response.data.data);
        } catch (error) {
            console.error(error);
            message.error("Failed to load event data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchEventData();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [eventId, search]);

    const handleQuickCheckIn = async (ticketNumber: string) => {
        try {
            await api.patch(`/event-tickets/check-in/${ticketNumber}`);
            message.success(`Ticket ${ticketNumber} checked in successfully!`);
            setData((prev: any) => {
                if (!prev) return prev;
                const newAttendees = prev.attendees.map((attendee: any) => {
                    if (attendee.ticketNumber === ticketNumber) {
                        return { ...attendee, entryStatus: "checked_in", isUsed: true };
                    }
                    return attendee;
                });

                const isAlreadyCheckedIn = prev.attendees.find((a: any) => a.ticketNumber === ticketNumber)?.isUsed;
                const ticketQty = prev.attendees.find((a: any) => a.ticketNumber === ticketNumber)?.quantity || 1;

                const newMetrics = { ...prev.metrics };
                if (!isAlreadyCheckedIn) {
                    newMetrics.checkedIn += ticketQty;
                    newMetrics.absent = Math.max(0, newMetrics.totalSales - newMetrics.checkedIn);
                }

                return { ...prev, attendees: newAttendees, metrics: newMetrics };
            });
            setScanInput("");
        } catch (error: any) {
            console.error(error);
            message.error(error.response?.data?.message || "Failed to check in ticket.");
        }
    };

    const handleScanSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scanInput.trim()) return;
        handleQuickCheckIn(scanInput.trim());
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                scanInputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const columns = [
        {
            title: "Ticket No.",
            dataIndex: "ticketNumber",
            key: "ticketNumber",
            render: (t: string) => <span className="font-mono text-gray-500">{t}</span>,
        },
        {
            title: "User",
            dataIndex: ["user", "name"],
            key: "name",
            render: (text: string, record: any) => {
                const displayName = text || record.user?.fullName || "Guest";
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
                            {record.user?.profileImage ? (
                                <img src={record.user.profileImage} alt={displayName} className="w-full h-full object-cover" />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800">{displayName}</div>
                            <div className="text-xs text-gray-500">{record.user?.email || "No Email"}</div>
                        </div>
                    </div>
                );
            },
        },

        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status: string) => {
                let color = "blue";
                if (status === "paid") color = "green";
                if (status === "cancelled") color = "red";
                if (status === "expired") color = "orange";
                return <Tag color={color} className="!rounded-full">{status?.toUpperCase()}</Tag>;
            },
        },
        {
            title: "Check-in Status",
            dataIndex: "entryStatus",
            key: "entryStatus",
            render: (status: string) => {
                const isUsed = status === "checked_in";
                return (
                    <Tag color={isUsed ? "success" : "default"} className="!rounded-full px-2 uppercase font-medium">
                        {isUsed ? "Checked In" : "Not Used"}
                    </Tag>
                );
            },
        },
        {
            title: "Action",
            key: "action",
            render: (_: any, record: any) => (
                <div className="flex gap-2">
                    <Button href={`/ticket/${record?._id}`} className="!w-max"
                        type="primary"
                        icon={<Eye className="w-4 h-4" />}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        disabled={record.isUsed}
                        className={`${record.isUsed ? "bg-gray-400" : "bg-blue-600"} !w-max`}
                        onClick={() => handleQuickCheckIn(record.ticketNumber)}
                    >
                        {record.isUsed ? "Checked In" : "Manual Check-in"}
                    </Button>

                </div>
            ),
        },
    ];

    const showTicketModal = (ticket: any) => {
        setSelectedTicket(ticket);
        setIsModalVisible(true);
    };


    if (loading && !data) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (!loading && !data) {
        return <div className="p-6 text-xl text-red-500 text-center font-bold mt-10">Failed to load data or Event not found.</div>;
    }

    const event = data?.event;
    const attendees = data?.attendees || [];
    const metrics = data?.metrics || { totalSales: 0, checkedIn: 0, absent: 0, revenue: 0 };
    const meta = data?.meta || { page: 1, limit: 10, total: 0 };

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">{event?.title || "Event Details"}</h1>
                    <p className="text-gray-500 mt-1">
                        {event?.date ? moment(event.date).format("MMMM Do YYYY, h:mm A") : ""} • {event?.location}
                    </p>
                </div>
            </div>
            {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"> 
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{event?.title}</h1>
                    <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                        Event Management Dashboard
                    </p>
                </div>  
            </div>*/}
            {/* Event Overview */}
            <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Total Revenue"
                            value={(event?.soldTickets || 0) * (event?.price || 0)}
                            precision={2}
                            prefix={<DollarOutlined className="text-green-500" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Tickets Sold"
                            value={event?.soldTickets || 0}
                            suffix={`/ ${event?.totalTickets || 0}`}
                            prefix={<TagOutlined className="text-blue-500" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Remaining Tickets"
                            value={(event?.totalTickets || 0) - (event?.soldTickets || 0)}
                            prefix={<TagOutlined className="text-orange-500" />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm">
                        <Statistic
                            title="Price per Ticket"
                            value={event?.price || 0}
                            precision={2}
                            prefix={<DollarOutlined className="text-purple-500" />}
                        />
                    </Card>
                </Col>
            </Row>
            {/* Metrics Row */}
            {/* <Row gutter={[16, 16]} className="mb-8">
                <Col xs={12} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm border border-gray-100 rounded-xl overflow-hidden">
                        <Statistic
                            title={<div className="font-semibold text-gray-500 mb-1 flex items-center gap-2"><Ticket className="w-4 h-4" />Total Tickets Sold</div>}
                            value={metrics.totalSales}
                            styles={{ content: { color: '#000', fontWeight: 'bold' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm border border-blue-50 bg-blue-50/50 rounded-xl overflow-hidden">
                        <Statistic
                            title={<div className="font-semibold text-blue-600 mb-1 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Checked In</div>}
                            value={metrics.checkedIn}
                            styles={{ content: { color: '#2563eb', fontWeight: 'bold' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm border border-orange-50 bg-orange-50/50 rounded-xl overflow-hidden">
                        <Statistic
                            title={<div className="font-semibold text-orange-600 mb-1 flex items-center gap-2"><XCircle className="w-4 h-4" />Absent</div>}
                            value={metrics.absent}
                            styles={{ content: { color: '#ea580c', fontWeight: 'bold' } }}
                        />
                    </Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card variant="borderless" className="shadow-sm border border-green-50 bg-green-50/50 rounded-xl overflow-hidden">
                        <Statistic
                            prefix="$"
                            title={<div className="font-semibold text-green-600 mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4" />Total Revenue</div>}
                            value={(metrics.revenue || 0).toFixed(2)}
                            styles={{ content: { color: '#16a34a', fontWeight: 'bold' } }}
                        />
                    </Card>
                </Col>
            </Row> */}

            <Card title="Manage Tickets" className="shadow-sm">
                <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                    <Space>
                        <Input
                            prefix={<Search className="w-4 h-4 text-gray-400" />}
                            placeholder="Search by Name or Email"
                            className="w-full lg:!w-72 rounded-lg"
                            size="large"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            allowClear
                        />
                    </Space>
                    <Space>
                        <form onSubmit={handleScanSubmit} className="flex flex-col gap-1 w-[260px]">
                            <div className="flex gap-2">
                                <Input
                                    ref={scanInputRef}
                                    prefix={<QrCode className="w-4 h-4 text-gray-400" />}
                                    placeholder="Scan Ticket Barcode..."
                                    value={scanInput}
                                    onChange={(e) => setScanInput(e.target.value)}
                                    autoFocus
                                />
                                <Button type="primary" htmlType="submit">Check</Button>
                            </div>
                        </form>
                    </Space>
                </div>

                <Table
                    columns={columns}
                    dataSource={attendees}
                    rowKey="_id"
                    pagination={{ pageSize: 10, total: meta.total }}
                    loading={loading}
                    className="custom-event-table"
                />
            </Card>

            {/* View Ticket Modal */}
            <Modal
                title="Ticket Details"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={600}
            >
                {selectedTicket && (
                    <div className="p-4">
                        <Row gutter={24}>
                            <Col span={16}>
                                <Descriptions title="Booking Information" column={1} size="small" bordered>
                                    <Descriptions.Item label="Ticket Number">
                                        <span className="font-bold text-blue-600">{selectedTicket.ticketNumber}</span>
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        {selectedTicket.status?.toUpperCase()}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Entry Status">
                                        {selectedTicket.entryStatus === "checked_in" ? "Checked In" : "Not Checked In"}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Quantity">
                                        {selectedTicket.quantity}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="Price Paid">
                                        ${selectedTicket.price}
                                    </Descriptions.Item>
                                    {selectedTicket.user && (
                                        <Descriptions.Item label="Attendee">
                                            {selectedTicket.user.firstName} {selectedTicket.user.lastName} ({selectedTicket.user.email})
                                        </Descriptions.Item>
                                    )}
                                    <Descriptions.Item label="Purchase Date">
                                        {moment(selectedTicket.createdAt).format("MMMM Do YYYY, h:mm a")}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>
                            <Col span={8} className="flex flex-col items-center justify-center">
                                {selectedTicket.qrCode && (
                                    <div className="p-2 border rounded-lg bg-white mb-2 shadow-sm">
                                        <QRCodeSVG value={selectedTicket.qrCode} size={120} />
                                    </div>
                                )}
                                <div className="text-xs text-gray-500 mt-2 text-center">Scan to verify entry</div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
}