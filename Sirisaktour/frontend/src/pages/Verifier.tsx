import React, { useState, useEffect } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message, Table } from "antd";
import { VerifyTicket, GetgetVerifiers, UpdateSeatStatus } from "../services/https";
import { TicketVerification } from "../interfaces/ticketVerification";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Verifier: React.FC = () => {
  const columns: ColumnsType<TicketVerification> = [
    {
      title: "Ticket Number",
      dataIndex: "TicketNumber",
      key: "ticketNumber", // Unique key for the column
    },
    {
      title: "Seat Status",
      dataIndex: "SeatStatus",
      key: "seatStatus", // Unique key for the column
    },
    {
      title: "จัดการ",
      dataIndex: "Manage",
      key: "manage", // Unique key for the column
      render: (_text, _record, index) => (
        <>
          <Button key={`edit-${index}`} shape="circle" icon={<EditOutlined />} size={"large"} />
          <Button key={`delete-${index}`} style={{ marginLeft: 10 }} shape="circle" icon={<DeleteOutlined />} size={"large"} danger />
        </>
      ),
    },
  ];
  

  const [Verifier, setVerifier] = useState<TicketVerification[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleVerification = async (values: TicketVerification) => {
    setLoading(true);
    try {
      const result = await VerifyTicket({ ticketNumber: values.ticketNumber });
      setLoading(false);
      console.log("ผลลัพธ์จาก API:", result);
  
      if (result.isValid) {
        try {
          // Log the result before calling UpdateSeatStatus
          console.log("ผลลัพธ์จาก API:", result);
  
          await UpdateSeatStatus({
            ticketNumber: result.ticketNumber!,
            seatStatus: "ตรวจสอบแล้ว", // Example status: "Checked"
          });
  
          messageApi.open({
            type: "success",
            content: `การตรวจสอบสำเร็จ! หมายเลขตั๋ว: ${result.ticketNumber}, สถานะที่นั่ง: ${result.seatStatus}`,
          });
  
          form.resetFields();
        } catch (updateError) {
          // Cast updateError to Error type to access its message property
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
    let res = await GetgetVerifiers();
    console.log(res);
    if (res) {
      setVerifier(res);
    }
  };

  useEffect(() => {
    getVerifiers();
  }, []);

  

  return (
    <div style={{ padding: '20px', backgroundColor: '#F7F7F7' }}>
      {contextHolder}
      <Row gutter={16}>
        <Col span={12}>
          <Card style={{ width: "100%", backgroundColor: "#F7B22C", borderRadius: '8px' }}>
            <h1 style={{ textAlign: 'center' }}>ตรวจสอบตั๋ว</h1>
            <Divider />
            <Form form={form} name="verification" layout="vertical" onFinish={handleVerification} autoComplete="off">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Form.Item
                    label="หมายเลขตั๋ว"
                    name="ticketNumber"
                    rules={[{ required: true, message: "กรุณากรอกหมายเลขตั๋ว!" }]}
                  >
                    <Input placeholder="กรอกหมายเลขตั๋วที่นี่" />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="end">
                <Col>
                  <Space>
                    <Button htmlType="button" style={{ marginRight: "10px" }} onClick={handleCancel}>
                      ยกเลิก
                    </Button>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
                      ตรวจสอบ
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ width: "100%", backgroundColor: '#FFF', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>รายการตั๋ว</h2>
            <Table
              rowKey="ticketNumber"
              columns={columns}
              dataSource={Verifier}
              pagination={false}
              style={{ backgroundColor: '#FFF' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Verifier;
