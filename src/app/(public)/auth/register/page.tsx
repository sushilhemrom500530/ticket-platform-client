'use client'
// import login_image from "../../../assets/auth/login.png";
import Image from 'next/image';
import { useState } from 'react';
import { Input, Checkbox, Button, message, Form } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { MdEmail } from "react-icons/md";
import { IoKeyOutline } from "react-icons/io5";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthService } from '@/src/hooks/auth';
import { useAuthStore } from '@/src/store/authStore';

export default function RegisterPage() {
    const [remember, setRemember] = useState(false);
    const { login, loading } = useAuthService();
    const { setUser } = useAuthStore();
    const router = useRouter();
    const [form] = Form.useForm();

    const handleSubmit = async (values: { email: string; password: string }) => {
        try {
            const res = await login({ ...values, remember });

            console.log('ressss', res);

            if (res?.success || res?.statusCode === 200) {
                // Handle different response structures
                const token = res?.data?.token || res?.data?.tokens?.accessToken;
                const user = res?.data?.results || res?.data?.user;

                if (token) {
                    Cookies.set("token", token, {
                        expires: remember ? 7 : undefined,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                    });
                }

                if (user) {
                    setUser(user);
                }

                router.push("/dashboard");
            }
        } catch (error) {
            // Handle truly unexpected errors (e.g. Network/500)
            console.error("Unexpected login error:", error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white w-full">
            <div className="flex items-center justify-center gap-10 md:gap-5 lg:gap-12 container mx-auto">
                <div className="lg:w-[725px] h-[520px] hidden md:block">
                    {/* <Image
            src={login_image}
            alt="logo"
            width={0}
            height={0}
            className="w-full h-full"
          /> */}
                </div>
                <div className="w-full lg:w-[720px]">
                    <div className="p-8">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center text-[#0A0A0A] mb-3">
                            Login to Account!
                        </h1>
                        <p className=" text-center text-[#6E6E6E] mb-6">
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
                                name="fullname"
                                label={<span className="text-[#24160E] text-lg">Full name</span>}
                                rules={[
                                    { required: true, message: "Full name is required." },
                                    { min: 3, message: "Full name must be at least 3 characters." },
                                ]}
                            >
                                <Input
                                    prefix={<MdEmail className="text-[#0A0A0A] text-xl" />}
                                    placeholder="Enter Your Email"
                                    className="custom-textarea !text-[#3F3E3E] px-3! py-2!"
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label={<span className="text-[#24160E] text-lg">Email</span>}
                                rules={[
                                    { required: true, message: "Email is required." },
                                    { type: "email", message: "Enter a valid email address." },
                                ]}
                            >
                                <Input
                                    prefix={<MdEmail className="text-[#0A0A0A] text-xl" />}
                                    placeholder="Enter Your Email"
                                    className="custom-textarea !text-[#3F3E3E] px-3! py-2!"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={<span className="text-[#24160E] text-lg">Password</span>}
                                rules={[
                                    { required: true, message: "Password is required." },
                                    { min: 6, message: "Password must be at least 6 characters." },
                                ]}
                            >
                                <Input.Password
                                    prefix={<IoKeyOutline className="text-[#0A0A0A] text-xl" />}
                                    placeholder="Enter Password"
                                    className="custom-textarea !text-[#3F3E3E] px-3! py-2!"
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
                                className="w-full !rounded-full !py-6 bg-primary hover:!bg-[#8A2CE2]/90 text-xl !font-semibold"
                            >
                                Sign Up
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
