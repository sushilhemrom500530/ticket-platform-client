"use client";
import Title from "./../../../../reuseable/title/index";
import { Table, Input, Select, Tooltip, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { IoIosSearch } from "react-icons/io";
import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useCommonService } from "@/src/hooks/dashboard/resource-library";
import dayjs from "dayjs";
import Link from "next/link";

const statusOptions = [
  { value: "active", label: "Active", color: "green" },
  { value: "pending", label: "Pending", color: "orange" },
  { value: "completed", label: "Completed", color: "blue" },
  { value: "cancelled", label: "Cancelled", color: "red" },
  { value: "deleted", label: "Deleted", color: "gray" },
];

export default function ServiceManagementPage() {
  const { services, total, query, totalItems, setQuery, loading } =
    useCommonService();

  // Handle Search
  const handleSearch = (value: string) => {
    setQuery((prev: any) => ({
      ...prev,
      search: value,
      page: 1, // reset to first page
    }));
  };

  // Handle Status Filter
  const handleStatusFilter = (value: string) => {
    setQuery((prev: any) => ({
      ...prev,
      bookingStatus: value,
      page: 1,
    }));
  };

  // Handle Pagination
  const handlePagination = (page: number) => {
    setQuery((prev: any) => ({
      ...prev,
      page,
    }));
  };

  // Table columns - match your API response keys
  const columns: ColumnsType<any> = [
    // {
    //   title: "ID",
    //   dataIndex: "_id",
    //   key: "_id",
    //   render: (id) => (
    //     <Tooltip title={id}>
    //       {id?.slice(-6)}
    //     </Tooltip>
    //   ),
    // },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (_, record) => {
        const url = record?.product?.thumbnail;
        return url ? (
          <div className="flex items-center gap-2 w-max">
            <Image
              src={url}
              alt={"Product_image"}
              width={60}
              height={40}
              style={{ objectFit: "cover", borderRadius: 4 }}
            />
            <div className="flex flex-col gap-1">
              <h2 className="font-medium">{record?.product?.title ?? "N/A"}</h2>
              <Tooltip title={record?._id}>#{record?._id?.slice(-6)}</Tooltip>
            </div>
          </div>
        ) : (
          "N/A"
        );
      },
    },
    {
      title: "Provider Name",
      dataIndex: "providerName",
      key: "providerName",
      render: (_, record) => record?.product?.owner?.fullName || "N/A",
    },
    {
      title: "Provider Email",
      dataIndex: "email",
      key: "email",
      render: (_, record) => record?.product?.owner?.email || "N/A",
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status: string) => {
        const matched = statusOptions.find(
          (opt) => opt.value === status?.toLowerCase(),
        );
        if (!matched) return <Tag>{status || "N/A"}</Tag>;
        return (
          <Tag className="!rounded-full" color={matched.color}>
            {matched.label}
          </Tag>
        );
      },
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? dayjs(date).format("DD MMM YYYY") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Link href={`/dashboard/services-manage/view/${record?._id}`}>
          <button className="px-3 py-1 bg-[#c29d2e] text-white rounded hover:bg-[#b28a2b] transition-colors cursor-pointer">
            View Details
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Title title="Service Management" />

      <div className="p-4">
        {/* <div className="bg-white rounded-lg shadow-sm p-6"> */}
        <div className="bg-white rounded-lg shadow-sm p-6 overflow-hidden w-full">
          {/* Header */}
          <div className="flex justify-between lg:items-center gap-6 flex-col lg:flex-row mb-6">
            {/* Status Filter */}
            <h2 className="text-2xl font-semibold">
              Total Service ({totalItems})
            </h2>
            <div className="flex md:items-center flex-col md:flex-row gap-4">
              <Select
                onChange={handleStatusFilter}
                size="large"
                bordered={false}
                placeholder="Filter by Status"
                options={statusOptions}
                className="w-[220px] !outline-none
           [&_.ant-select-selector]:!rounded-full
           [&_.ant-select-selector]:!h-10
           [&_.ant-select-selector]:!px-5
           [&_.ant-select-selector]:!bg-white
           [&_.ant-select-selector]:!border
           [&_.ant-select-selector]:!border-gray-300
           [&_.ant-select-selector]:!shadow-[0_0_0_1px_rgba(0,0,0,0.02)]
           [&_.ant-select-selection-placeholder]:!text-gray-500
           [&_.ant-select-selection-item]:!text-gray-700
           [&_.ant-select-arrow]:!text-gray-700"
              />

              {/* Search */}
              <div className="max-w-md">
                <div className="relative ">
                  <IoIosSearch className="absolute p-2.5 text-white bg-[#c29d2e] top-1/2 transform -translate-y-1/2 right-0 z-10 w-10 h-10 rounded-full" />
                  <Input
                    type="text"
                    placeholder="Search by provider email..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="custom-input-profile custom-textarea !pr-12 lg:!w-md"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div>
            <Table
              columns={columns}
              dataSource={services}
              scroll={{ x: "max-content" }}
              loading={loading}
              pagination={false}
              className="custom-ant-table"
              rowKey="_id"
            />

            <div className="flex  flex-wrap justify-center mt-6 gap-2">
              {/* Back Button */}
              <button
                disabled={query.page === 1}
                onClick={() =>
                  setQuery((prev: any) => ({ ...prev, page: prev.page - 1 }))
                }
                className={`cursor-pointer px-3 py-1 border border-[#7EEAE0] rounded 
      ${query.page === 1 ? "text-gray-300 border-gray-300" : "text-[#7EEAE0] hover:bg-[#7EEAE0] hover:text-white"} 
      transition-colors`}
              >
                Back
              </button>

              {/* Page Numbers */}
              {Array.from({ length: total }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setQuery((prev: any) => ({ ...prev, page: num }))
                  }
                  className={`px-3 py-1 rounded transition-colors cursor-pointer
        ${num === query.page
                      ? "bg-[#D4AF38] border border-[#D4AF38] text-white font-semibold"
                      : "border border-[#7EEAE0] text-[#7EEAE0] hover:bg-[#7EEAE0] hover:text-white"
                    }`}
                >
                  {num}
                </button>
              ))}

              {/* Next Button */}
              <button
                disabled={query.page === total}
                onClick={() =>
                  setQuery((prev: any) => ({ ...prev, page: prev.page + 1 }))
                }
                className={`cursor-pointer px-3 py-1 border border-[#7EEAE0] rounded 
      ${query.page === total ? "text-gray-300 border-gray-300" : "text-[#7EEAE0] hover:bg-[#7EEAE0] hover:text-white"} 
      transition-colors`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        .custom-ant-table .ant-table-thead > tr > th {
          background-color: #5186b1 !important;
          color: white !important;
          font-weight: 500;
          padding: 12px 16px;
        }
        .custom-ant-table .ant-table-tbody > tr:hover > td {
          background-color: #f9fafb !important;
        }
        .custom-ant-table .ant-table-tbody > tr > td {
          padding: 12px 16px;
          color: #374151;
        }
        .custom-ant-table .ant-pagination {
          display: flex;
          justify-content: center;
          margin-top: 24px;
          gap: 6px;
        }
        .custom-ant-table .ant-pagination-item,
        .custom-ant-table .ant-pagination-prev,
        .custom-ant-table .ant-pagination-next {
          border: none !important;
          background: transparent !important;
        }
        .custom-ant-table .ant-table-thead > tr > th::before {
          display: none !important;
          content: none !important;
        }
      `}</style>
    </div>
  );
}
