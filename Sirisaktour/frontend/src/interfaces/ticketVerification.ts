// interfaces/ticketVerification.ts
export interface TicketVerification {
  [x: string]: string;
  ticketNumber: string;
}

export interface TicketVerificationResponse {
  isValid: any;
  success: boolean;
  ticketNumber?: string;
  seatStatus?: string;
  message?: string;
}
export interface UpdateSeatStatusRequest {
  ticketNumber: string;
  seatStatus: string;
}
