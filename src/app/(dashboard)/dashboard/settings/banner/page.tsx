"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, Switch, message, Space, Popconfirm, Upload } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useBanner } from "@/src/hooks/dashboard/use-banner";
import { IBanner } from "@/src/services/bannerService";

export default function BannerSettingsPage() {
  const { banners, loading, createBanner, updateBanner, deleteBanner } = useBanner();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<IBanner | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingBanner(null);
    setFileList([]);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setIsModalVisible(true);
  };

  const handleEdit = (record: IBanner) => {
    setEditingBanner(record);
    form.setFieldsValue(record);
    if (record.coverImage) {
      setFileList([{ uid: '-1', name: 'image.jpg', status: 'done', url: record.coverImage }]);
    } else {
      setFileList([]);
    }
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBanner(id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const formData = new FormData();
      formData.append("data", JSON.stringify(values));
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editingBanner && editingBanner._id) {
        await updateBanner(editingBanner._id, formData);
      } else {
        if (fileList.length === 0 || !fileList[0].originFileObj) {
          message.error("Please upload a cover image");
          return;
        }
        await createBanner(formData);
      }
      setIsModalVisible(false);
    } catch (error: any) {
      if (error.errorFields) return; // Validation failed
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (text: string) => (
        <img src={text} alt="banner" style={{ width: 100, height: 50, objectFit: "cover", borderRadius: 4 }} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: IBanner) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this banner?"
            onConfirm={() => record._id && handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Banner Settings</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Banner
        </Button>
      </div>

      <Table
        dataSource={banners}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Modal
        title={editingBanner ? "Edit Banner" : "Add Banner"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingBanner ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input placeholder="Discover Amazing Concerts & Festivals" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Book tickets to the best concerts..." />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please enter the category" }]}
          >
            <Input placeholder="Concerts" />
          </Form.Item>

          <Form.Item label="Cover Image" required={!editingBanner}>
            <Upload
              listType="picture"
              fileList={fileList}
              maxCount={1}
              beforeUpload={() => false} // Prevent auto upload
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}