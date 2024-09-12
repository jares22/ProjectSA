// TicketVerification represents the structure for ticket verification data
export interface TicketVerification {
    //[x: string]: string;
    bus_id: number;
    passenger_id: number;
    phone_number: string;
    seat_status: string;
    ticket_number: string; 
    bustiming_id?: number;
}

// TicketVerificationResponse represents the response structure for ticket verification
export interface TicketVerificationResponse {
    isValid: boolean;
    ticket_number?: string;
    seatStatus?: string;
    message?: string;
}


// UpdateSeatStatusRequest represents the request body for updating seat status
export interface UpdateSeatStatusRequest {
    ticketNumber: string;
    seatStatus: string;
}

// src/interfaces/Ticket.ts

  
