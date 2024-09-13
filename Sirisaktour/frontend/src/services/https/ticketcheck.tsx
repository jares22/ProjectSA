// import { TicketcheckInterface } from "../../interface/ITicketcheck.ts";

// import { message } from "antd";

const apiUrl = "http://localhost:8000/api";  // ปรับให้ตรงกับเส้นทาง API

// ฟังก์ชันสำหรับเช็คอินด้วย TicketID
async function Checkin(TicketID: Number) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ticket_id: TicketID,
      time_stamp: new Date().toISOString(), // กำหนด timestamp
      status: "Check in", // สถานะของการเช็คอิน
    }),
  };

  try {
    const response = await fetch(`${apiUrl}/checkin/${TicketID}`, requestOptions);
    const res = await response.json();

    if (res.success) {
      return { status: true, message: "complete" };
    } else if (response.status === 409) {
      return { status: false, message: "failed" };
    } else {
      return { status: false, message: "Ticket not found" };
    }
  } catch (error) {
    return { status: false, message: "failed" };
  }
}



// ฟังก์ชันสำหรับดึงข้อมูลทั้งหมดใน ticketcheck
async function GetTicketcheck() {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${apiUrl}/checkin`, requestOptions);  // แก้ไขเส้นทางตรงนี้
    const res = await response.json();

    if (res.data) {
      return res.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching ticket check data:", error);
    return false;
  }
}



// ฟังก์ชันสำหรับลบข้อมูลใน ticketcheck ตาม ID
async function DeleteTicketcheckByID(id: number | undefined) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${apiUrl}/ticketcheck/${id}`, requestOptions);  // แก้ไขเส้นทางตรงนี้
    const res = await response.json();

    if (res.data) {
      return res.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting ticket check:", error);
    return false;
  }
}

// ฟังก์ชันสำหรับดึงข้อมูล ticketcheck ตาม ID
async function GetTicketcheckById(id: number | undefined) {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${apiUrl}/ticketcheck/${id}`, requestOptions);  // แก้ไขเส้นทางตรงนี้
    const res = await response.json();

    if (res.data) {
      return res.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching ticket check by ID:", error);
    return false;
  }
}

// Export functions
export {
  Checkin,
  // Checkduplication,
  GetTicketcheck,
  DeleteTicketcheckByID,
  GetTicketcheckById,
};
