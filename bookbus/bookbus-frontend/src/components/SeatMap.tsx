import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SeatMap.scss';

interface Seat {
  ID: number;
  BusID: number;
  SeatNumber: string;
}

const SeatMap: React.FC = () => {
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    axios.get('/api/seats')
      .then(response => {
        setSeats(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the seats!', error);
      });
  }, []);

  return (
    <div className="seat-map">
      {seats.map(seat => (
        <div key={seat.ID} className="seat">
          {seat.SeatNumber}
        </div>
      ))}
    </div>
  );
}

export default SeatMap;
