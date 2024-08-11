// src/components/BusLayout.tsx

import React from 'react';
import Seat from './Seat';
import { Seat as SeatType } from '../types/types';

interface BusLayoutProps {
  seats: SeatType[];
}

const BusLayout: React.FC<BusLayoutProps> = ({ seats }) => {
  return (
    <div>
      <h2>Bus Layout</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '400px' }}>
        {seats.map((seat) => (
          <Seat key={seat.number} seat={seat} />
        ))}
      </div>
    </div>
  );
};

export default BusLayout;