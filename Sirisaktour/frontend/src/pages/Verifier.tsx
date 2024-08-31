import React, { useState } from "react";
import { Space, Button, Col, Row, Divider, Form, Input, Card, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { VerifyTicket } from "../services/https";
import { TicketVerification } from "../interfaces/ticketVerification";

const Verifier: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleVerification = async (values: TicketVerification) => {
    setLoading(true);
    try {
      const result = await VerifyTicket({ ticketNumber: values.ticketNumber });
      setLoading(false);
      console.log("ผลลัพธ์จาก API:", result); // 
      if (result.isValid) { // Check if the response indicates a valid ticket
        messageApi.open({
          type: "success",
          content: `การตรวจสอบสำเร็จ! หมายเลขตั๋ว: ${result.ticketNumber}, สถานะที่นั่ง: ${result.seatStatus}`,
        });
        form.resetFields();
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

  return (
    <div>
      {contextHolder}
      <Card style={{ width: "100%", maxWidth: "800px", margin: "auto", backgroundColor: "#F7B22C" }}>
        <h1>ตรวจสอบตั๋ว</h1>
        <Divider />
        <Form form={form} name="verification" layout="vertical" onFinish={handleVerification} autoComplete="off">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="หมายเลขตั๋ว"
                name="ticketNumber"
                rules={[
                  { required: true, message: "กรุณากรอกหมายเลขตั๋ว!" },
                ]}
              >
                <Input />
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

      
    </div>
  );
};

export default Verifier;
