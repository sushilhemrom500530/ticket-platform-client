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
    X,
    Plus
} from "lucide-react";
import { Button, Form, Input, Upload, UploadFile, message } from "antd";
import { useEffect, useState } from "react";
import { ICategory } from "@/src/hooks/dashboard/content-moderation/interface";

interface OptionItem {
    id: string;
    content: string;
}

export function ConversationStarterForm({
    setIsModalOpen,
    currentData,
    onSubmit,
}: {
    setIsModalOpen: (open: boolean) => void;
    currentData: ICategory | null;
    onSubmit?: (formData: FormData) => Promise<void>;
}) {
    const [form] = Form.useForm();
    const [options, setOptions] = useState<OptionItem[]>([]);
    const [currentOption, setCurrentOption] = useState("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [originalIconUrl, setOriginalIconUrl] = useState<string>("");


    useEffect(() => {
        if (currentData) {
            form.setFieldsValue({ category: currentData.category });

            setOptions(
                currentData.options.map(opt => ({
                    id: opt._id,
                    content: opt.content
                }))
            );

            setOriginalIconUrl(currentData.icon || "");
            if (currentData.icon) {
                setFileList([{
                    uid: "-1",
                    name: currentData.icon.split("/").pop() || "icon.png",
                    status: "done",
                    url: currentData.icon
                } as UploadFile]);
            }
        } else {
            form.resetFields();
            setOptions([]);
            setCurrentOption("");
            setFileList([]);
            setOriginalIconUrl("");
        }
    }, [currentData, form]);

    const handleAddOption = () => {
        const trimmed = currentOption.trim();
        if (!trimmed) {
            message.error("Please enter option text");
            return;
        }

        setOptions(prev => [
            ...prev,
            { id: crypto.randomUUID(), content: trimmed }
        ]);
        setCurrentOption("");
    };

    const removeOption = (id: string) => {
        setOptions(prev => prev.filter(opt => opt.id !== id));
    };

    const onFinish = async (values: any) => {
        if (options.length === 0) {
            message.error("Please add at least one option");
            return;
        }

        const formData = new FormData();
        const isUpdate = !!currentData;

        const newCategory = values.category.trim();
        if (!isUpdate) {
            formData.append("category", newCategory);
        } else if (newCategory !== currentData.category) {
            formData.append("category", newCategory);
        }

        const optionsChanged = () => {
            if (!isUpdate) return true;
            if (options.length !== currentData.options.length) return true;

            return options.some((opt, idx) => {
                const orig = currentData.options[idx];
                return opt.content.trim() !== orig.content || opt.id !== orig._id;
            });
        };

        if (!isUpdate || optionsChanged()) {
            options.forEach((opt, idx) => {
                if (isUpdate && currentData.options.some(o => o._id === opt.id)) {
                    formData.append(`options[${idx}][_id]`, opt.id);
                }
                formData.append(`options[${idx}][content]`, opt.content.trim());
            });
        }

        const hasNewIcon = fileList[0]?.originFileObj;
        const iconRemoved = isUpdate && !hasNewIcon && fileList.length === 0 && originalIconUrl;

        if (hasNewIcon) {
            formData.append("icon", fileList[0].originFileObj!);
        } else if (iconRemoved) {
            formData.append("removeIcon", "true");
        }

        if (isUpdate && [...formData.entries()].length === 0) {
            setIsModalOpen(false);
            return;
        }

        try {
            if (onSubmit) await onSubmit(formData);
            setIsModalOpen(false);
            form.resetFields();
            setOptions([]);
            setFileList([]);
            setCurrentOption("");
            setOriginalIconUrl("");
        } catch (err: any) {
            message.error(err.message || "Failed to save conversation");
        }
    };

    const isUsingOriginalIcon = fileList.length === 1 &&
        !fileList[0].originFileObj &&
        originalIconUrl;

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
                >
                    <Input
                        placeholder="Enter category"
                        className="w-full custom-textarea"
                        size="large"
                    />
                </Form.Item>

                <Form.Item
                    label={<span className="text-base font-medium text-[#24160E]">Upload icon (PNG/SVG)</span>}
                    rules={[
                        {
                            validator: () => {
                                if (fileList.length > 0) return Promise.resolve();
                                if (currentData?.icon && !fileList.length) return Promise.resolve(); // Existing icon is valid
                                return Promise.reject(new Error("Please upload an icon"));
                            }
                        }
                    ]}
                >
                    <div>
                        <Upload
                            beforeUpload={(file) => {
                                if (!["image/png", "image/svg+xml"].includes(file.type)) {
                                    message.error("Only PNG and SVG files allowed!");
                                    return Upload.LIST_IGNORE;
                                }
                                setFileList([file]);
                                return false;
                            }}
                            maxCount={1}
                            fileList={fileList}
                            onRemove={() => setFileList([])}
                            showUploadList={false}
                            className="!w-full"
                            style={{ width: "100%" }}
                        >
                            <div className="w-full border border-dashed border-gray-400 rounded-md py-3 flex items-center justify-center gap-2 cursor-pointer bg-white hover:border-[#8A2CE2] transition">
                                <Paperclip className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-[#24160E]">
                                    {isUsingOriginalIcon ? "Current icon selected" : "Upload icon"}
                                </span>
                            </div>
                        </Upload>
                    </div>
                </Form.Item>

                <Form.Item
                    shouldUpdate
                    rules={[
                        {
                            validator: () =>
                                options.length > 0
                                    ? Promise.resolve()
                                    : Promise.reject(new Error("Please add at least one option")),
                        },
                    ]}
                >
                    {() => (
                        <>
                            <div className="flex flex-col gap-2">
                                <span className="text-base font-medium text-[#24160E]">Add Options:</span>
                                {options.map((option) => (
                                    <div key={option.id} className="flex items-center gap-3">
                                        <div className="flex-1 bg-white border border-[#E1E1E1] rounded-md p-3 text-gray-500 text-sm flex justify-between items-center">
                                            <span>{option.content}</span>
                                            <button
                                                onClick={() => removeOption(option.id)}
                                                type="button"
                                                className="text-gray-400 hover:text-red-500 cursor-pointer"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white mt-3 custom-textarea [transition:0.3s]">
                                <Input.TextArea
                                    value={currentOption}
                                    onChange={(e) => setCurrentOption(e.target.value)}
                                    placeholder="Add your job description..."
                                    autoSize={{ minRows: 4, maxRows: 6 }}
                                    className="border-none shadow-none focus:shadow-none resize-none text-gray-600 p-4 !ring-0 !outline-none custom-textarea"
                                    variant="borderless"
                                />
                                <div className="flex items-center gap-4 px-4 pb-3 text-gray-400 border-t border-transparent">
                                    <button type="button" className="hover:text-gray-600"><Bold className="w-4 h-4" /></button>
                                    <button type="button" className="hover:text-gray-600"><Italic className="w-4 h-4" /></button>
                                    <button type="button" className="hover:text-gray-600"><Underline className="w-4 h-4" /></button>
                                    <button type="button" className="hover:text-gray-600"><Strikethrough className="w-4 h-4" /></button>
                                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                    <button type="button" className="hover:text-gray-600"><Link className="w-4 h-4" /></button>
                                    <div className="w-px h-4 bg-gray-200 mx-1"></div>
                                    <button type="button" className="hover:text-gray-600"><List className="w-4 h-4" /></button>
                                    <button type="button" className="hover:text-gray-600"><ListOrdered className="w-4 h-4" /></button>
                                </div>
                            </div>

                            <div className="flex justify-end text-xs text-gray-400 mt-1 mb-4">
                                Write at least 100 characters.
                            </div>

                            <div className="flex justify-end mb-4">
                                <Button
                                    type="primary"
                                    onClick={handleAddOption}
                                    className="!bg-[#8A2CE2] hover:!bg-[#8A2CE2] !text-white !border-none !px-6 !rounded-lg font-medium flex items-center"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Option
                                </Button>
                            </div>
                        </>
                    )}
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    className="!bg-[#8A2CE2] hover:!bg-[#8A2CE2] !text-white !uppercase !font-semibold !border-none !h-[45px] !px-6 !rounded-lg font-medium flex items-center"
                >
                    save
                </Button>
            </Form>
        </div>
    );
}
