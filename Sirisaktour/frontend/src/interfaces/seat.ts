

export interface SeatProps {
  seat: string;
  isBooked: boolean;
  isSelected: boolean;
  onSelect: (seat: string) => void;
}

export interface Seat {
    number: number;
    isOccupied: boolean;
    isVerified: boolean;
  }


