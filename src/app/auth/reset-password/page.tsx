'use client'

// import reset_image from "../../../assets/auth/reset-password.png";
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { Input, Button, message, Form } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { IoKeyOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthService } from "@/src/hooks/auth";
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

function ResetPasswordContent() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const router = useRouter();
  const { resetPassword } = useAuthService();
  const [form] = Form.useForm();


  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      setLoading(true);
      await resetPassword({ email, newPassword: values.password });
      router.push("/auth/login");
    } catch (e: any) {
      message.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-white w-full">
      <div className="flex items-center justify-center gap-10 md:gap-5 lg:gap-12 container mx-auto">
        <div className=" hidden md:block">
          {/* <Image
            src={reset_image}
            alt="logo"
            width={0}
            height={0}
            className="w-full h-full"
          /> */}
        </div>
        <div className="w-full lg:w-[720px]">
          <div className="p-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0A0A0A] mb-6">
              Set new password
            </h1>

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                className="!mb-6"
                name="password"
                label={<span className="text-[#545454] text-2xl font-medium">New Password</span>}
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
              >
                <Input.Password
                  prefix={<IoKeyOutline className="text-[#0A0A0A] text-xl" />}
                  placeholder="Enter Password"
                  size="large"
                  className="custom-textarea custom-input-profile !text-[#3F3E3E]"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                label={<span className="text-[#545454] text-2xl font-medium">Confirm Password</span>}
                dependencies={['password']}
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords do not match"));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<IoKeyOutline className="text-[#0A0A0A] text-xl" />}
                  placeholder="Re-enter Password"
                  size="large"
                  className="custom-textarea custom-input-profile !text-[#3F3E3E]"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Button
                htmlType="submit"
                type="primary"
                size="large"
                loading={loading}
                className="w-full !rounded-full !py-6 bg-primary hover:!bg-[#8A2CE2]/90 text-xl !font-semibold !mt-8"
              >
                Confirm
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#f7f7f7]">
        <div className="text-center">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
