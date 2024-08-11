// src/App.tsx

import React, { useState } from 'react';
import BusLayout from './components/BusLayout';
import TicketVerifier from './components/TicketVerifier';
import { Ticket, Seat } from './types/types';
import './App.css';

const initialTickets: Ticket[] = Array.from({ length: 50 }, (_, i) => ({
  id: `T${String(i + 1).padStart(3, '0')}`,
  seatNumber: i + 1,
  isVerified: false,
}));

const initialSeats: Seat[] = Array.from({ length: 50 }, (_, i) => ({
  number: i + 1,
  isOccupied: initialTickets.some((t) => t.seatNumber === i + 1),
  isVerified: false,
}));

const App: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const handleVerify = (ticketId: string) => {
    const ticketIndex = tickets.findIndex((t) => t.id === ticketId);
    if (ticketIndex !== -1) {
      const updatedTickets = [...tickets];
      updatedTickets[ticketIndex].isVerified = true;
      setTickets(updatedTickets);

      const seatNumber = updatedTickets[ticketIndex].seatNumber;
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.number === seatNumber ? { ...seat, isVerified: true } : seat
        )
      );
    }
  };

  return (
    <div className="app-container">
      <div>
        <h1>Bus Ticket Verification System</h1>
        <div className="main-content">
          <div className="bus-layout-container">
            <BusLayout seats={seats} />
          </div>
          <div className="ticket-verifier-container">
            <TicketVerifier tickets={tickets} onVerify={handleVerify} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
