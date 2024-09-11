import React, { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message, Table, Select } from "antd";
import { VerifyTicket, GetVerifiers, UpdateSeatStatus, fetchBusRounds } from "../services/https";
import { TicketVerification } from "../interfaces/ticketVerification";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined } from "@ant-design/icons";
import { BusRound } from "../interfaces/busrounds";
import Item from "antd/es/list/Item";
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
  const [busRounds, setBusRounds] = useState<BusRound[] & { [key: string]: any }>([]);
  const [selectedRound, setSelectedRound] = useState<string | undefined>();

  const handleVerification = async (values: TicketVerification) => {
    setLoading(true);
    try {
      const result = await VerifyTicket({ ticketNumber: values.ticketNumber });
      setLoading(false);
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
      if (res) {
        setVerifier(res);
      }
    } catch (error) {
      console.error("Error fetching verifiers:", error);
    }
  };

  const getBusRounds = async () => {
   let res = await fetchBusRounds();
   console.log("getBusRounds: ", res);
   setBusRounds(res);
  };

  const FindBusTimeTickets = (values: any) => {
    console.log("Before FindBusTimeTickets: ", values);

    // แยกวันและเวลาออกจากสตริง
    const allData = values.findBusTimeTicket.split('---');

    // จัดเก็บค่าในตัวแปร day และ time
    const day = allData[0].trim();
    const time = allData[1].trim();

    console.log("Day:", day);
    console.log("Time:", time);
};

  
  


  const handleRoundChange = (value: string) => {
    setSelectedRound(value);
    // Additional actions can be handled here if needed after selecting a bus round
  };

  useEffect(() => {
    getVerifiers();
    getBusRounds();
  }, []);

  return (
    <div style={{ padding: "0", backgroundColor: "#EFEFEF", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {contextHolder}

      <Row gutter={0} style={{ flex: 1, height: "100%", overflow: "hidden", position: "relative" }}>
        <Col
          span={12}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "20px",
            position: "absolute",
            left: 0,
            width: "50%",
          }}
        >
          <Card
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              overflowY: "auto",
              height: "calc(100vh - 40px)",
            }}
          >
            <h1 style={{ textAlign: "center", color: "#333333", marginBottom: "16px" }}>ตรวจสอบตั๋ว</h1>
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

        <Col
          span={12}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
            padding: "20px",
            position: "absolute",
            right: 0,
            width: "50%",
          }}
        >
          <Card
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              overflowY: "auto",
              height: "calc(100vh - 40px)",
            }}
          >
            <h2 style={{ textAlign: "center", color: "#333333", marginBottom: "16px" }}>รายการตั๋ว</h2>
            
            <Form onFinish={FindBusTimeTickets}>
            <Form.Item
              name="findBusTimeTicket"
              rules={[{ required: true, message: "กรุณาเลือกวันเวลาเดินทาง" }]} // เพิ่ม validation ให้แน่ใจว่ามีการเลือกค่า
            >
              <Select
                allowClear
                style={{ color: "black" }}
                placeholder="เลือกวันเวลาเดินทาง"
              >
                {busRounds.map((item) => (
            <Option
              value={`${item.DepartureDay}---${item.DepartureTime}`} // ส่งออกเป็นค่าที่มีขีด
              key={item.ID}
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
                style={{
                  borderRadius: "8px",
                  backgroundColor: "#F7B22C",
                  borderColor: "#F7B22C",
                }}
              >
                จัดไป
              </Button>
            </Form.Item>
          </Form>

            <Table
              rowKey="ticketNumber"
              columns={columns}
              dataSource={verifier}
              pagination={false}
              style={{ backgroundColor: "#FFF", borderRadius: "8px" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Verifier;
