// interfaces/ticketVerification.ts
export interface TicketVerification {
  ticketNumber: string;
}

export interface TicketVerificationResponse {
  isValid: any;
  success: boolean;
  ticketNumber?: string;
  seatStatus?: string;
  message?: string;
}
