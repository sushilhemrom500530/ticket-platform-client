"use client";

import { Card, Descriptions, Tag, Badge, Spin, Empty, Divider } from "antd";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaCar,
  FaUserTie,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaIdCard,
  FaTag,
  FaUsers,
  FaTachometerAlt,
  FaBolt,
  FaShieldAlt,
  FaWrench,
} from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import Image from "next/image";
import dayjs from "dayjs";
import { useSingleService } from "@/src/hooks/dashboard/resource-library";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Title from "@/src/reuseable/title";

export default function ServiceDetailsPage({
  params,
}: {
  params: { serviceId: string };
}) {
  const { service, loading, error } = useSingleService(params.serviceId);

  const statusColor = useMemo(() => {
    const status = service?.bookingStatus?.toLowerCase();
    if (status === "pending") return "orange";
    if (status === "completed") return "green";
    if (status === "cancelled") return "red";
    if (status === "active") return "blue";
    return "default";
  }, [service?.bookingStatus]);

  const calculateDuration = useMemo(() => {
    if (!service?.startDateAndTime || !service?.endDateAndTime) return null;
    const start = dayjs(service.startDateAndTime);
    const end = dayjs(service.endDateAndTime);
    const days = end.diff(start, "day");
    const hours = end.diff(start, "hour") % 24;
    return { days, hours };
  }, [service?.startDateAndTime, service?.endDateAndTime]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Empty description={error || "Service not found"} />
      </div>
    );
  }

  return (
    <div>
      <Title title="Service Management Details" isShowBackButton={true} />
      <div className="py-10 px-4 space-y-6">
        {/* Booking Overview Card */}
        <Card className="shadow-md">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Image */}
            {service.product?.thumbnail && (
              <div className="md:w-80 w-full h-64 md:h-auto relative rounded-lg overflow-hidden">
                <Image
                  src={service.product.thumbnail}
                  alt={service.product.title || "Product"}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Product Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-[#314155] mb-2">
                    {service.product?.title || "N/A"}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaTag className="text-[#c29d2e]" />
                    <span className="font-medium">
                      {service.category || service.productModel || "N/A"}
                    </span>
                  </p>
                </div>
                <Badge
                  status={statusColor as any}
                  text={
                    <Tag color={statusColor} className="text-sm px-3 py-1">
                      {service.bookingStatus || "N/A"}
                    </Tag>
                  }
                />
              </div>

              <Divider className="my-4" />

              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaIdCard className="text-[#c29d2e]" />
                      Booking ID
                    </span>
                  }
                >
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {service._id}
                  </code>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaDollarSign className="text-[#c29d2e]" />
                      Total Price
                    </span>
                  }
                >
                  <span className="text-lg font-bold text-[#c29d2e]">
                    ${service.totalPrice || 0}
                  </span>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span className="flex items-center gap-2">
                      <FaUsers className="text-[#c29d2e]" />
                      Person Count
                    </span>
                  }
                >
                  {service.personCount || service.product?.personCount || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
          {/* User Information */}
          <Card
            title={
              <span className="flex items-center gap-2 text-lg">
                <FaUser className="text-[#c29d2e]" />
                Customer Information
              </span>
            }
            className="shadow-md"
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaEnvelope />
                    Name
                  </span>
                }
              >
                {service.user?.fullName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaEnvelope />
                    Email
                  </span>
                }
              >
                {service.user?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaUser />
                    Status
                  </span>
                }
              >
                <Tag
                  color={
                    service.user?.status === "Active" ? "green" : "default"
                  }
                >
                  {service.user?.status || "N/A"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaTag />
                    Role
                  </span>
                }
              >
                {service.user?.role || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaCheckCircle />
                    Terms Agreed
                  </span>
                }
              >
                {service.user?.isAgreedTermsCondition ||
                  service.user?.agreeTermsCondition ? (
                  <Tag color="green">Yes</Tag>
                ) : (
                  <Tag color="red">No</Tag>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Provider Information */}
          <Card
            title={
              <span className="flex items-center gap-2 text-lg">
                <FaUserTie className="text-[#c29d2e]" />
                Provider Information
              </span>
            }
            className="shadow-md"
          >
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaEnvelope />
                    Name
                  </span>
                }
              >
                {service.product?.owner?.fullName || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaEnvelope />
                    Email
                  </span>
                }
              >
                {service.product?.owner?.email || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaTag />
                    Provider Type
                  </span>
                }
              >
                {service.product?.owner?.providerType || "N/A"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaUser />
                    Status
                  </span>
                }
              >
                <Tag
                  color={
                    service.product?.owner?.status === "Active"
                      ? "green"
                      : "default"
                  }
                >
                  {service.product?.owner?.status || "N/A"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaTag />
                    Role
                  </span>
                }
              >
                {service.product?.owner?.role || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        {/* Booking Details */}
        {service.startDateAndTime && service.endDateAndTime && (
          <Card
            title={
              <span className="flex items-center gap-2 text-lg">
                <FaCalendarAlt className="text-[#c29d2e]" />
                Booking Schedule
              </span>
            }
            className="shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FaClock className="text-[#c29d2e]" />
                  <span className="font-medium">Start Date & Time</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-lg font-semibold text-[#314155]">
                    {service.startDateAndTime
                      ? dayjs(service.startDateAndTime).format(
                        "DD MMMM YYYY, hh:mm A"
                      )
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FaClock className="text-[#c29d2e]" />
                  <span className="font-medium">End Date & Time</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-lg font-semibold text-[#314155]">
                    {service.endDateAndTime
                      ? dayjs(service.endDateAndTime).format(
                        "DD MMMM YYYY, hh:mm A"
                      )
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
            {calculateDuration && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Duration</p>
                <p className="text-lg font-semibold text-blue-700">
                  {calculateDuration.days} day(s) and {calculateDuration.hours}{" "}
                  hour(s)
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Product Details */}
        {service.product && (
          <Card
            title={
              <span className="flex items-center gap-2 text-lg ">
                <FaCar className="text-[#c29d2e]" />
                Product Details
              </span>
            }
            className="shadow-md !my-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.product.milage && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaTachometerAlt className="text-[#c29d2e]" />
                    <span className="text-sm font-medium">Mileage</span>
                  </div>
                  <p className="text-lg font-semibold text-[#314155]">
                    {service.product.milage} km
                  </p>
                </div>
              )}
              {service.product.power && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaBolt className="text-[#c29d2e]" />
                    <span className="text-sm font-medium">Power</span>
                  </div>
                  <p className="text-lg font-semibold text-[#314155]">
                    {service.product.power} HP
                  </p>
                </div>
              )}
              {service.product.insuranceFee && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaShieldAlt className="text-[#c29d2e]" />
                    <span className="text-sm font-medium">Insurance Fee</span>
                  </div>
                  <p className="text-lg font-semibold text-[#314155]">
                    ${service.product.insuranceFee}
                  </p>
                </div>
              )}
              {service.product.maintainCharge && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaWrench className="text-[#c29d2e]" />
                    <span className="text-sm font-medium">
                      Maintenance Charge
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-[#314155]">
                    ${service.product.maintainCharge}
                  </p>
                </div>
              )}
              {service.product.extraChargePerHours && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaClock className="text-[#c29d2e]" />
                    <span className="text-sm font-medium">
                      Extra Charge/Hour
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-[#314155]">
                    ${service.product.extraChargePerHours}
                  </p>
                </div>
              )}
              {service.product.amount && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaDollarSign className="text-[#c29d2e]" />
                    <span className="text-sm font-medium">Base Amount</span>
                  </div>
                  <p className="text-lg font-semibold text-[#314155]">
                    ${service.product.amount}
                  </p>
                </div>
              )}
            </div>
            {service.product.serviceArea && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FaMapMarkerAlt className="text-[#c29d2e]" />
                  <span className="font-medium">Service Area</span>
                </div>
                <p className="text-[#314155]">{service.product.serviceArea}</p>
              </div>
            )}
            {service.product.description && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MdDescription className="text-[#c29d2e]" />
                  <span className="font-medium">Description</span>
                </div>
                <p className="text-[#314155] bg-gray-50 p-4 rounded-lg">
                  {service.product.description}
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Additional Information */}
        <Card
          title={
            <span className="flex items-center gap-2 text-lg">
              <FaInfoCircle className="text-[#c29d2e]" />
              Additional Information
            </span>
          }
          className="shadow-md"
        >
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item
              label={
                <span className="!flex items-center gap-2">
                  <FaCheckCircle />
                  Permission Status
                </span>
              }
            >
              {service.isPermitted ? (
                <Tag color="green" icon={<FaCheckCircle />}>
                  Permitted
                </Tag>
              ) : (
                <Tag color="orange" icon={<FaTimesCircle />}>
                  Not Permitted
                </Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <FaCalendarAlt />
                  Created At
                </span>
              }
            >
              {service.createdAt
                ? dayjs(service.createdAt).format("DD MMMM YYYY, hh:mm A")
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center gap-2">
                  <FaCalendarAlt />
                  Updated At
                </span>
              }
            >
              {service.updatedAt
                ? dayjs(service.updatedAt).format("DD MMMM YYYY, hh:mm A")
                : "N/A"}
            </Descriptions.Item>
            {service.product?.averageRating !== undefined && (
              <Descriptions.Item
                label={
                  <span className="flex items-center gap-2">
                    <FaTag />
                    Average Rating
                  </span>
                }
              >
                <Badge
                  count={service.product.averageRating || 0}
                  showZero
                  style={{ backgroundColor: "#c29d2e" }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      </div>
    </div>
  );
}
