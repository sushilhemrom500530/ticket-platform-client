"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Card, Table, Button, Tag, Row, Col, Space, message } from "antd";
import { TbReportAnalytics } from "react-icons/tb";
import { FileText, Download, Filter, FileSpreadsheet, FilePieChart } from "lucide-react";
import moment from "moment";

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/reports");
        setReports(response.data.data);
      } catch (error) {
        // message.error("Failed to load reports");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const columns = [
    {
      title: "Report Name",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-500" />
          <span className="font-medium">{text}</span>
        </div>
      )
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag className="rounded-lg">{type.toUpperCase().replace('_', ' ')}</Tag>
    },
    {
      title: "Generated At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => moment(date).format("MMM DD, YYYY HH:mm")
    },
    {
      title: "By",
      dataIndex: "generatedBy",
      key: "generatedBy",
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button type="text" icon={<Download size={16} />} className="text-blue-600">Download</Button>
      )
    }
  ];

  const quickReports = [
    { title: "Monthly Sales Report", icon: <FileSpreadsheet className="text-emerald-500" /> },
    { title: "User Activity Summary", icon: <FileText className="text-blue-500" /> },
    { title: "Event Performance", icon: <FilePieChart className="text-purple-500" /> },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-2xl">
            <TbReportAnalytics className="w-8 h-8 text-slate-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
            <p className="text-gray-500">Generate and download platform reports</p>
          </div>
        </div>
        <Button type="primary" className="h-11 rounded-xl bg-slate-800 border-none font-bold">
          Generate New Report
        </Button>
      </div>

      <Row gutter={[20, 20]} className="mb-8">
        {quickReports.map((report, idx) => (
          <Col xs={24} md={8} key={idx}>
            <Card hoverable className="rounded-2xl border-none shadow-sm group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                    {report.icon}
                  </div>
                  <div className="font-bold text-gray-700">{report.title}</div>
                </div>
                <Download size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card 
        title="Generated Reports History" 
        variant="borderless" 
        className="shadow-sm border border-gray-100 rounded-2xl overflow-hidden"
        extra={<Button icon={<Filter size={16} />} type="text">Filter</Button>}
      >
        <Table columns={columns} dataSource={reports} loading={loading} rowKey="_id" />
      </Card>
    </div>
  );
}
