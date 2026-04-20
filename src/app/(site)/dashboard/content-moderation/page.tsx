"use client"
import Title from "@/src/components/reuseable/title";
import { Button, Form, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import Image from "next/image";
import light_icon from "../../../../assets/dashboard/light.svg"
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { CustomModal } from "@/src/components/modal";
import { ConversationStarterForm } from "@/src/components/dashboard/content-moderation/form";
import { useContentModeration } from "@/src/hooks/dashboard/content-moderation";
import { ICategory } from "@/src/hooks/dashboard/content-moderation/interface";




export default function ContentModerationPage() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [currentData, setCurrentData] = useState<ICategory | null>(null);

    const { conversations, loading, refetch, deleteConversation, createConversation, updateConversation, setQuery } = useContentModeration();

    const handleSearch = (value: string) => {
        setQuery((prev: any) => ({
            ...prev,
            search: value,
            page: 1,
        }));
    };

    console.log("conversations", conversations)

    const handleFormSubmit = async (formData: any) => {
        try {
            if (currentData) {
                await updateConversation(currentData._id, formData);
            } else {
                await createConversation(formData);
            }
        } catch (err) {
            console.error(err);
        }
    };
    return (
        <div className="pl-3">
            <Title title="Content Moderation" />
            {/* for create tools  */}
            <CustomModal
                open={isModalOpen}
                title="Conversation Starters"
                setOpen={setIsModalOpen}
                width={540}
                onClose={() => {
                    setCurrentData(null);
                }}
            >
                <ConversationStarterForm
                    setIsModalOpen={setIsModalOpen}
                    currentData={currentData}
                    onSubmit={handleFormSubmit}
                />
            </CustomModal>


            <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-5 mt-6">
                <h1 className="text-base lg:text-2xl font-semibold">Conversation Starters</h1>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Search by email or name"
                        onChange={(e) => handleSearch(e.target.value)}
                        className="!rounded-full !py-2.5 !pl-6 !pr-14 custom-textarea !text-gray-700 !shadow-none placeholder:!text-gray-400 w-full md:w-[300px]"
                    />
                    <Button
                        icon={<PlusOutlined color="#fff" />}
                        onClick={() => setIsModalOpen(true)}
                        className="!bg-[#8A2CE2] hover:!bg-[#8A2CE2] !text-white !border-none !h-[45px] !px-6 !rounded-lg font-medium flex items-center"
                    >
                        Add Tools
                    </Button>
                </div>
            </div>
            {
                conversations?.length > 0 ? (
                    conversations?.map((item: ICategory) => (
                        <div key={item?._id} className="flex gap-5 md:items-center justify-between flex-col md:flex-row bg-gradient-to-r from-[#FFEEEE] to-[#FBFBFB] rounded-lg p-4 border border-[#BCBCBC] mt-6">
                            <div className="flex items-center gap-2">
                                <Image src={item?.icon ?? light_icon} alt="icon" width={24} height={24} />
                                <h1 className="text-base font-medium">{item?.category ?? "N/A"}</h1>
                            </div>
                            <div className="flex items-center gap-5">
                                <button onClick={() => deleteConversation(item?._id)} className="w-10 h-10 rounded-lg bg-[#FF525A] flex items-center justify-center cursor-pointer">
                                    <RiDeleteBin6Line size={18} color="#fff" />
                                </button>
                                <button onClick={() => { setCurrentData(item); setIsModalOpen(true) }} className="w-10 h-10 rounded-lg bg-[#8A2CE2] flex items-center justify-center cursor-pointer">
                                    <TbEdit size={18} color="#fff" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <h1 className="text-base font-medium">No conversation starters found</h1>
                    </div>
                )
            }

        </div>
    );
}