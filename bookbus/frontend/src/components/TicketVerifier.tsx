// src/components/TicketVerifier.tsx

import React, { useState } from 'react';
import { Ticket } from '../types/types';
import './TicketVerifier.css'; // Import the CSS file

interface TicketVerifierProps {
  tickets: Ticket[];
  onVerify: (ticketId: string) => void;
}

const TicketVerifier: React.FC<TicketVerifierProps> = ({ tickets, onVerify }) => {
  const [ticketId, setTicketId] = useState('');

  const handleVerify = () => {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (ticket) {
      if (ticket.isVerified) {
        alert('This ticket has already been verified.');
      } else {
        onVerify(ticketId);
        alert('Ticket verified successfully!');
      }
      setTicketId('');
    } else {
      alert('Invalid ticket ID');
    }
  };

  return (
    <div className="ticket-verifier-container">
      <h2>Ticket Verifier</h2>
      <input
        type="text"
        value={ticketId}
        onChange={(e) => setTicketId(e.target.value)}
        placeholder="Enter ticket ID"
      />
      <button onClick={handleVerify}>Verify Ticket</button>
    </div>
  );
};

export default TicketVerifier;
