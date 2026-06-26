"use client";
import { Button, Form, Input } from "antd";
const { TextArea } = Input;

export default function ContactForm() {
    const [form] = Form.useForm();
    const handleSubmit = async (values: { name: string; email: string; subject: string; message: string }) => {
        console.log(values);
    };
    return (
        <section>
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
                <h2 className="text-3xl font-bold">
                    Send a Message
                </h2>

                <p className="mt-3 text-slate-600">
                    Fill out the form below and we'll get back
                    to you as soon as possible.
                </p>

                <Form
                    layout="vertical"
                    className="mt-8"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your name",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="John Doe"
                            className="h-12"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your email",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="john@example.com"
                            className="h-12"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Subject"
                        name="subject"
                        rules={[
                            {
                                required: true,
                                message: "Please enter a subject",
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="How can we help?"
                            className="h-12"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Message"
                        name="message"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your message",
                            },
                        ]}
                    >
                        <TextArea
                            rows={6}
                            placeholder="Write your message..."
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="!h-11 w-full !rounded-xl"
                        >
                            {/* className="w-full !h-14 !rounded-xl  text-lg font-semibold shadow-md mb-6" */}
                            Send Message
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </section>
    )
}