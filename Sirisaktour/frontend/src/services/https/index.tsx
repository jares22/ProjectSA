// services/https/index.ts
import { TicketVerificationResponse,UpdateSeatStatusRequest } from "../../interfaces/ticketVerification";

const apiUrl = "http://localhost:8000";




export async function VerifyTicket(data: { ticketNumber: string }): Promise<TicketVerificationResponse> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/verify-ticket`, requestOptions);
    if (response.ok) {
      const result: TicketVerificationResponse = await response.json();
      return result;
    } else {
      const errorText = await response.text();
      throw new Error(errorText || "ล้มเหลวในการดึงข้อมูล");
    }
  } catch (error) {
    throw new Error((error as Error).message || "เกิดข้อผิดพลาดในการเชื่อมต่อ!");
  }
}


export async function GetVerifiers() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let res = await fetch(`${apiUrl}/ticket`, requestOptions) //ตอนBackend ส้งข้อมูลมา res เป็นตัวรับ (await เป็นตัวรอการตอบกลับจาก Backend) 
    .then((res) => {
      if (res.status == 200) {//HTTP Status Code 200 หมายความว่าคำขอ (request) ที่ส่งไปยังเซิร์ฟเวอร์ได้รับการดำเนินการสำเร็จ
        return res.json();
      } else {
        return false;
      }
    });

  return res;
}

export async function UpdateSeatStatus(data: UpdateSeatStatusRequest): Promise<void> {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/update-seat-status`, requestOptions);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update seat status");
    }
  } catch (error) {
    throw new Error((error as Error).message || "Connection error!");
  }
}