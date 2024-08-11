// src/components/Seat.tsx

import React from 'react';
import { Seat as SeatType } from '../types/types';

interface SeatProps {
  seat: SeatType;
}

const Seat: React.FC<SeatProps> = ({ seat }) => {
    const backgroundColor = seat.isVerified ? 'green' : seat.isOccupied ? 'red' : 'gray';


  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        backgroundColor,
        margin: '5px',
        display: 'inline-block',
        textAlign: 'center',
        lineHeight: '30px',
        color: 'white',
      }}
    >
      {seat.number}
    </div>
  );
};

export default Seat;