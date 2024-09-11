import React, { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message, Table, Select } from "antd";
import { VerifyTicket, GetVerifiers, UpdateSeatStatus, fetchBusRounds } from "../services/https";
import { TicketVerification } from "../interfaces/TicketVerification";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { BusRound } from "../interfaces/busrounds";
import './Verifier.css'; // Import the CSS file

const { Option } = Select;

const Verifier: React.FC = () => {
    const columns: ColumnsType<TicketVerification> = [
        {
            title: "Ticket Number",
            dataIndex: "ticket_number",
            key: "ticketNumber",
        },
        {
            title: "Seat Status",
            dataIndex: "seat_status",
            key: "seatStatus",
        },
        {
            title: "Phone Number",
            dataIndex: "phone_number",
            key: "phoneNumber",
        },
        {
            title: "Bus ID",
            dataIndex: "bus_id",
            key: "busID",
        },
        {
            title: "Bus Round",
            dataIndex: "bus_route",
            key: "busRoute",
        },
    ];

    const [verifier, setVerifier] = useState<TicketVerification[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [busRounds, setBusRounds] = useState<BusRound[]>([]);
    const [selectedRound, setSelectedRound] = useState<string | undefined>();

    const handleVerification = async (values: TicketVerification) => {
        setLoading(true);
        try {
            const result = await VerifyTicket({ ticketNumber: values.ticket_number });
            setLoading(false);
            console.log("VerifyTicket-->", result);
            if (result.isValid) {
                try {
                    await UpdateSeatStatus({
                        ticketNumber: result.ticketNumber!,
                        seatStatus: "ตรวจสอบแล้ว",
                    });

                    messageApi.open({
                        type: "success",
                        content: `การตรวจสอบสำเร็จ! หมายเลขตั๋ว: ${result.ticketNumber}, สถานะที่นั่ง: ${result.seatStatus}`,
                    });

                    form.resetFields();
                } catch (updateError) {
                    const errorMessage = (updateError as Error).message || "อัพเดตสถานะที่นั่งไม่สำเร็จ!";
                    messageApi.open({
                        type: "error",
                        content: `อัพเดตสถานะที่นั่งไม่สำเร็จ! ${errorMessage}`,
                    });
                }
            } else {
                messageApi.open({
                    type: "error",
                    content: `ตั๋วไม่ถูกต้อง! ${result.message}`,
                });
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = (error as Error).message || "เกิดข้อผิดพลาดในการเชื่อมต่อ!";
            messageApi.open({
                type: "error",
                content: `เกิดข้อผิดพลาดในการเชื่อมต่อ! ${errorMessage}`,
            });
        }
    };

    const handleCancel = () => {
        form.resetFields();
    };

    const getVerifiers = async () => {
        try {
            const res = await GetVerifiers();
            console.log("GetVerifiers-->", res);
            if (res) {
                setVerifier(res);
            }
        } catch (error) {
            console.error("Error fetching verifiers:", error);
        }
    };

    const getBusRounds = async () => {
        try {
            const res = await fetchBusRounds();
            console.log("fetchBusRounds-->", res);
            if (res) {
                setBusRounds(res);
            }
        } catch (error) {
            console.error("Error fetching bus rounds:", error);
        }
    };

    const FindBusTimeTickets = async (values: any) => {
        const allData = values.findBusTimeTicket.split('---');
        const day = allData[0].trim();
        const time = allData[1].trim();

        console.log("Day:", day);
        console.log("Time:", time);

        try {
            const result = await GetVerifiers();
            setVerifier(result);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            messageApi.open({
                type: "error",
                content: "Failed to fetch tickets!",
            });
        }
    };

    const handleRoundChange = (value: string) => {
        setSelectedRound(value);
    };

    useEffect(() => {
        getVerifiers();
        getBusRounds();
    }, []);

    return (
            <div className="container">
                {contextHolder}
    
                <Row gutter={0} className="row">
                    <Col className="col-left">
                        <Card className="card">
                            <h1 className="title-main">ตรวจสอบตั๋ว</h1>
                            <Divider />
                            <Form form={form} name="verification" layout="vertical" onFinish={handleVerification} autoComplete="off">
                                <Form.Item
                                    label="หมายเลขตั๋ว"
                                    name="ticketNumber"
                                    rules={[{ required: true, message: "กรุณากรอกหมายเลขตั๋ว!" }]}
                                >
                                    <Input placeholder="กรอกหมายเลขตั๋วที่นี่" className="form-item" />
                                </Form.Item>
                                <Row justify="end">
                                    <Space>
                                        <Button onClick={handleCancel} className="button-secondary">
                                            ยกเลิก
                                        </Button>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            icon={<PlusOutlined />}
                                            loading={loading}
                                            className="button-primary"
                                        >
                                            ตรวจสอบ
                                        </Button>
                                    </Space>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
    
                    <Col className="col-right">
                        <Card className="card">
                            <h2 className="title-secondary">รายการตั๋ว</h2>
                            <Form onFinish={FindBusTimeTickets}>
                                <Form.Item
                                    name="findBusTimeTicket"
                                    rules={[{ required: true, message: "กรุณาเลือกวันเวลาเดินทาง" }]}
                                >
                                    <Select
                                        allowClear
                                        style={{ color: "black" }}
                                        placeholder="เลือกวันเวลาเดินทาง"
                                        onChange={handleRoundChange}
                                    >
                                        {busRounds.map((item) => (
                                            <Option
                                                value={`${item.DepartureDay}---${item.DepartureTime}`}
                                                key={`${item.ID}-${item.DepartureDay}-${item.DepartureTime}`}
                                            >
                                                {item.DepartureDay}---{item.DepartureTime}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<PlusOutlined />}
                                        loading={loading}
                                        className="button-primary"
                                    >
                                        จัดไป
                                    </Button>
                                </Form.Item>
                            </Form>
    
                            <Table
                                rowKey="ticket_number"
                                columns={columns}
                                dataSource={verifier}
                                pagination={{ pageSize: 5 }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
    );
};

export default Verifier;
