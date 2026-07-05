"use client";
import { useEffect, useState } from "react";
import api from "@/src/services/api";
import { Table, Button, Form, message, Popconfirm } from "antd";
import { Plus, Edit, Trash, View, Eye } from "lucide-react";
import EventModal from "@/src/components/ticket-create";
import Link from "next/link";

export default function ManageEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const isPremium = Form.useWatch('isPremium', form);

  const fetchEvents = () => {
    setLoading(true);
    api.get("/events?limit=100")
      .then(res => setEvents(res.data.data.results))
      .catch(() => message.error("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
    api.get("/categories").then(res => setCategories(res.data.data)).catch(console.error);
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record._id);

    // 1. Format existing Organizer photos into Ant Design's Upload fileList format
    const formattedOrganizers = record.organizers?.map((org: any, index: number) => ({
      ...org,
      photo: org.photo ? [{
        uid: `org-${index}`,
        name: "existing_org_image",
        status: "done",
        url: org.photo,
      }] : [],
    })) || [];

    // 2. Format existing Performer photos into Ant Design's Upload fileList format
    const formattedPerformers = record.performers?.map((perf: any, index: number) => ({
      ...perf,
      profilePhoto: perf.profilePhoto ? [{
        uid: `perf-${index}`,
        name: "existing_perf_image",
        status: "done",
        url: perf.profilePhoto,
      }] : [],
    })) || [];

    // 3. Set the form values
    form.setFieldsValue({
      ...record,
      categoryId: record.categoryId?._id,
      date: record.date ? new Date(record.date).toISOString().slice(0, 16) : "",
      image: record.image ? [{
        uid: "-1",
        name: "existing_image",
        status: "done",
        url: record.image,
      }] : [],
      organizers: formattedOrganizers,
      performers: formattedPerformers,
    });

    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      message.success("Event deleted");
      fetchEvents();
    } catch (error) {
      message.error("Failed to delete event");
    }
  };

  const onFinish = async (values: any) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      const payload = { ...values };

      if (payload.image && payload.image[0]?.originFileObj) {
        formData.append("image", payload.image[0].originFileObj);
      }
      delete payload.image;


      if (payload.organizers) {
        payload.organizers = payload.organizers.map((org: any) => {
          // Determine the photo value
          let photoValue = org.photo;

          // If it's an array (from AntD Upload), extract the URL or mark as new
          if (Array.isArray(org.photo)) {
            if (org.photo[0]?.originFileObj) {
              formData.append("organizers.photo", org.photo[0].originFileObj);
              photoValue = "NEW_FILE";
            } else if (org.photo[0]?.url) {
              photoValue = org.photo[0].url;
            } else {
              photoValue = ""; // No photo
            }
          }

          return {
            _id: org._id,
            name: org.name,
            contactNumber: org.contactNumber,
            address: org.address,
            description: org.description,
            photo: photoValue // THIS IS NOW A STRING
          };
        });
      }

      // Do the same for performers
      if (payload.performers) {
        payload.performers = payload.performers.map((perf: any) => {
          let photoValue = perf.profilePhoto;

          if (Array.isArray(perf.profilePhoto)) {
            if (perf.profilePhoto[0]?.originFileObj) {
              formData.append("performers.profilePhoto", perf.profilePhoto[0].originFileObj);
              photoValue = "NEW_FILE";
            } else if (perf.profilePhoto[0]?.url) {
              photoValue = perf.profilePhoto[0].url;
            } else {
              photoValue = "";
            }
          }

          return {
            _id: perf._id,
            name: perf.name,
            contactNumber: perf.contactNumber,
            address: perf.address,
            passion: perf.passion,
            bio: perf.bio,
            description: perf.description,
            profilePhoto: photoValue // THIS IS NOW A STRING
          };
        });
      }

      formData.append("data", JSON.stringify(payload));

      if (editingId) {
        await api.put(`/events/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success("Event updated");
      } else {
        await api.post("/events", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        message.success("Event created");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchEvents();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to save event");
    } finally {
      setIsLoading(false); // Make sure to stop loading even if it fails
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img: string) => <img src={img} alt="event" className="w-12 h-12 object-cover rounded-lg" />
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t: string) => <span className="font-semibold">{t}</span>
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (d: string) => new Date(d).toLocaleDateString()
    },
    {
      title: "Premium",
      dataIndex: "isPremium",
      key: "isPremium",
      render: (p: boolean) => p ? "Yes" : "No"
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p: number) => `$${p || 0}`
    },
    {
      title: "Tickets",
      key: "tickets",
      render: (_: any, record: any) => `${record.soldTickets || 0}/${record.totalTickets}`
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Link href={`/dashboard/events/${record._id}`}>
            <Button
              icon={<Eye className="w-4 h-4" />}
            />
          </Link>
          <Button
            icon={<Edit className="w-4 h-4" />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete event?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              danger
              icon={<Trash className="w-4 h-4" />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleAdd}
          className="bg-blue-600"
        >
          Create Event
        </Button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden">
        <Table
          columns={columns}
          dataSource={events}
          rowKey="_id"
          loading={loading}
        />
      </div>

      <EventModal
        editingId={editingId}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        form={form}
        onFinish={onFinish}
        categories={categories}
        normFile={normFile}
        isPremium={isPremium}
        isLoading={isLoading}
      />
    </div>
  );
}