"use client";
import {
    Bold,
    Italic,
    Link,
    List,
    ListOrdered,
    Paperclip,
    Strikethrough,
    Underline,
} from "lucide-react";
import { Button, Form, Input, Select, Upload, UploadFile, message } from "antd";
import { useEffect, useState } from "react";
import { IResourceItem } from "@/src/hooks/dashboard/resource-library/interface";
import { DescriptionInput, ExpertTipsInput } from "@/src/components/input";

interface OptionItem {
    id: string;
    content: string;
}


const ResourceAttachmentInput = ({ value = [], onChange, originalIconUrl }: any) => {
    const isUsingOriginalIcon = value.length === 1 && !value[0].originFileObj && originalIconUrl;
    return (
        <Upload
            beforeUpload={(file) => {
                onChange([file]);
                return false;
            }}
            maxCount={1}
            fileList={value}
            onRemove={() => onChange([])}
            showUploadList={false}
            className="!w-full"
            style={{ width: "100%" }}
        >
            <div className="w-full border border-dashed border-gray-400 rounded-md py-3 flex items-center justify-center gap-2 cursor-pointer bg-white hover:border-[#8A2CE2] transition">
                <Paperclip className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-[#24160E]">
                    {isUsingOriginalIcon ? "Current icon selected" : (value.length > 0 ? value[0].name : "Upload Attachment")}
                </span>
            </div>
        </Upload>
    );
};

export function ResourceLibraryForm({
    setIsModalOpen,
    currentData,
    onSubmit,
}: {
    setIsModalOpen: (open: boolean) => void;
    currentData: IResourceItem | null;
    onSubmit?: ((formData: FormData) => Promise<void>) | undefined;
}) {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<OptionItem[]>([]);
    const [currentOption, setCurrentOption] = useState("");
    const [originalIconUrl, setOriginalIconUrl] = useState<string>("");


    useEffect(() => {
        if (currentData) {
            form.setFieldsValue({
                category: currentData.category,
                title: currentData.title,
                description: currentData.description,
                expertTips: currentData.expertTips,
            });

            if (currentData.files?.url) {
                const fileObj = {
                    uid: '-1',
                    name: currentData.files.url.split('/').pop() || 'file',
                    status: 'done',
                    url: currentData.files.url,
                    type: currentData.files.mimeType,
                };
                form.setFieldsValue({ files: [fileObj] });
                setOriginalIconUrl(currentData.files.url);
            }
        } else {
            form.resetFields();
            setOriginalIconUrl("");
        }
    }, [currentData, form]);



    const onFinish = async (values: any) => {
        const formData = new FormData();
        formData.append("category", values.category);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("expertTips", values.expertTips);

        if (values.files && values.files.length > 0) {
            const file = values.files[0].originFileObj || values.files[0];
            formData.append("files", file);
        }


        try {
            if (onSubmit) await onSubmit(formData);
            setIsModalOpen(false);
            form.resetFields();
            setOptions([]);
            setCurrentOption("");
            setOriginalIconUrl("");
        } catch (err: any) {
            message.error(err.message || "Failed to save conversation");
        }
    };


    return (
        <div className="pt-2">

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                requiredMark={false}
                className="flex flex-col"
            >
                <Form.Item<string>
                    name="category"
                    label={<span className="text-base font-medium text-[#24160E]">Category</span>}
                    rules={[{ required: true, message: "Please enter category" }]}
                    initialValue="all"
                >
                    <Select
                        placeholder="Select Category"
                        options={[
                            { value: "all", label: "All Categories" },
                            { value: "communication", label: "Communication" },
                            { value: "article", label: "Article" },
                            { value: "quick_tips", label: "Quick Tips" },
                        ]}
                        className="w-full md:w-48 custom-textarea !py-3 h-[45px] "
                    />
                </Form.Item>

                <Form.Item
                    name="files"
                    label={<span className="text-base font-medium text-[#24160E]">Resource Attachment</span>}
                    rules={[{ required: true, message: "Resource attachment is required" }]}
                    getValueFromEvent={(e: any) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        return e?.fileList;
                    }}
                >
                    <ResourceAttachmentInput originalIconUrl={originalIconUrl} />
                </Form.Item>
                <Form.Item<string>
                    name="title"
                    label={<span className="text-base font-medium text-[#24160E]">Resource Title</span>}
                    rules={[
                        { required: true, message: "Please enter resource title" },
                        { min: 3, message: "Resource title must be at least 3 characters" },
                        { max: 100, message: "Resource title must not exceed 100 characters" },
                        { pattern: /^[a-zA-Z0-9 ]+$/, message: "Resource title can only contain letters, numbers, and spaces" },
                    ]}>
                    <Input
                        placeholder="Enter resource title"
                        className="w-full custom-textarea"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    className="!relative"
                    name="expertTips"
                    label={<span className="text-base font-medium text-[#24160E]">Expert Tip</span>}
                // rules={[
                //     { required: true, message: "Expert tip is required." },
                //     { min: 3, message: "Write at least 3 characters." },
                // ]}
                >
                    <ExpertTipsInput />
                </Form.Item>

                {/* Resource Description */}
                <Form.Item
                    name="description"
                    className="!relative"
                    label={<span className="text-base font-medium text-[#24160E]">Resource Description</span>}
                    rules={[
                        { required: true, message: "Resource description is required." },
                        {
                            min: 5,
                            message: "Write at least 5 characters.",
                        },
                    ]}
                >
                    <DescriptionInput />
                </Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="!bg-[#8A2CE2] hover:!bg-[#8A2CE2] !text-base !text-white !font-medium !border-none !h-[45px] !px-6 !rounded-lg font-medium flex items-center mt-10"
                >
                    Add New Excercise
                </Button>
            </Form>
        </div>
    );
}
