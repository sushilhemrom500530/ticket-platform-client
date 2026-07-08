"use client";

import { useState } from "react";
import { Table, Button, Modal, Form, Input, Switch, InputNumber, Space, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMenubar } from "@/src/hooks/dashboard/use-menubar";
import { IMenubar } from "@/src/services/menubarService";

export default function MenubarSettingsPage() {
    const { menubars, loading, createMenubar, updateMenubar, deleteMenubar } = useMenubar();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingMenubar, setEditingMenubar] = useState<IMenubar | null>(null);
    const [form] = Form.useForm();

    const handleAdd = () => {
        setEditingMenubar(null);
        form.resetFields();
        form.setFieldsValue({ isActive: true, order: 0 });
        setIsModalVisible(true);
    };

    const handleEdit = (record: IMenubar) => {
        setEditingMenubar(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMenubar(id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            if (editingMenubar && editingMenubar._id) {
                await updateMenubar(editingMenubar._id, values);
            } else {
                await createMenubar(values);
            }
            setIsModalVisible(false);
        } catch (error: any) {
            if (error.errorFields) return;
            console.error(error);
        }
    };

    const columns = [
        {
            title: "Label",
            dataIndex: "label",
            key: "label",
        },
        {
            title: "Link / Href",
            dataIndex: "href",
            key: "href",
        },
        {
            title: "Order",
            dataIndex: "order",
            key: "order",
            sorter: (a: IMenubar, b: IMenubar) => a.order - b.order,
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
            render: (_: any, record: IMenubar) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Are you sure to delete this item?"
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
                <h1 className="text-2xl font-bold">Menubar Settings</h1>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Menu Item
                </Button>
            </div>

            <Table
                dataSource={menubars}
                columns={columns}
                rowKey="_id"
                loading={loading}
            />

            <Modal
                title={editingMenubar ? "Edit Menu Item" : "Add Menu Item"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                okText={editingMenubar ? "Update" : "Create"}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="label"
                        label="Label"
                        rules={[{ required: true, message: "Please enter the menu label" }]}
                    >
                        <Input placeholder="e.g., Events" />
                    </Form.Item>

                    <Form.Item
                        name="href"
                        label="Link / Href"
                        rules={[{ required: true, message: "Please enter the link" }]}
                    >
                        <Input placeholder="e.g., /events" />
                    </Form.Item>

                    <Form.Item
                        name="order"
                        label="Display Order"
                        rules={[{ required: true, message: "Please specify the order" }]}
                    >
                        <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                        name="icon"
                        label="Icon Name (Optional)"
                        tooltip="Name of the icon (e.g. from Lucide)"
                    >
                        <Input placeholder="CalendarDays" />
                    </Form.Item>

                    <Form.Item
                        name="isActive"
                        label="Active"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="isEvent"
                        label="Is Event"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}