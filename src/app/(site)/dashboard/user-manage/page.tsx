"use client";
import {
  Table,
  Input,
  Select,
  Tooltip,
  Tag,
  Modal,
  Col,
  Row,
  Spin,
  Card,
  Avatar,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import Image from "next/image";
import dayjs from "dayjs";
import total_parents from "../../../../assets/dashboard/total-parent2.svg";
import total_teen from "../../../../assets/dashboard/total-teen2.svg";
import { RiDeleteBinLine } from "react-icons/ri";
import { CustomModal } from "@/src/components/modal";
import UserDetailsModalContent from "@/src/components/user-details";
import { useUserService } from "@/src/hooks/dashboard/user-manage";
import { IUser } from "@/src/hooks/dashboard/user-manage/interface";


const statusOptions = [
  { value: "active", label: "Active", color: "green" },
  { value: "pending", label: "Pending", color: "orange" },
  { value: "completed", label: "Completed", color: "blue" },
  { value: "cancelled", label: "Cancelled", color: "red" },
  { value: "deleted", label: "Deleted", color: "gray" },
];

export default function UserManagementPage() {
  const {
    users,
    totalItems,
    query,
    setQuery,
    loading,
    deleteUser,
  } = useUserService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const handleSearch = (value: string) => {
    setQuery((prev: any) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  const handleStatusFilter = (value: string) => {
    setQuery((prev: any) => ({
      ...prev,
      status: value,
      page: 1,
    }));
  };

  const handlePagination = (page: number) => {
    setQuery((prev: any) => ({
      ...prev,
      page,
    }));
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      centered: true,
      cancelText: "Cancel",
      onOk: async () => {
        await deleteUser(id);
      },
    });
  };

  const columns: ColumnsType<any> = [
    {
      title: "#User.ID",
      dataIndex: "_id",
      key: "_id",
      render: (id) => <span className="text-gray-500">#{id?.slice(-4)}</span>,
    },
    {
      title: "User Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (name: string, record: any) => {
        const initials =
          name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "NA";

        return (
          <div className="flex items-center gap-2">
            <Avatar
              src={record?.profilePhoto}
              alt={name}
              className="!bg-gray-200 !text-gray-700"
            >
              {!record?.profilePhoto && initials}
            </Avatar>

            <span className="font-medium text-gray-700 truncate max-w-[160px]">
              {name || "N/A"}
            </span>
          </div>
        );
      },
    },
    {
      title: "User Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="text-gray-600">{email || "N/A"}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-sm font-medium capitalize">
          {role || "N/A"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const matched = statusOptions.find(
          (opt) => opt.value === status?.toLowerCase(),
        );

        let color = "default";
        if (status === "active") color = "green";
        else if (status === "pending") color = "orange";
        else if (status === "suspended" || status === "cancelled") color = "red";

        return (
          <Tag className="!rounded-full px-4 border-0" color={color}>
            {matched ? matched.label : status || "N/A"}
          </Tag>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <span className="text-gray-600">
          {date ? dayjs(date).format("DD/MM/YYYY") : "N/A"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Delete User">
            <button
              onClick={() => handleDelete(record._id)}
              className="p-2 text-red-500 bg-[#E9E9E9] hover:bg-red-50 rounded-full transition-colors cursor-pointer"
            >
              <RiDeleteBinLine size={20} />
            </button>
          </Tooltip>

          <Tooltip title="View Details">
            <button
              onClick={() => {
                setSelectedUser(record);
                setIsModalOpen(true);
              }}
              className="p-2 text-purple-500 bg-[#E9E9E9] hover:bg-purple-50 rounded-full transition-colors cursor-pointer"
            >
              <BsInfoCircle size={20} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 mt-8">
      {/* user details  */}
      <CustomModal open={isModalOpen} setOpen={setIsModalOpen} width={520} >
        <UserDetailsModalContent
          user={selectedUser}
          onCancel={() => setIsModalOpen(false)}
        />
      </CustomModal>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Spin spinning={loading} delay={300}>
            <div className="border border-[#E1E1E1]/90 px-4 lg:px-8 h-32 lg:h-[150px] flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-4 w-full">
                <div className="w-[70px] h-[70px]">
                  <Image
                    src={total_parents}
                    alt="total_parent"
                    width={0}
                    height={0}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl text-[#24160E] font-semibold">
                    Total Parent
                  </h2>
                  <div className="text-xl lg:text-2xl xl:text-3xl mt-1 text-primary">
                    120
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </Col>

        <Col xs={24} md={12}>
          <Spin spinning={loading} delay={300}>
            <div className="border border-[#E1E1E1]/90 px-4 lg:px-8 h-32 lg:h-[150px]  flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-4 w-full">
                <div className="w-[70px] h-[70px]">
                  <Image
                    src={total_teen}
                    alt="total_teen"
                    width={0}
                    height={0}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl lg:text-2xl text-[#24160E] font-semibold">
                    Total Teen
                  </h2>
                  <div className="text-xl lg:text-2xl xl:text-3xl mt-1 text-primary">
                    124
                  </div>
                </div>
              </div>
            </div>
          </Spin>
        </Col>
      </Row>

      <Card>
        {/* Header */}
        <div className="flex justify-between lg:items-center gap-6 flex-col lg:flex-row mb-6">
          <h2 className="text-2xl font-semibold">
            User’s List ({totalItems})
          </h2>
          <div className="flex md:items-center flex-col md:flex-row gap-4">
            <Select
              onChange={handleStatusFilter}
              size="large"
              defaultValue=""
              popupMatchSelectWidth={false}
              className="!outline-none min-w-[120px] !rounded-full custom-textarea !py-3"
              suffixIcon={
                <svg
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.49999 12H10.5V9.75H7.49999V12ZM0 0V2.25H18V0H0ZM2.99999 7.125H15V4.875H2.99999V7.125Z"
                    fill="black"
                  />
                </svg>
              }
            >
              <Select.Option value="">All</Select.Option>
              {statusOptions.map(opt => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>

            {/* Search */}
            <div className="max-w-md w-full md:w-[350px]">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search by email or name"
                  onChange={(e) => handleSearch(e.target.value)}
                  className="!rounded-full !py-3 !pl-6 !pr-14 custom-textarea !text-gray-700 !shadow-none placeholder:!text-gray-400"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#8bb7f0] hover:bg-[#7faee8] rounded-full flex items-center justify-center transition-colors text-white">
                  <IoIosSearch className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg">
          <Table
            columns={columns}
            dataSource={users}
            scroll={{ x: "max-content" }}
            loading={loading}
            pagination={{
              current: query.page,
              pageSize: query.limit,
              total: totalItems,
              onChange: handlePagination,
              className: "custom-pagination",
              showSizeChanger: false, // Hide page size selector
              itemRender: (page, type, originalElement) => {
                if (type === "prev") {
                  return (
                    <div className="flex items-center gap-1 font-medium text-gray-700">
                      <span>&lt;</span>
                      <span>Back</span>
                    </div>
                  );
                }
                if (type === "next") {
                  return (
                    <div className="flex items-center gap-1 font-medium text-white">
                      <span>Next</span>
                      <span>&gt;</span>
                    </div>
                  );
                }
                return originalElement;
              },
            }}
            className="custom-ant-table"
            rowKey="_id"
          />
        </div>
      </Card>

      {/* Global Styles */}
      <style jsx global>{`
        .custom-ant-table .ant-table-thead > tr > th {
          background-color: #b172ec !important;
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
        
        /* Pagination Styles */
        .custom-ant-table .ant-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 24px;
          gap: 8px;
        }
        
        /* Page Number Buttons */
        .custom-ant-table .ant-pagination-item {
          border: 1px solid #d9d9d9 !important;
          border-radius: 6px !important;
          background: white !important;
          font-weight: 500;
        }
        
        /* Active Page Button */
        .custom-ant-table .ant-pagination-item-active {
          background-color: #8bb7f0 !important; /* Light blue from image */
          border-color: #8bb7f0 !important;
        }
        
        .custom-ant-table .ant-pagination-item-active a {
          color: white !important;
        }

        /* Hover State for Pages */
        .custom-ant-table .ant-pagination-item:hover:not(.ant-pagination-item-active) {
          border-color: #b172ec !important;
          color: #b172ec !important;
        }

        /* Previous Button Container */
        .custom-ant-table .ant-pagination-prev {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 80px !important;
          height: 32px !important;
          border: 1px solid #d9d9d9 !important; /* Border for Back button */
          border-radius: 6px !important;
          background: white !important; 
          margin-right: 8px !important;
        }

        .custom-ant-table .ant-pagination-prev .ant-pagination-item-link {
          border: none !important;
          background: transparent !important;
          padding: 0 10px !important;
        }

        /* Next Button Container */
        .custom-ant-table .ant-pagination-next {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 80px !important;
          height: 32px !important;
          border: none !important; 
          border-radius: 6px !important;
          background: #8bb7f0 !important; /* Blue background for Next button */
          margin-left: 8px !important;
        }
        
        .custom-ant-table .ant-pagination-next .ant-pagination-item-link {
          border: none !important;
          background: transparent !important;
          color: white !important; 
          padding: 0 10px !important;
        }
        
        /* Disabled States */
        .custom-ant-table .ant-pagination-prev[aria-disabled="true"],
        .custom-ant-table .ant-pagination-next[aria-disabled="true"] {
            opacity: 0.5;
            pointer-events: none;
        }
        
        /* Ellipsis (Jump Buttons) */
        .custom-ant-table .ant-pagination-jump-prev,
        .custom-ant-table .ant-pagination-jump-next {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            border: 1px solid #d9d9d9 !important;
            border-radius: 6px !important;
            min-width: 32px !important;
            height: 32px !important;
            margin-right: 8px !important;
        }

        .custom-ant-table .ant-pagination-jump-prev .ant-pagination-item-container,
        .custom-ant-table .ant-pagination-jump-next .ant-pagination-item-container {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
            position: relative !important;
        }

        /* Adjust icon and ellipsis alignment */
        .custom-ant-table .ant-pagination-jump-prev .ant-pagination-item-link-icon,
        .custom-ant-table .ant-pagination-jump-next .ant-pagination-item-link-icon,
        .custom-ant-table .ant-pagination-jump-prev .ant-pagination-item-ellipsis,
        .custom-ant-table .ant-pagination-jump-next .ant-pagination-item-ellipsis {
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            
            color: #d9d9d9 !important;
            font-size: 12px !important; /* Small dots */
            letter-spacing: 2px;
            line-height: 1 !important;
            margin: 0 !important;
            padding: 0 !important;
            text-align: center !important;
        }
        
        /* Make hover icon theme color */
        .custom-ant-table .ant-pagination-jump-prev:hover .ant-pagination-item-link-icon,
        .custom-ant-table .ant-pagination-jump-next:hover .ant-pagination-item-link-icon {
            color: #b172ec !important;
        }

        .custom-ant-table .ant-pagination-item-link span {
           display: flex;
           align-items: center;
        }

        .custom-ant-table .ant-table-thead > tr > th::before {
          display: none !important;
          content: none !important;
        }
      `}</style>
    </div >
  );
}
