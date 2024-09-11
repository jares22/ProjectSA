// services/https/index.ts
import { TicketVerification, TicketVerificationResponse, UpdateSeatStatusRequest } from "../../interfaces/TicketVerification";
import { BusRound } from "../../interfaces/busrounds";

const apiUrl = "http://localhost:8000";

// Verify Ticket Function
export async function VerifyTicket(data: { ticketNumber: string }): Promise<TicketVerificationResponse> {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(`${apiUrl}/verify-ticket`, requestOptions);
    console.log("VerifyTicket->", response);
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

// Get Verifiers Function
export async function GetVerifiers(): Promise<TicketVerification[]> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  const res = await fetch(`${apiUrl}/ticket`, requestOptions).then((res) => {
    console.log("GetVerifiers->", res);
    if (res.status === 200) {
      return res.json();
    } else {
      return false;
    }
  });

  return res;
}

// Update Seat Status Function
export async function UpdateSeatStatus(data: UpdateSeatStatusRequest): Promise<void> {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

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

// Fetch Verifiers Function
export async function fetchVerifiers(busRound: string): Promise<TicketVerification[]> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(`${apiUrl}/verifiers?busRound=${busRound}`, requestOptions);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Failed to fetch verifiers");
    }
  } catch (error) {
    throw new Error((error as Error).message || "Connection error!");
  }
}
