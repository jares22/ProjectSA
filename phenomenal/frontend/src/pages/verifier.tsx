import React, { useState, useEffect, useCallback } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Col, Row, Card, Table, Space, Button, Divider, Form, Input, message, Select } from "antd";
import { VerifyTicket, GetVerifiers, UpdateSeatStatus, fetchBusRounds, TicketVerifycation } from "../services/https";
import { TicketVerification } from "../interfaces/TicketVerification";
import type { ColumnsType } from "antd/es/table";
import { BusRound } from "../interfaces/busrounds";
import { QrReader } from 'react-qr-reader';

import './Verification.css';

interface QRScannerProps {
    onScan: (data: string) => void;
  }
  
  const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
    const [startScan, setStartScan] = useState(false);
  
    const handleScan = (result: any) => {
      if (result) {
        onScan(result?.text);
        setStartScan(false);
        message.success('QR Code scanned successfully!');
      }
    };
  
    const handleError = (error: any) => {
      console.error(error);
      message.error('Error scanning QR Code');
    };
  
    return (
      <div>
        <Button onClick={() => setStartScan(!startScan)} style={{ marginBottom: '10px' }}>
          {startScan ? 'Stop Scan' : 'Start QR Scan'}
        </Button>
        {startScan && (
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '300px', height: '300px' }}
          />
        )}
      </div>
    );
  };


const { Option } = Select;

const Verifier: React.FC = () => {
    const columns: ColumnsType<TicketVerification> = [
        {
            title: "Ticket Number",
            dataIndex: "key_ticket",
            key: "ticketNumber",
        },
        {
            title: "Seat Status",
            dataIndex: "status",
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
            title: "Depart Day",
            dataIndex: "departdate",
            key: "departdate",
        },
        {
            title: "Depart Time",
            dataIndex: "departtime",
            key: "departtime",
        },
    ];

    const [verifierValue, setVerifier] = useState<TicketVerification[] & any>([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [busRounds, setBusRounds] = useState<BusRound[]>([]);
    const [selectedRound, setSelectedRound] = useState<string>("");

    const handleVerification = async (values: TicketVerification) => {
        setLoading(true);
        try {
            const result = await VerifyTicket(values);
            console.log("VerifyTicket-->666", result);
            
    
            if (result) {
                let newStatus = "";
                console.log("result.status", result.status);
                if (result.status === "Pass") {
                    newStatus = "Verified";
                } else {
                    newStatus = "สถานะปัจจุบันไม่สามารถตรวจสอบได้"; // หรือสถานะที่คุณต้องการให้แสดง
                }
            setLoading(false);
                try {
                    await UpdateSeatStatus({
                        key_ticket: result.key_ticket!,
                        Status: newStatus,
                      });
    
                    messageApi.success(`การตรวจสอบสำเร็จ! หมายเลขตั๋ว: ${result.ticket_number}, สถานะที่นั่ง: ${newStatus}`);
    
                    // const storedDriverId = localStorage.getItem("driver_id");
                     const driverId = 1;
                    //  storedDriverId ? parseInt(storedDriverId, 10) : 1;
    
                    const ticketVerificationData = {
                        passenger_id: result.passenger_id,
                        driver_id: driverId,
                        status: newStatus
                    };
                    console.log("TicketVerificationData:", ticketVerificationData);
                    await TicketVerifycation(ticketVerificationData);
                    console.log("Ticket verification created successfully:", ticketVerificationData);
    
                    form.resetFields();
    
                    // Refetch the data to update the table
                    if (selectedRound) {
                        const allData = selectedRound.split(',');
                        const bustiming_id = allData[2].trim();
                        const newResult = await GetVerifiers(bustiming_id);
                        setVerifier(newResult);
                    }
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

    const getBusRounds = async () => {
        try {
            const res = await fetchBusRounds();
            console.log("1:ดึงเวลาของรถมาเลือก", res);
            if (res) {
                setBusRounds(res);
            }
        } catch (error) {
            console.error("Error fetching bus rounds:", error);
        }
    };

    const FindBusTimeTickets = async (values: any) => {
        const allData = values.findBusTimeTicket.split(',');
        const day = allData[0].trim();
        const time = allData[1].trim();
        const bustiming_id = allData[2].trim();

        console.log("Day:", day);
        console.log("Time:", time);
        //console.log("Bustiming ID:", bustiming_id);

        try {
            const result = await GetVerifiers(bustiming_id);
            setVerifier(result);
            console.log("GetVerifiers--..>", result);
            messageApi.success("ค้นหาตั๋วสำเร็จ!");

        } catch (error) {
            console.error("Error fetching tickets:", error);
            messageApi.error("ค้นหาตั๋วล้มเหลว!");
        }
    };

    const handleRoundChange = (value: string) => {
        setSelectedRound(value); // Store the selected round
        const allData = value.split(',');
        const day = allData[0].trim();
        const time = allData[1].trim();

        console.log("Day:", day);
        console.log("Time:", time);
        messageApi.info(`คุณเลือกวันเวลาเดินทาง: ${day} เวลา ${time}`);
        console.log("Selected Round:", value);
    };

    const handleQRScan = (data: string) => {
        form.setFieldsValue({ key_ticket: data });
        //handleVerification({ ticketNumber: data });
    };

    useEffect(() => {
        getBusRounds();
    }, []);

    return (
        <div className="container">
            {contextHolder}
            <Row gutter={0} style={{ flex: 1, height: "100%", overflow: "hidden", position: "relative" }}>
                <Col
                    span={12}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "50%",
                        padding: "20px",
                        left: 0,
                        width: "50%",
                    }}
                >
                    <Card className="card">
                        <h1 className="title-main">ตรวจสอบตั๋ว</h1>
                        <Divider />
                        <Form form={form} name="verification" layout="vertical" onFinish={handleVerification} autoComplete="off">
                            <Form.Item
                                label="หมายเลขตั๋ว"
                                name="key_ticket"
                                className="form-item"
                                rules={[{ required: true, message: "กรุณากรอกหมายเลขตั๋ว!" }]}>
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
                                        className="button-primary">
                                        ตรวจสอบ
                                    </Button>
                                </Space>
                            </Row>
                        </Form>
                        <Divider />
                        <QRScanner onScan={handleQRScan} />
                    </Card>
                </Col>

                <Col
                    span={12}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "right",
                        height: "100%",
                        padding: "20px",
                        right: 0,
                        width: "50%",
                    }}
                >
                    <Card className="card">
                        <h2 className="title-secondary">รายการตั๋ว</h2>
                        <Form onFinish={FindBusTimeTickets}>
                            <Form.Item
                                name="findBusTimeTicket"
                                className="form-item"
                                rules={[{ required: true, message: "กรุณาเลือกวันและเวลาเดินทาง!" }]}>
                                <Select placeholder="เลือกวันและเวลาเดินทาง" onChange={handleRoundChange}>
                                    {busRounds.map((round) => (
                                        <Option key={`${round.id}-${round.departure_day}-${round.departure_time}`} value={`${round.departure_day}, ${round.departure_time}, ${round.id}`}>
                                            {round.departure_day} - {round.departure_time}
                                        </Option>
                                    ))}
                                </Select>

                            </Form.Item>
                            <Row justify="end">
                                <Button type="primary" htmlType="submit" className="button-primary">
                                    ค้นหาตั๋ว
                                </Button>
                            </Row>
                        </Form>
                        <Divider />
                        <Table columns={columns} dataSource={verifierValue} rowKey="ticket_number" scroll={{ y: 400 }} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Verifier;
