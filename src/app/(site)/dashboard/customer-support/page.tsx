"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, message, Spin } from "antd";
import Title from './../../../../reuseable/title/index';
import {
  PhoneOutlined,
  MailOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useSupport, useUpdateSupport } from "@/src/hooks/dashboard/settings";

const { TextArea } = Input;

interface SupportFormData {
  email: string;
  phone: string;
  description: string;
}

export default function CustomerSupport() {
  const { supports, loading:fetchLoading, refetch } = useSupport(); // fetch existing support data
  const { updateSupport } = useUpdateSupport(); // update hook
  const [formData, setFormData] = useState<SupportFormData>({
    email: "",
    phone: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  // Set default values when supports data is loaded
  useEffect(() => {
    if (supports && supports.length > 0) {
      const data = supports[0] as unknown as SupportFormData; // assuming only one support record
      setFormData({
        email: data?.email || "",
        phone: data?.phone || "",
        description: data?.description || "",
      });
    }
  }, [supports]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const { email, phone, description } = formData;

    if (!email || !phone || !description) {
      message.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      // Call update API
      await updateSupport(supports[0]._id as string, formData);
      message.success("Support information updated successfully!");
      refetch(); // refresh the support data
    } catch (error: any) {
      message.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <Title title="Customer Support" />

      <Spin spinning={fetchLoading}>
        <div className="w-2/3 p-4">
          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              placeholder="Enter your email"
              prefix={<MailOutlined className="!text-gray-500 text-lg" />}
              value={formData.email}
              onChange={handleChange}
              className="custom-input-profile custom-textarea"
            />
          </div>

          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              name="phone"
              placeholder="Enter your phone number"
              prefix={<PhoneOutlined className="!text-gray-500 text-lg" />}
              value={formData.phone}
              onChange={handleChange}
              className="custom-input-profile custom-textarea"
            />
          </div>

          <div className="mb-4 space-y-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <TextArea
              name="description"
              placeholder="Describe your issue"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="custom-textarea"
            />
          </div>

          <Button
            type="primary"
            className="w-full !bg-[#D4AF38] hover:!bg-[#f0bc11]/80 text-white !py-5 px-14 rounded-full cursor-pointer !text-lg !font-semibold"
            onClick={handleSubmit}
            loading={loading}
          >
            Update
          </Button>
        </div>
      </Spin>
    </div>
  );
}
