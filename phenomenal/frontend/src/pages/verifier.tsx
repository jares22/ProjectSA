import React, { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Col, Row, Card, Table, Space, Button, Divider, Form, Input, message, Select } from "antd";
import { VerifyTicket, GetVerifiers, UpdateSeatStatus, fetchBusRounds } from "../services/https";
import { TicketVerification } from "../interfaces/TicketVerification";
import type { ColumnsType } from "antd/es/table";
import { BusRound } from "../interfaces/busrounds"; // Assuming you use BusRound somewhere in the code
import { useNavigate } from "react-router-dom";
import './Verification.css';

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
            dataIndex: "passenger_id",
            key: "busRoute",
        },
    ];

    const [verifierValue, setVerifier] = useState<TicketVerification[] & any>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [busRounds, setBusRounds] = useState<BusRound[]>([]);
    const [selectedRound, setSelectedRound] = useState<string | undefined>();


    
    const handleVerification = async (values: TicketVerification) => {
        setLoading(true);
        try {
            const result = await VerifyTicket(values);
            console.log("VerifyTicket-->666", result);
            setLoading(false);

            if (result) {
                try {
                    await UpdateSeatStatus({
                        ticketNumber: result.ticket_number!,
                        seatStatus: "ตรวจสอบแล้ว",
                    });
                    messageApi.success(`การตรวจสอบสำเร็จ! หมายเลขตั๋ว: ${result.ticket_number}, สถานะที่นั่ง: ${result.seatStatus}`);
                    form.resetFields();
                } catch (updateError) {
                    const errorMessage = (updateError as Error).message || "อัพเดตสถานะที่นั่งไม่สำเร็จ!";
                    messageApi.error(`อัพเดตสถานะที่นั่งไม่สำเร็จ! ${errorMessage}`);
                }
            } else {
                messageApi.error(`ตั๋วไม่ถูกต้อง! ${result.message}`);
            }
        } catch (error) {
            setLoading(false);
            const errorMessage = (error as Error).message || "เกิดข้อผิดพลาดในการเชื่อมต่อ!";
            messageApi.error(`เกิดข้อผิดพลาดในการเชื่อมต่อ! ${errorMessage}`);
        }


    };

    const handleCancel = () => {
        form.resetFields();
        messageApi.info("การกรอกข้อมูลถูกยกเลิก");
    };

    // const getVerifiers = async () => {
    //     try {

    //         const res = await GetVerifiers();
    //         console.log("GetVerifiers-->", res);
    //         if (res) {
    //             setVerifier(res);

    //         }
    //     } catch (error) {
    //         console.error("Error fetching verifiers:", error);

    //     }
    // };

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
        // Split the selected value to get day, time, and bustiming_id
        const allData = values.findBusTimeTicket.split('---');
        const day = allData[0].trim();
        const time = allData[1].trim();
        const bustiming_id = allData[2].trim(); // Assuming the ID is included

        console.log("Day:", day);
        console.log("Time:", time);
        console.log("Bustiming ID:", bustiming_id);

        try {
            // Display selected travel date and time
            messageApi.info(`คุณเลือกวันเวลาเดินทาง: ${day} เวลา ${time}`);

            // Fetch tickets using bustiming_id
            const result = await GetVerifiers(bustiming_id);
            setVerifier(result);

            messageApi.success("ค้นหาตั๋วสำเร็จ!");
        } catch (error) {
            console.error("Error fetching tickets:", error);
            messageApi.error("ค้นหาตั๋วล้มเหลว!");
        }
    };

    // Function to handle changes in the travel round dropdown
    const handleRoundChange = (value: string) => {
        setSelectedRound(value);
        messageApi.info(`คุณเลือกวันเวลาเดินทาง: ${value}`);
        console.log("Selected Round:", value);
    };


    useEffect(() => {
        //getVerifiers();
        getBusRounds();
    }, []);

    return (
        <div>
            {contextHolder}
            <Row gutter={32}>
                <Col span={12}>
                    <Card className="card">
                        <h1 className="title-main">ตรวจสอบตั๋ว</h1>
                        <Divider />
                        <Form form={form} name="verification" layout="vertical" onFinish={handleVerification} autoComplete="off">
                            <Form.Item
                                label="หมายเลขตั๋ว"
                                name="ticketNumber"
                                rules={[{ required: true, message: "กรุณากรอกหมายเลขตั๋ว!" }]}
                            >
                                <Input placeholder="กรอกหมายเลขตั๋วที่นี่" style={{ borderRadius: "8px" }} />
                            </Form.Item>
                            <Row justify="end">
                                <Space>
                                    <Button onClick={handleCancel} style={{ borderRadius: "8px" }}>
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<PlusOutlined />}
                                        loading={loading}
                                        style={{ borderRadius: "8px", backgroundColor: "#F7B22C", borderColor: "#F7B22C" }}
                                    >
                                        ตรวจสอบ
                                    </Button>
                                </Space>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                <Col span={12}>
                    <Card>
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
                                            // Include bustiming_id in the value, separated by '---'
                                            value={`${item.departure_day}---${item.departure_time}---${item.id}`}
                                            key={`${item.id}-${item.departure_day}-${item.departure_time}`}
                                        >
                                            {item.departure_day}---{item.departure_time}
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
                            dataSource={verifierValue}
                            pagination={{ pageSize: 5 }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Verifier;
