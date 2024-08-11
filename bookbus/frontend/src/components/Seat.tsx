// src/components/Seat.tsx

import React from 'react';
import { Seat as SeatType } from '../types/types';
import { UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import './Seat.css'; // Import CSS file

interface SeatProps {
  seat: SeatType;
  onClick: (seatNumber: number) => void;
}

const Seat: React.FC<SeatProps> = ({ seat, onClick }) => {
  const backgroundColor = seat.isVerified
    ? 'green'
    : seat.isOccupied
    ? 'red'
    : 'gray';

  return (
    <Tooltip title={`Seat ${seat.number}`} placement="top">
      <div
        className="seat"
        style={{ backgroundColor }}
        onClick={() => onClick(seat.number)} // Handle click event
      >
        <UserOutlined style={{ color: 'white', fontSize: '24px' }} />
      </div>
    </Tooltip>
  );
};

export default Seat;
