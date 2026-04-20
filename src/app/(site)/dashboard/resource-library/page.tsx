"use client";
import Title from "@/src/components/reuseable/title";
import { Button, Input, Select, Pagination, Popconfirm, Empty, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useResourceLibrary } from "@/src/hooks/dashboard/resource-library";
import { CustomModal } from "@/src/components/modal";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { IResourceItem } from "@/src/hooks/dashboard/resource-library/interface";
import { ResourceLibraryForm } from "@/src/components/dashboard/resource-library/form";

export default function ResourceLibraryPage() {
    const {
        resources,
        total,
        query,
        setQuery,
        loading,
        deleteResource,
        createResource,
        updateResource
    } = useResourceLibrary();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<IResourceItem | null>(null);

    const handleSearch = (value: string) => {
        setQuery((prev: any) => ({
            ...prev,
            search: value,
            page: 1,
        }));
    };

    const handleCategoryChange = (value: string) => {
        setQuery((prev: any) => ({
            ...prev,
            category: value === "All" ? "" : value,
            page: 1,
        }));
    };

    const handlePageChange = (page: number) => {
        setQuery((prev: any) => ({
            ...prev,
            page,
        }));
    };

    const handleEdit = (resource: IResourceItem) => {
        setSelectedResource(resource);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedResource(null);
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (data: FormData) => {
        console.log("form data : ", data)
        if (selectedResource) {
            await updateResource(selectedResource._id, data);
        } else {
            await createResource(data);
        }
    };

    return (
        <div className="space-y-6">
            <Title title="Resource Library" />
            {/* create and update  */}
            <CustomModal
                title={selectedResource ? "Edit Resource" : "Add Resource"}
                open={isModalOpen}
                setOpen={setIsModalOpen}
                width={630}
                onClose={() => {
                    setSelectedResource(null);
                }}
            >
                <ResourceLibraryForm
                    setIsModalOpen={setIsModalOpen}
                    currentData={selectedResource}
                    onSubmit={handleFormSubmit}
                />
            </CustomModal>
            <div className="flex items-center justify-between flex-col md:flex-row gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Select
                        placeholder="Select Category"
                        defaultValue=""
                        onChange={handleCategoryChange}
                        options={[
                            { value: "", label: "All Categories" },
                            { value: "communication", label: "Communication" },
                            { value: "article", label: "Article" },
                            { value: "quick_tips", label: "Quick Tips" },
                        ]}
                        className="w-full md:w-48 custom-textarea !py-3 h-[45px] "
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Search by email or name"
                        onChange={(e) => handleSearch(e.target.value)}
                        className="!rounded-full !py-2.5 !pl-6 !pr-14 custom-textarea !text-gray-700 !shadow-none placeholder:!text-gray-400 w-full md:w-[300px]"
                    />
                    <Button
                        icon={<PlusOutlined color="#fff" />}
                        onClick={handleAdd}
                        className="!bg-[#8A2CE2] hover:!bg-[#8A2CE2] !text-white !border-none !h-[45px] !px-6 !rounded-lg font-medium flex items-center"
                    >
                        Add Resource
                    </Button>
                </div>
            </div>

            <Spin spinning={loading}>
                {!loading && resources.length === 0 ? (
                    <Empty description="No resources found" className="py-20" />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {resources.map((resource) => (
                            <div
                                key={resource._id}
                                className="!bg-white rounded-xl p-5 border border-[#E1E1E1] flex flex-col h-full"
                            >
                                <div className="mb-4">
                                    <span
                                        className={`px-4 py-1.5 capitalize rounded-full font-medium inline-block text-[#24160E] text-sm
                                        ${resource.category === "all"
                                                ? "bg-green-100"
                                                : resource.category === "articles"
                                                    ? "bg-blue-100"
                                                    : resource.category === "quick_tips"
                                                        ? "bg-blue-100"
                                                        : resource.category === "communication"
                                                            ? "bg-[#99FFB8]/50"
                                                            : "bg-[#E8F8F0]"
                                            }`}
                                    >
                                        {resource.category || "General"}
                                    </span>
                                </div>

                                <h3 className="font-bold text-xl text-[#24160E] mb-2 line-clamp-1" title={resource.title}>
                                    {resource.title?.length > 40 ? resource.title.slice(0, 40) + "..." : resource.title}
                                </h3>

                                <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                                    {resource.description?.length > 100 ? resource.description.slice(0, 100) + "..." : resource.description}
                                </p>

                                <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-gray-50">

                                    <button onClick={() => deleteResource(resource._id)} className="flex items-center justify-center gap-2 bg-[#FD9499]/90 hover:bg-[#FD9499] text-[#24160E] text-lg py-2.5 rounded-lg transition-colors cursor-pointer">
                                        <RiDeleteBin6Line size={16} /> Delete
                                    </button>

                                    <button
                                        onClick={() => handleEdit(resource)}
                                        className="flex items-center justify-center gap-2 bg-[#DBBEF6]/90 hover:bg-[#DBBEF6] text-[#24160E] py-2.5 rounded-lg transition-colors text-lg cursor-pointer"
                                    >
                                        <FiEdit3 size={16} /> Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Spin>

            {total > 10 && (
                <div className="flex justify-center mt-8 pb-8">
                    <Pagination
                        current={query.page}
                        pageSize={query.limit}
                        total={total}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                        itemRender={(page, type, originalElement) => {
                            if (type === "prev") {
                                return <a className="text-gray-500 font-medium hover:text-primary">Previous</a>;
                            }
                            if (type === "next") {
                                return <a className="text-gray-500 font-medium hover:text-primary">Next</a>;
                            }
                            return originalElement;
                        }}
                    />
                </div>
            )}
        </div>
    );
}