// services/https/index.ts

const apiUrl = "http://localhost:8000";

export interface TicketVerificationResponse {
  success: any;
  isValid: boolean;
  ticketNumber?: string;
  seatStatus?: string;
  message?: string;
}

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
