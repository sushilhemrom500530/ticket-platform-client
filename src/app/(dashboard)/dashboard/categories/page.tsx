"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { Plus, Trash, Edit } from "lucide-react";

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [form] = Form.useForm();
  const [updateForm] = Form.useForm();

  const fetchCategories = () => {
    setLoading(true);
    api.get("/categories")
      .then(res => setCategories(res.data.data))
      .catch(() => message.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/categories/${id}`);
      message.success("Category deleted");
      fetchCategories();
    } catch (error) {
      message.error("Failed to delete category");
      setLoading(false);
    }
  };

  const showDeleteConfirm = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => handleDelete(id),
    });
  };

  const onFinish = async (values: any) => {
    try {
      await api.post("/categories", values);
      message.success("Category created");
      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to save category");
    }
  };

  const openUpdateModal = (record: any) => {
    setEditingCategory(record);
    updateForm.setFieldsValue({ name: record.name });
    setIsUpdateModalVisible(true);
  };

  const onUpdateFinish = async (values: any) => {
    setLoading(true);
    try {
      await api.patch(`/categories/update/${editingCategory._id}`, values);
      message.success("Category updated");
      setIsUpdateModalVisible(false);
      updateForm.resetFields();
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to update category");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => new Date(d).toLocaleDateString()
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            danger
            icon={<Trash className="w-4 h-4" />}
            onClick={() => showDeleteConfirm(record._id)}
          />
          <Button
            type="primary"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => openUpdateModal(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsModalVisible(true)}
          className="bg-blue-600">
          Create Category
        </Button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          loading={loading}
        />
      </div>

      <Modal
        title="Create Category"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-600">
            Create
          </Button>
        </Form>
      </Modal>

      <Modal
        title="Update Category"
        open={isUpdateModalVisible}
        onCancel={() => {
          setIsUpdateModalVisible(false);
          setEditingCategory(null);
        }}
        footer={null}
      >
        <Form
          form={updateForm}
          layout="vertical"
          onFinish={onUpdateFinish}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-blue-600">
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
