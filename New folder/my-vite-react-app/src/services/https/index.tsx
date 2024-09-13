// services/https/index.ts
import { TicketVerification, UpdateSeatStatusRequest } from "../../interfaces/TicketVerification";
import { BusRound } from "../../interfaces/busrounds";

const apiUrl = "http://localhost:8001";



// Verify Ticket Function
export async function VerifyTicket(data: TicketVerification) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  // ส่งคำขอไปยัง API ที่ URL ที่กำหนดใน apiUrl
  const res = await fetch(`${apiUrl}/verify-ticket`, requestOptions).then((res) => {
    console.log("VerifyTicket->", res);
    // ตรวจสอบสถานะของคำตอบ
    if (res.status === 200) {
      // แปลงคำตอบเป็น JSON หากสถานะสำเร็จ
      return res.json();
    } else {
      // ส่งกลับ false ถ้าสถานะไม่ใช่ 200
      return false;
    }
  });
  
  // ส่งผลลัพธ์ที่ได้กลับไป
  return res;
}


// Get Verifiers Function
// export async function GetVerifiers(bustiming_id?: any): Promise<TicketVerification[]> {
//   const requestOptions = {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   };

//   const res = await fetch(`${apiUrl}/ticket`, requestOptions).then((res) => {
//     console.log("GetVerifiers->", res);
//     if (res.status === 200) {
//       return res.json();
//     } else {
//       return false;
//     }
//   });

//   return res;
// }




export async function GetVerifiers(bustiming_id?: string): Promise<TicketVerification[]> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  // Pass the bustiming_id as a query parameter if provided
  const url = bustiming_id ? `${apiUrl}/verifiers?bustiming_id=${bustiming_id}` : `${apiUrl}/ticket`;
  const res = await fetch(url, requestOptions);
  console.log("GetVerifiers->", res);
  if (res.status === 200) {
    return res.json();
  } else {
    throw new Error("Failed to fetch verifiers");
  }
}




// Update Seat Status Function
export async function UpdateSeatStatus(data: UpdateSeatStatusRequest): Promise<void> {
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  console.log("UpdateSeatStatus->8888", requestOptions);

  try {
    const response = await fetch(`${apiUrl}/update-seat-status`, requestOptions);
    console.log("UpdateSeatStatus->", response);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update seat status");
    }
  } catch (error) {
    throw new Error((error as Error).message || "Connection error!");
  }
}





// Fetch Bus Rounds Function
export async function fetchBusRounds(): Promise<BusRound[]> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(`${apiUrl}/bus-rounds`, requestOptions);
    console.log("fetchBusRounds->", response);
    if (response.ok) {
      const data: BusRound[] = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch bus rounds");
    }
  } catch (error) {
    throw new Error((error as Error).message || "Connection error!");
  }
}



