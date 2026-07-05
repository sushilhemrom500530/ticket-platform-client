import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Switch, Upload, Button, Row, Col, Card } from 'antd';
import { Plus, Trash2 } from 'lucide-react'; // Imported Trash2 for the remove button
import { IEventModalProps } from './interface';


const EventModal: React.FC<IEventModalProps> = ({
    editingId,
    isModalVisible,
    setIsModalVisible,
    form,
    onFinish,
    categories,
    normFile,
    isPremium,
    isLoading
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

                {/* ==================== SECTION 2: COMPANY / ORGANIZERS ==================== */}
                <Card title="Company / Organizers Details" size="small" className="mb-4 bg-gray-50/50">
                    <Form.List name="organizers" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-4">
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Card
                                        key={key}
                                        type="inner"
                                        title={`Organizer ${index + 1}`}
                                        extra={fields.length > 1 && (
                                            <Trash2
                                                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                                                onClick={() => remove(name)}
                                            />
                                        )}
                                    >
                                        <Row gutter={[16, 0]}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    label="Organizer Name"
                                                    rules={[{ required: true, message: 'Please enter organizer name' }]}
                                                >
                                                    <Input placeholder="Company or individual name" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'contactNumber']}
                                                    label="Contact Number"
                                                    rules={[{ required: true, message: 'Please enter contact number' }]}
                                                >
                                                    <Input placeholder="Phone number" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'address']}
                                                    label="Address"
                                                    rules={[{ required: true, message: 'Please enter company address' }]}
                                                >
                                                    <Input placeholder="Company physical address" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'description']}
                                                    label="Description (Optional)"
                                                >
                                                    <Input.TextArea rows={2} placeholder="Brief about the organizer..." />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'photo']}
                                                    label="Organizer Photo / Logo"
                                                    valuePropName="fileList"
                                                    getValueFromEvent={normFile}
                                                >
                                                    <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
                                                        <div>
                                                            <Plus className="w-4 h-4 mx-auto" />
                                                            <div style={{ marginTop: 8 }}>Upload Logo</div>
                                                        </div>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}

                                <Button type="dashed" onClick={() => add()} block className="flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Another Organizer
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </Card>

                {/* ==================== SECTION 3: SPONSORS & ARTISTS ==================== */}
                <Card title="Sponsors & Artists" size="small" className="mb-6 bg-gray-50/50">
                    <Form.List name="performers" initialValue={[{}]}>
                        {(fields, { add, remove }) => (
                            <div className="flex flex-col gap-4">
                                {fields.map(({ key, name, ...restField }, index) => (
                                    <Card
                                        key={key}
                                        type="inner"
                                        title={`Sponsor / Artist ${index + 1}`}
                                        extra={fields.length > 1 && (
                                            <Trash2
                                                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                                                onClick={() => remove(name)}
                                            />
                                        )}
                                    >
                                        <Row gutter={[16, 0]}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'name']}
                                                    label="Sponsor / Artist Name"
                                                    rules={[{ required: true, message: 'Please enter sponsor or artist name' }]}
                                                >
                                                    <Input placeholder="Name" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'contactNumber']}
                                                    label="Contact Number"
                                                    rules={[{ required: true, message: 'Please enter contact number' }]}
                                                >
                                                    <Input placeholder="Phone number" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'address']}
                                                    label="Address"
                                                    rules={[{ required: true, message: 'Please enter address' }]}
                                                >
                                                    <Input placeholder="City, Country or Full Address" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'passion']}
                                                    label="Passion / Specialization"
                                                    rules={[{ required: true, message: 'Please specify specialization' }]}
                                                >
                                                    <Input placeholder="e.g. Rock Band, Main Sponsor, Speaker" />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'bio']}
                                                    label="Bio"
                                                    rules={[{ required: true, message: 'Please enter a brief bio' }]}
                                                >
                                                    <Input.TextArea rows={2} placeholder="Short professional background..." />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'description']}
                                                    label="Description (Optional)"
                                                >
                                                    <Input.TextArea rows={2} placeholder="Any supplementary info..." />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'profilePhoto']}
                                                    label="Profile Photo"
                                                    valuePropName="fileList"
                                                    getValueFromEvent={normFile}
                                                >
                                                    <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
                                                        <div>
                                                            <Plus className="w-4 h-4 mx-auto" />
                                                            <div style={{ marginTop: 8 }}>Upload Photo</div>
                                                        </div>
                                                    </Upload>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Card>
                                ))}

                                <Button type="dashed" onClick={() => add()} block className="flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Another Sponsor / Artist
                                </Button>
                            </div>
                        )}
                    </Form.List>
                </Card>

                {/* Submit Button */}
                <Button
                    loading={isLoading}
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