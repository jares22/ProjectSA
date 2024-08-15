import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [navOpen, setNavOpen] = useState(true);
  const navigate = useNavigate();

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

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="app-container">
      <div className={`sidebar ${navOpen ? 'open' : 'closed'}`}>
        <button className="nav-toggle" onClick={toggleNav}>
          {navOpen ? '<<' : '>>'}
        </button>
        <nav className="nav-links">
          <a href="/app">Home</a>
          <a href="/confirmation">Confirmation</a>
          <a href="/schedule">Schedule</a>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>
      <div className={`main-content ${navOpen ? 'shifted' : ''}`}>
        <header className="header">
          <h1>Bus Ticket Verification System</h1>
        </header>
        <div className="content-wrapper">
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
