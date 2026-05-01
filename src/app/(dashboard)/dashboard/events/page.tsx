"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Button, Modal, Form, Input, Select, InputNumber, Switch, message, Popconfirm } from "antd";
import { Plus, Edit, Trash } from "lucide-react";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  
  const isPremium = Form.useWatch('isPremium', form);

  const fetchEvents = () => {
    setLoading(true);
    api.get("/events?limit=100")
      .then(res => setEvents(res.data.data.results))
      .catch(() => message.error("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    api.get("/categories").then(res => setCategories(res.data.data)).catch(console.error);
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record._id);
    form.setFieldsValue({
      ...record,
      categoryId: record.categoryId?._id,
      date: new Date(record.date).toISOString().slice(0, 16), // datetime-local format
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      message.success("Event deleted");
      fetchEvents();
    } catch (error) {
      message.error("Failed to delete event");
    }
  };

  const onFinish = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify(values));
      // In a real app, handle file upload here by appending file to formData

      if (editingId) {
        await api.put(`/events/${editingId}`, formData);
        message.success("Event updated");
      } else {
        await api.post("/events", formData);
        message.success("Event created");
      }
      setIsModalVisible(false);
      fetchEvents();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to save event");
    }
  };

  const columns = [
    { title: "Title", dataIndex: "title", key: "title", render: (t: string) => <span className="font-semibold">{t}</span> },
    { title: "Date", dataIndex: "date", key: "date", render: (d: string) => new Date(d).toLocaleDateString() },
    { title: "Premium", dataIndex: "isPremium", key: "isPremium", render: (p: boolean) => p ? "Yes" : "No" },
    { title: "Price", dataIndex: "price", key: "price", render: (p: number) => `$${p}` },
    { title: "Tickets", key: "tickets", render: (_: any, record: any) => `${record.soldTickets}/${record.totalTickets}` },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button icon={<Edit className="w-4 h-4" />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Delete event?" onConfirm={() => handleDelete(record._id)}>
            <Button danger icon={<Trash className="w-4 h-4" />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Button type="primary" icon={<Plus className="w-4 h-4" />} onClick={handleAdd} className="bg-blue-600">
          Create Event
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table columns={columns} dataSource={events} rowKey="_id" loading={loading} />
      </div>

      <Modal
        title={editingId ? "Edit Event" : "Create Event"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item name="categoryId" label="Category" rules={[{ required: true }]} className="flex-1">
              <Select options={categories.map(c => ({ label: c.name, value: c._id }))} />
            </Form.Item>
            <Form.Item name="date" label="Date & Time" rules={[{ required: true }]} className="flex-1">
              <Input type="datetime-local" />
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item name="location" label="Location" rules={[{ required: true }]} className="flex-1">
              <Input />
            </Form.Item>
            <Form.Item name="totalTickets" label="Total Tickets" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </div>
          <div className="flex gap-4 items-center">
            <Form.Item name="isPremium" label="Premium Event" valuePropName="checked">
              <Switch />
            </Form.Item>
            {isPremium && (
              <Form.Item name="price" label="Price ($)" rules={[{ required: true }]}>
                <InputNumber min={0} step={0.01} className="w-full" />
              </Form.Item>
            )}
          </div>
          <Button type="primary" htmlType="submit" className="w-full bg-blue-600">
            {editingId ? "Update" : "Create"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
