import React, { useState, useEffect } from 'react';
import BusLayout from './components/BusLayout';
import TicketVerifier from './components/TicketVerifier';
import { Ticket, Seat } from './types/types';

const API_BASE_URL = 'http://localhost:8080';

const App: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [ticketsResponse, seatsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/tickets`),
        fetch(`${API_BASE_URL}/api/seats`)
      ]);

      if (!ticketsResponse.ok || !seatsResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const ticketsData = await ticketsResponse.json();
      const seatsData = await seatsResponse.json();

      setTickets(ticketsData);
      setSeats(seatsData);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (ticketId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tickets/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ticketId }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to verify ticket: ${response.status} ${errorText}`);
      }
  
      // Fetch the updated ticket data
      const updatedTicket = await response.json();
  
      // Update the seats state based on the verified ticket
      setSeats(prevSeats =>
        prevSeats.map(seat =>
          seat.number === updatedTicket.seatNumber
            ? { ...seat, isVerified: true }
            : seat
        )
      );
  
      setError(null);
      alert('Ticket verified successfully!');
    } catch (error: any) {
      console.error('Error verifying ticket:', error);
  
      const errorMessage = error instanceof Error
        ? error.message
        : error.toString();
  
      setError(`Failed to verify ticket: ${errorMessage}`);
  
      // If the error is a network error, provide a more specific message
      if (errorMessage.includes('Failed to fetch')) {
        setError('Failed to verify ticket: Unable to reach the server. Please check your network connection or try again later.');
      }
    }
  };
  

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Bus Ticket Verification System</h1>
      <TicketVerifier tickets={tickets} onVerify={handleVerify} />
      <BusLayout seats={seats} />
    </div>
  );
};

export default App;
