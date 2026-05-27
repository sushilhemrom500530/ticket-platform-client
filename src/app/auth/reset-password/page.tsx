'use client'

// import reset_image from "../../../assets/auth/reset-password.png";
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { Input, Button, message, Form } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { IoKeyOutline } from "react-icons/io5";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthService } from "@/src/hooks/auth";
import { FaLock } from 'react-icons/fa';
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
    <div className="flex min-h-screen bg-white w-full overflow-hidden">
      <style>{`
        @keyframes blob-bounce-auth {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(40px, -60px) scale(1.15); }
            66% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes blob-bounce-auth-2 {
            0%, 100% { transform: translate(0, 0) scale(1.1); }
            50% { transform: translate(-50px, 50px) scale(0.85); }
        }
        @keyframes blob-bounce-auth-3 {
            0%, 100% { transform: translate(0, 0) scale(0.9); }
            50% { transform: translate(60px, -30px) scale(1.2); }
        }
        @keyframes blob-bounce-auth-4 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-40px, -40px) scale(0.95); }
        }
        .animate-blob-auth-1 {
            animation: blob-bounce-auth 20s ease-in-out infinite;
        }
        .animate-blob-auth-2 {
            animation: blob-bounce-auth-2 25s ease-in-out infinite;
        }
        .animate-blob-auth-3 {
            animation: blob-bounce-auth-3 18s ease-in-out infinite;
        }
        .animate-blob-auth-4 {
            animation: blob-bounce-auth-4 28s ease-in-out infinite;
        }
      `}</style>

      {/* Left Side: Animated Blobs */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0052cc] to-[#003d99] relative items-center justify-center p-12 text-white">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-[#0066ff] to-[#0047b3] rounded-full animate-blob-auth-1 blur-2xl opacity-50 mix-blend-screen"></div>
        <div className="absolute -bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-[#00bfff] to-[#0047b3] rounded-full animate-blob-auth-2 animation-delay-2000 blur-2xl opacity-50 mix-blend-screen"></div>
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-[#0066ff] to-[#003d99] rounded-full animate-blob-auth-3 animation-delay-4000 blur-2xl opacity-50 mix-blend-screen"></div>

        <div className="absolute -left-32 bottom-0 w-[500px] h-[500px] bg-[#0066ff] rounded-full animate-blob-auth-1"></div>
        <div className="absolute -right-32 top-10 w-[300px] h-[300px] bg-[#0066ff] rounded-full animate-blob-auth-4 animation-delay-4000"></div>

        <div className="relative z-10 text-left max-w-lg -ml-20">
          <h1 className="text-6xl font-bold mb-4 tracking-wider uppercase drop-shadow-lg">SECURE IT</h1>
          <h2 className="text-2xl font-bold mb-8 tracking-widest uppercase drop-shadow-md">SET NEW PASSWORD</h2>
          <p className="text-sm text-blue-100 leading-relaxed font-light drop-shadow-sm">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
            erat volutpat. Ut wisi enim ad minim quis nostrud exerci tation
          </p>
        </div>
      </div>

      {/* Right Side: Reset Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white relative">
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#0066ff] rounded-full animate-blob-auth-1 opacity-90 hidden lg:block"></div>

        <div className="w-full max-w-md relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-3">
            Set new password
          </h1>
          <p className="text-[#6E6E6E] mb-8 text-sm">
            Please enter your new password and confirm it.
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
            className="w-full"
          >
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
              className="mb-4"
            >
              <Input.Password
                size="large"
                prefix={<FaLock className="text-gray-500 mr-2 text-lg" />}
                placeholder="New Password"
                className="bg-[#F5F5F5] border-none hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl h-14 !text-gray-700"
                iconRender={(visible) => (
                  <span className="text-[#0052cc] text-xs font-bold uppercase cursor-pointer hover:text-[#003d99] tracking-wider mr-2">
                    {visible ? "Hide" : "Show"}
                  </span>
                )}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
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
              className="mb-8"
            >
              <Input.Password
                size="large"
                prefix={<FaLock className="text-gray-500 mr-2 text-lg" />}
                placeholder="Confirm Password"
                className="bg-[#F5F5F5] border-none hover:bg-[#EBEBEB] focus:bg-[#EBEBEB] rounded-xl h-14 !text-gray-700"
                iconRender={(visible) => (
                  <span className="text-[#0052cc] text-xs font-bold uppercase cursor-pointer hover:text-[#003d99] tracking-wider mr-2">
                    {visible ? "Hide" : "Show"}
                  </span>
                )}
              />
            </Form.Item>

            <Button
              htmlType="submit"
              type="primary"
              size="large"
              loading={loading}
              className="w-full !h-14 !rounded-xl bg-[#004b93] hover:!bg-[#003d7a] text-lg font-semibold shadow-md mb-6"
            >
              Confirm
            </Button>
          </Form>
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
