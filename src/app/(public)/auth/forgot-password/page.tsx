'use client'
// import forgot_image from "../../../assets/auth/forget.png";
import Image from 'next/image';
import React, { useState } from 'react';
import { Input, Button, message, Form } from 'antd';
import { MdEmail } from "react-icons/md";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useAuthService } from "@/src/hooks/auth";
import { useRouter } from "next/navigation";


export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuthService();
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    if (!email) {
      message.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    await forgotPassword({ email })
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    router.push(`/auth/otp-verify?email=${encodeURIComponent(email)}`)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white w-full">
      <div className="flex items-center justify-center gap-10 md:gap-5 lg:gap-12 container mx-auto">
        <div className=" hidden md:block">
          {/* <Image
            src={forgot_image}
            alt="logo"
            width={0}
            height={0}
            className="w-full h-full"
          /> */}
        </div>
        <div className="w-full lg:w-[720px]">
          <div className="p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0A0A0A] mb-6">
              Forget password
            </h1>
            <p className="text-xl lg:text-2xl text-[#6E6E6E] mb-6">
              Enter your email address to ger a verification code for resetting your password.
            </p>
            {/* form field */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                name="email"
                label={<span className="text-[#24160E] text-xl lg:text-2xl">Email</span>}
                rules={[
                  { required: true, message: "Email is required." },
                  { type: "email", message: "Enter a valid email address" },
                ]}
              >
                <Input
                  prefix={<MdEmail className="text-[#0A0A0A] text-xl" />}
                  placeholder="Enter Your Email"
                  size="large"
                  className="custom-textarea custom-input-profile !text-[#3F3E3E] !mt-3"
                />
              </Form.Item>
              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={loading}
                className="w-full !rounded-full !py-6 bg-primary hover:!bg-[#8A2CE2]/90 text-xl !font-semibold !mt-8"
              >
                Send OTP
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
