'use client'
import login_image from "../../../assets/auth/login.png";
import Image from 'next/image';
import { useState } from 'react';
import { Input, Checkbox, Button, message, Form } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { MdEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import { useAuthService } from './../../../hooks/auth/index';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function LoginPage() {
  const [remember, setRemember] = useState(false);
  const { login, loading } = useAuthService();
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const res = await login({ ...values, remember });

      if (res?.code === 200) {
        const token = res?.data?.tokens?.accessToken;

        if (token) {
          Cookies.set("token", token, {
            expires: remember ? 7 : undefined,
            secure: true,
            sameSite: "strict",
          });
        }
        router.push("/dashboard");
      } else {
        message.error(res?.message || "Login failed");
      }
    } catch (e: any) {
      message.error("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white w-full">
      <div className="flex items-center justify-center gap-10 md:gap-5 lg:gap-12 container mx-auto">
        <div className="lg:w-[725px] h-[520px] hidden md:block">
          <Image
            src={login_image}
            alt="logo"
            width={0}
            height={0}
            className="w-full h-full"
          />
        </div>
        <div className="w-full lg:w-[720px]">
          <div className="p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-[#0A0A0A] mb-6">
              Login to Account!
            </h1>
            <p className="text-xl lg:text-2xl text-center text-[#6E6E6E] mb-6">
              Please enter your email and password to continue.
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
                  { type: "email", message: "Enter a valid email address." },
                ]}
              >
                <Input
                  prefix={<MdEmail className="text-[#0A0A0A] text-xl" />}
                  placeholder="Enter Your Email"
                  className="custom-textarea custom-input-profile !text-[#3F3E3E] !mt-3"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-[#24160E] text-xl lg:text-2xl">Password</span>}
                rules={[
                  { required: true, message: "Password is required." },
                  { min: 6, message: "Password must be at least 6 characters." },
                ]}
              >
                <Input.Password
                  prefix={<IoKeyOutline className="text-[#0A0A0A] text-xl" />}
                  placeholder="Enter Password"
                  size="large"
                  className="custom-textarea custom-input-profile !text-[#3F3E3E] !mt-3"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Checkbox
                  className="text-gray-600"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                >
                  <span className="text-sm">Remember me</span>
                </Checkbox>

                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-primary font-bold hover:!text-[#8A2CE2]/80"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={loading}
                className="w-full !rounded-full !py-6 bg-primary hover:!bg-[#8A2CE2]/90 text-xl !font-semibold"
              >
                Sign In
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
