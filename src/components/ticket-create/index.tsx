import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, Upload, Button, Row, Col, Card } from 'antd';
import type { FormInstance, UploadFile } from 'antd';
import { Plus } from 'lucide-react';

// Data sub-interfaces for clarity & API mapping
export interface OrganizerData {
    name: string;
    contactNumber: string;
    address: string;
    description?: string;
    photo?: UploadFile[];
}

export interface PerformerData {
    name: string;
    contactNumber: string;
    address: string;
    passion: string;
    bio: string;
    description?: string;
    profilePhoto?: UploadFile[];
}

export interface EventCategory {
    _id: string;
    name: string;
}

// Strong definitions for the component props
interface EventModalProps {
    editingId: string | null | undefined;
    isModalVisible: boolean;
    setIsModalVisible: (visible: boolean) => void;
    form: FormInstance;
    onFinish: (values: any) => void;
    categories: EventCategory[];
    normFile: (e: any) => any;
    isPremium: boolean;
}

const EventModal: React.FC<EventModalProps> = ({
    editingId,
    isModalVisible,
    setIsModalVisible,
    form,
    onFinish,
    categories,
    normFile,
    isPremium
}) => {
    return (
        <Modal
            title={editingId ? "Edit Event" : "Create Event"}
            open={isModalVisible}
            onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
            }}
            footer={null}
            width={800}
            centered
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                scrollToFirstError
            >
                {/* ==================== SECTION 1: GENERAL EVENT INFO ==================== */}
                <Card title="General Information" size="small" className="mb-4 bg-gray-50/50">
                    <Row gutter={[16, 0]}>
                        <Col xs={24}>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[{ required: true, message: 'Please enter event title' }]}
                            >
                                <Input placeholder="Enter event title" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: 'Please enter event description' }]}
                            >
                                <Input.TextArea rows={3} placeholder="Describe your event..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name="image"
                                label="Event Image"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                >
                                    <div>
                                        <Plus className="w-4 h-4 mx-auto" />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="categoryId"
                                label="Category"
                                rules={[{ required: true, message: 'Please select a category' }]}
                            >
                                <Select
                                    placeholder="Select Category"
                                    options={categories.map(c => ({ label: c.name, value: c._id }))}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="date"
                                label="Date & Time"
                                rules={[{ required: true, message: 'Please select date & time' }]}
                            >
                                <Input type="datetime-local" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="location"
                                label="Location"
                                rules={[{ required: true, message: 'Please enter location' }]}
                            >
                                <Input placeholder="Event venue or Online link" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="totalTickets"
                                label="Total Tickets"
                                rules={[{ required: true, message: 'Please specify total tickets' }]}
                            >
                                <InputNumber min={1} className="w-full" placeholder="e.g. 100" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="isPremium"
                                label="Premium Event"
                                valuePropName="checked"
                            >
                                <Switch />
                            </Form.Item>
                        </Col>

                        {isPremium && (
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    name="price"
                                    label="Price ($)"
                                    rules={[{ required: true, message: 'Please enter a price' }]}
                                >
                                    <InputNumber
                                        min={0}
                                        step={0.01}
                                        className="w-full"
                                        placeholder="0.00"
                                    />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                </Card>

                {/* ==================== SECTION 2: COMPANY / ORGANIZER ==================== */}
                <Card title="Company / Organizer Details" size="small" className="mb-4 bg-gray-50/50">
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name={['organizer', 'name']}
                                label="Organizer Name"
                                rules={[{ required: true, message: 'Please enter organizer name' }]}
                            >
                                <Input placeholder="Company or individual name" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name={['organizer', 'contactNumber']}
                                label="Contact Number"
                                rules={[{ required: true, message: 'Please enter contact number' }]}
                            >
                                <Input placeholder="Phone number" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name={['organizer', 'address']}
                                label="Address"
                                rules={[{ required: true, message: 'Please enter company address' }]}
                            >
                                <Input placeholder="Company physical address" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name={['organizer', 'description']}
                                label="Description (Optional)"
                            >
                                <Input.TextArea rows={2} placeholder="Brief about the organizer..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name={['organizer', 'photo']}
                                label="Organizer Photo / Logo"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                >
                                    <div>
                                        <Plus className="w-4 h-4 mx-auto" />
                                        <div style={{ marginTop: 8 }}>Upload Logo</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* ==================== SECTION 3: SPONSORS & ARTISTS ==================== */}
                <Card title="Sponsors & Artists" size="small" className="mb-6 bg-gray-50/50">
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name={['performer', 'name']}
                                label="Sponsor / Artist Name"
                                rules={[{ required: true, message: 'Please enter sponsor or artist name' }]}
                            >
                                <Input placeholder="Name" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name={['performer', 'contactNumber']}
                                label="Contact Number"
                                rules={[{ required: true, message: 'Please enter contact number' }]}
                            >
                                <Input placeholder="Phone number" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name={['performer', 'address']}
                                label="Address"
                                rules={[{ required: true, message: 'Please enter address' }]}
                            >
                                <Input placeholder="City, Country or Full Address" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12}>
                            <Form.Item
                                name={['performer', 'passion']}
                                label="Passion / Specialization"
                                rules={[{ required: true, message: 'Please specify specialization' }]}
                            >
                                <Input placeholder="e.g. Rock Band, Main Sponsor, Speaker" />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name={['performer', 'bio']}
                                label="Bio"
                                rules={[{ required: true, message: 'Please enter a brief bio' }]}
                            >
                                <Input.TextArea rows={2} placeholder="Short professional background..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name={['performer', 'description']}
                                label="Description (Optional)"
                            >
                                <Input.TextArea rows={2} placeholder="Any supplementary info..." />
                            </Form.Item>
                        </Col>

                        <Col xs={24}>
                            <Form.Item
                                name={['performer', 'profilePhoto']}
                                label="Profile Photo"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    maxCount={1}
                                    beforeUpload={() => false}
                                >
                                    <div>
                                        <Plus className="w-4 h-4 mx-auto" />
                                        <div style={{ marginTop: 8 }}>Upload Photo</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                {/* Submit Button */}
                <Button
                    type="primary"
                    htmlType="submit"
                    className="w-full bg-blue-600 h-12 text-lg dynamic-submit-btn"
                >
                    {editingId ? "Update Event" : "Create Event"}
                </Button>
            </Form>
        </Modal>
    );
};

export default EventModal;