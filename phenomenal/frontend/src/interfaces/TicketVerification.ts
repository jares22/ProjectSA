// TicketVerification represents the structure for ticket verification data
export interface TicketVerification {
    ticket_number: string;
    seat_status: string;
    phone_number: string;
    bus_id: number;
}

// TicketVerificationResponse represents the response structure for ticket verification
export interface TicketVerificationResponse {
    isValid: boolean;
    success: boolean;
    ticketNumber?: string;
    seatStatus?: string;
    message?: string;
}

// UpdateSeatStatusRequest represents the request body for updating seat status
export interface UpdateSeatStatusRequest {
    ticketNumber: string;
    seatStatus: string;
}

// src/interfaces/Ticket.ts

  
